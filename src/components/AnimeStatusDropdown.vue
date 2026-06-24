<template>
  <div class="status-dropdown" ref="dropdownRef">
    <button class="status-btn" :class="statusClass" @click="toggleDropdown">
      <span>{{ currentStatus.text }}</span>
      <ChevronDown class="icon" :class="{ rotate: isOpen }" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <button 
          v-for="status in statuses" 
          :key="status.value"
          class="dropdown-item"
          :class="{ active: modelValue === status.value }"
          @click="selectStatus(status.value)"
        >
          <component :is="status.icon" class="icon-small" />
          <span>{{ status.label }}</span>
          <Check v-if="modelValue === status.value" class="check-icon" />
        </button>
        
        <div class="dropdown-divider"></div>
        
        <button 
          class="dropdown-item remove"
          @click="removeFromList"
        >
          <Trash2 class="icon-small" />
          <span>Убрать из списка</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ChevronDown, Check, Trash2, Play, Clock, CheckCircle2, 
  PauseCircle, XCircle, Heart 
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  animeId: [Number, String]
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const statuses = [
  { value: 'watching', label: 'Смотрю', icon: Play },
  { value: 'planned', label: 'Запланировал', icon: Clock },
  { value: 'completed', label: 'Просмотрено', icon: CheckCircle2 },
  { value: 'on_hold', label: 'Отложил', icon: PauseCircle },
  { value: 'dropped', label: 'Бросил', icon: XCircle }
]

const currentStatus = computed(() => {
  return statuses.find(s => s.value === props.modelValue) || statuses[0]
})

const statusClass = computed(() => {
  const classes = {
    watching: 'status-watching',
    planned: 'status-planned',
    completed: 'status-completed',
    on_hold: 'status-hold',
    dropped: 'status-dropped'
  }
  return classes[props.modelValue] || ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectStatus = async (status) => {
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://amakawe-backendd.vercel.app'}/api/anime/${props.animeId}/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action: status })
    })
    
    const data = await response.json()
    
    if (data.success) {
      emit('update:modelValue', status)
      emit('change', { animeId: props.animeId, status })
    }
  } catch (error) {
    console.error('Failed to update status:', error)
  }
  
  isOpen.value = false
}

const removeFromList = async () => {
  emit('update:modelValue', null)
  emit('change', { animeId: props.animeId, status: null })
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.status-dropdown {
  position: relative;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.status-watching { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.status-planned { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.status-completed { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
.status-hold { background: rgba(234, 179, 8, 0.2); color: #eab308; }
.status-dropped { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #a0aec0;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.dropdown-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.dropdown-item.remove {
  color: #fca5a5;
}

.dropdown-item.remove:hover {
  background: rgba(239, 68, 68, 0.15);
}

.icon-small {
  width: 16px;
  height: 16px;
}

.check-icon {
  margin-left: auto;
  width: 16px;
  height: 16px;
  color: #667eea;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>