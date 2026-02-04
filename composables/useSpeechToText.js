import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useSpeechToText(options = {}) {
  const {
    lang = 'es-CO',
    continuous = true
  } = options

  const isRecording = ref(false)
  const isSupported = ref(true)

  const interimText = ref('')
  const finalText = ref('')

  let recognition = null

  const start = () => {
    if (!recognition || isRecording.value) return
    recognition.start()
    isRecording.value = true
  }

  const stop = () => {
    if (!recognition || !isRecording.value) return
    recognition.stop()
    isRecording.value = false
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      isSupported.value = false
      return
    }

    recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = true // ✅ clave

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }

      interimText.value = interim.trim()

      if (final.trim()) {
        finalText.value = final.trim()
        interimText.value = '' // limpia interim al confirmar
      }
    }

    recognition.onend = () => {
      isRecording.value = false
      interimText.value = ''
    }
  })

  onBeforeUnmount(() => {
    if (recognition) recognition.stop()
  })

  return {
    interimText,
    finalText,
    isRecording,
    isSupported,
    start,
    stop
  }
}
