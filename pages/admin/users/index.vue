<template>
  <div class="users-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Usuarios del Sistema</h1>
        <p>Gestiona los usuarios y sus roles</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <span>➕</span>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <p>Cargando usuarios...</p>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else-if="users.length > 0" class="users-table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="user-name">{{ user.first_name }} {{ user.last_name }}</td>
            <td>{{ user.email || '—' }}</td>
            <td>
              <span class="role-badge" :class="getRoleClass(user.role_id)">
                {{ user.roles?.name || 'Sin rol' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td class="actions-cell">
              <button @click="editUser(user)" class="btn-edit">Editar</button>
              <button
                @click="deleteUser(user)"
                class="btn-delete"
                :disabled="user.id === authStore.user?.id"
                :title="user.id === authStore.user?.id ? 'No puedes eliminar tu propia cuenta' : ''"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <span class="empty-icon">👤</span>
      <h3>No hay usuarios registrados</h3>
      <p>Comienza agregando el primer usuario</p>
      <button @click="showCreateModal = true" class="btn-primary">
        Crear Usuario
      </button>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showCreateModal || editingUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

        <form @submit.prevent="saveUser" class="user-form">
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="formData.firstName" type="text" required>
          </div>

          <div class="form-group">
            <label>Apellido*</label>
            <input v-model="formData.lastName" type="text" required>
          </div>

          <div class="form-group">
            <label>Email*</label>
            <input v-model="formData.email" type="email" required :disabled="!!editingUser">
          </div>

          <div class="form-group" v-if="!editingUser">
            <label>Contraseña*</label>
            <input v-model="formData.password" type="password" required minlength="6">
          </div>

          <div class="form-group">
            <label>Rol*</label>
            <select v-model="formData.roleId" required>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Configuración de la página
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

useHead({
  title: 'Usuarios - Admin'
})

const supabase = useSupabaseClient()
const authStore = useAuthStore()

// Estados
const loading = ref(false)
const saving = ref(false)
const users = ref([])
const roles = ref([])
const showCreateModal = ref(false)
const editingUser = ref(null)
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleId: 2
})
const { notify, confirmDialog } = useNotification()

// Cargar usuarios desde la tabla profiles
const loadUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, roles:role_id(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  } finally {
    loading.value = false
  }
}

// Cargar roles disponibles
const loadRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('id')

    if (error) throw error
    roles.value = data || []
  } catch (error) {
    console.error('Error al cargar roles:', error)
  }
}

// Editar usuario
const editUser = (user) => {
  editingUser.value = user
  formData.value = {
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    password: '',
    roleId: user.role_id || 2
  }
}

// Guardar usuario (crear o actualizar)
const saveUser = async () => {
  saving.value = true
  try {
    if (editingUser.value) {
      // Actualizar perfil existente
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.value.firstName,
          last_name: formData.value.lastName,
          role_id: formData.value.roleId
        })
        .eq('id', editingUser.value.id)

      if (error) throw error
      notify('Usuario actualizado exitosamente')
    } else {
      // Crear nuevo usuario con signUp del auth store
      const result = await authStore.signUp({
        email: formData.value.email,
        password: formData.value.password,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        roleId: formData.value.roleId
      }, supabase)

      if (!result.success) throw new Error(result.error)
      notify('Usuario creado exitosamente')
    }

    closeModal()
    await loadUsers()
  } catch (error) {
    console.error('Error al guardar:', error)
    notify('Error al guardar el usuario: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

// Eliminar usuario
const deleteUser = async (user) => {
  if (user.id === authStore.user?.id) return
  const ok = await confirmDialog(`¿Eliminar a ${user.first_name} ${user.last_name}?`)
  if (!ok) return

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (error) throw error
    notify('Usuario eliminado exitosamente')
    await loadUsers()
  } catch (error) {
    console.error('Error al eliminar:', error)
    notify('Error al eliminar el usuario', 'error')
  }
}

// Cerrar modal
const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: 2
  }
}

// Obtener clase CSS según el rol
const getRoleClass = (roleId) => {
  if (roleId === 1) return 'role-admin'
  return 'role-asesor'
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Cargar datos al montar
onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>

<style scoped>
.users-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

/* Tabla de usuarios */
.users-table-wrapper {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f9fafb;
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
  color: #374151;
}

.users-table tbody tr:hover {
  background: #f9fafb;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-asesor {
  background: #d1fae5;
  color: #065f46;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover:not(:disabled) {
  background: #fecaca;
}

.btn-delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #111827;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-secondary {
  flex: 1;
  padding: 0.875rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .users-table-wrapper {
    overflow-x: auto;
  }

  .users-table {
    min-width: 600px;
  }
}
</style>