// Composable global para notificaciones y diálogos de confirmación
const notifications = ref([])
const confirmState = ref({
  visible: false,
  title: '',
  message: '',
  resolve: null
})

let notificationId = 0

export const useNotification = () => {
  // Mostrar notificación tipo toast
  const notify = (message, type = 'success') => {
    const id = ++notificationId
    notifications.value.push({ id, message, type })

    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 3000)
  }

  // Mostrar diálogo de confirmación (retorna Promise<boolean>)
  const confirmDialog = (message, title = 'Confirmar acción') => {
    return new Promise((resolve) => {
      confirmState.value = {
        visible: true,
        title,
        message,
        resolve
      }
    })
  }

  // Resolver el diálogo de confirmación
  const resolveConfirm = (result) => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(result)
    }
    confirmState.value = { visible: false, title: '', message: '', resolve: null }
  }

  // Cerrar una notificación manualmente
  const dismissNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    confirmState,
    notify,
    confirmDialog,
    resolveConfirm,
    dismissNotification
  }
}
