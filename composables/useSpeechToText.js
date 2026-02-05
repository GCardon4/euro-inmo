import { ref, onMounted, onBeforeUnmount } from 'vue'

// Composable para convertir audio a texto usando Web Speech API
export function useSpeechToText(options = {}) {
  const {
    lang = 'es-CO',
    continuous = true,
    interimResults = true
  } = options

  const isRecording = ref(false)
  const isSupported = ref(true)

  const interimText = ref('')
  const finalText = ref('')

  let recognition = null

  // Iniciar grabación de voz
  const start = () => {
    if (!recognition || isRecording.value) return
    recognition.start()
    isRecording.value = true
    interimText.value = ''
    finalText.value = ''
  }

  // Detener grabación de voz
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
    recognition.interimResults = interimResults

    // Procesar resultados de reconocimiento
    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          final += transcript + ' '
        } else {
          interim += transcript
        }
      }

      interimText.value = interim.trim()

      // Emitir texto final cuando se confirme
      if (final.trim()) {
        finalText.value = final.trim()
        interimText.value = ''
      }
    }

    // Manejar errores
    recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error)
      isRecording.value = false
    }

    // Limpiar estado cuando termina la grabación
    recognition.onend = () => {
      isRecording.value = false
      interimText.value = ''
    }
  })

  // Limpiar al desmontar el componente
  onBeforeUnmount(() => {
    if (recognition) {
      recognition.stop()
      recognition = null
    }
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
