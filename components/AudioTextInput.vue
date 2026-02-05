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

// Agregar texto final al campo
watch(finalText, (value) => {
  if (!value) return

  // Agregar con espacio si hay contenido previo
  const newValue = props.modelValue
    ? `${props.modelValue} ${value}`
    : value
  
  emit('update:modelValue', newValue.trim())
  finalText.value = ''
})

// Iniciar/detener grabación
const toggleRecording = () => {
  if (isRecording.value) {
    stop()
  } else {
    start()
  }
}
</script>

<template>
  <div class="audio-text-input">
    <button
      type="button"
      class="audio-btn"
      :class="{ 'recording': isRecording, 'disabled': !isSupported }"
      :disabled="!isSupported"
      @click="toggleRecording"
      :title="isSupported ? (isRecording ? 'Detener grabación' : 'Iniciar grabación de voz') : 'Micrófono no soportado'"
    >
      <span class="icon">{{ isRecording ? '⏹️' : '🎤' }}</span>
      <span class="label">{{ isRecording ? 'Grabando...' : 'Grabar' }}</span>
    </button>

    <!-- Texto en tiempo real -->
    <div v-if="showPreview && (interimText || isRecording)" class="preview-section">
      <small class="interim-text" :class="{ 'active': interimText }">
        {{ interimText || 'Escuchando...' }}
      </small>
    </div>

    <!-- Mensaje de soporte -->
    <small v-if="!isSupported" class="not-supported">
      ⚠️ Tu navegador no soporta reconocimiento de voz
    </small>
  </div>
</template>

<style scoped>
.audio-text-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.audio-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.audio-btn:active:not(:disabled) {
  transform: translateY(0);
}

.audio-btn.recording {
  background: #ef4444;
  animation: pulse 1.5s infinite;
}

.audio-btn.recording:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.audio-btn:disabled,
.audio-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 1.1rem;
}

.label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-section {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f0f9ff;
  border-left: 3px solid #667eea;
  border-radius: 0.375rem;
}

.interim-text {
  display: block;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.4;
  font-style: italic;
}

.interim-text.active {
  color: #667eea;
  font-weight: 500;
}

.not-supported {
  color: #dc2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 640px) {
  .audio-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .label {
    display: none;
  }
}
</style>
