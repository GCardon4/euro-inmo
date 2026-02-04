<script setup>
import { watch } from 'vue'
import { useSpeechToText } from '@/composables/useSpeechToText'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  showPreview: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const {
  interimText,
  finalText,
  isRecording,
  isSupported,
  start,
  stop
} = useSpeechToText()

watch(finalText, (value) => {
  if (!value) return

  emit(
    'update:modelValue',
    `${props.modelValue} ${value}`.trim()
  )

  finalText.value = ''
})
</script>

<template>
  <div class="audio-wrapper">
    <button
      type="button"
      class="audio-btn"
      :disabled="!isSupported"
      @click="isRecording ? stop() : start()"
    >
      <span v-if="!isRecording">🎤</span>
      <span v-else>⏹</span>
    </button>

    <!-- Texto en vivo -->
    <small
      v-if="showPreview && interimText"
      class="interim-text"
    >
      {{ interimText }}
    </small>
  </div>
</template>

<style scoped>
.audio-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.audio-btn {
  all: unset;
  cursor: pointer;
  font-size: 1.25rem;
}

.interim-text {
  font-size: 0.75rem;
  opacity: 0.6;
  font-style: italic;
}
</style>
