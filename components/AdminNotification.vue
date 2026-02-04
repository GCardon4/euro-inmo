<template>
  <!-- Toasts de notificación -->
  <Teleport to="body">
    <div class="toast-container">
      <Transition v-for="n in notifications" :key="n.id" name="toast" appear>
        <div class="toast" :class="'toast-' + n.type">
          <span class="material-icons toast-icon">
            {{ n.type === 'success' ? 'check_circle' : 'error' }}
          </span>
          <span class="toast-message">{{ n.message }}</span>
          <button class="toast-close" @click="dismissNotification(n.id)">
            <span class="material-icons">close</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Diálogo de confirmación -->
    <Transition name="dialog">
      <div v-if="confirmState.visible" class="dialog-overlay" @click="resolveConfirm(false)">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header">
            <span class="material-icons dialog-icon">warning_amber</span>
            <h3>{{ confirmState.title }}</h3>
          </div>
          <p class="dialog-message">{{ confirmState.message }}</p>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="resolveConfirm(false)">Cancelar</button>
            <button class="btn-confirm" @click="resolveConfirm(true)">Confirmar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { notifications, confirmState, resolveConfirm, dismissNotification } = useNotification()
</script>

<style scoped>
/* ===== TOASTS ===== */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 450px;
}

.toast-success {
  background: #065f46;
  color: white;
}

.toast-error {
  background: #991b1b;
  color: white;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-shrink: 0;
}

.toast-close:hover {
  color: white;
}

.toast-close .material-icons {
  font-size: 1.125rem;
}

/* Animación toast */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* ===== DIÁLOGO DE CONFIRMACIÓN ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.dialog-box {
  background: white;
  border-radius: 0.75rem;
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.dialog-icon {
  font-size: 1.5rem;
  color: #d97706;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.dialog-message {
  color: #4b5563;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-confirm {
  padding: 0.625rem 1.25rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-confirm:hover {
  background: #b91c1c;
}

/* Animación diálogo */
.dialog-enter-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active .dialog-box {
  transition: transform 0.2s ease;
}

.dialog-leave-active {
  transition: opacity 0.15s ease;
}

.dialog-enter-from {
  opacity: 0;
}

.dialog-enter-from .dialog-box {
  transform: scale(0.95);
}

.dialog-leave-to {
  opacity: 0;
}
</style>
