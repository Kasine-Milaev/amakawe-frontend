<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="cropper-overlay" @click="close">
        <div class="cropper-modal" @click.stop>
          <button class="close-btn" @click="close">×</button>
          
          <h2 class="modal-title">Загрузка аватара</h2>
          
          <div v-if="!imageLoaded" class="upload-section">
            <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
              <Upload class="upload-icon" />
              <p>Перетащите изображение сюда</p>
              <p class="upload-hint">или нажмите для выбора</p>
              <p class="upload-formats">PNG, JPG, GIF до 10MB</p>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              @change="handleFileSelect"
              style="display: none"
            />
          </div>
          
          <div v-else class="cropper-section">
            <div class="preview-title">Нажмите и перетащите для выбора области:</div>
            <div class="cropper-container">
              <VueCropper
                ref="cropper"
                :img="imageSrc"
                :output-size="1"
                :output-type="'jpeg'"
                :auto-crop="true"
                :fixed="true"
                :fixed-number="[1, 1]"
                :full="true"
                :center-box="true"
                :can-move="true"
                :can-move-box="true"
                :original="false"
                :real-time-preview="true"
                @real-time="handleRealTime"
              />
            </div>
            
            <div class="preview-section">
              <div class="preview-avatar" :style="previewStyle">
                <div :style="previews.div" v-if="previews">
                  <img :src="previews.url" :style="previews.img" alt="Preview" />
                </div>
              </div>
            </div>
            
            <div class="cropper-actions">
              <button class="btn btn-secondary" @click="resetImage">
                <RotateCcw class="icon" />
                Сбросить
              </button>
              <button class="btn btn-primary" @click="cropAndUpload" :disabled="loading">
                <Check class="icon" />
                {{ loading ? 'Загрузка...' : 'Сохранить' }}
              </button>
            </div>
          </div>
          
          <div v-if="error" class="error-message">
            <AlertCircle class="error-icon" />
            {{ error }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, RotateCcw, Check, AlertCircle } from 'lucide-vue-next'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'uploaded'])

const API_URL = import.meta.env.VITE_API_URL || 'https://amakawe-backendd.vercel.app'

const show = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const close = () => {
  show.value = false
  resetAll()
}

const fileInput = ref(null)
const cropper = ref(null)
const imageSrc = ref('')
const imageLoaded = ref(false)
const loading = ref(false)
const error = ref('')
const previews = ref(null)
const previewStyle = ref({
  width: '150px',
  height: '150px',
  overflow: 'hidden',
  margin: '0'
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    loadImage(file)
  }
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) {
    loadImage(file)
  }
}

const loadImage = (file) => {
  if (!file.type.match('image.*')) {
    error.value = 'Пожалуйста, выберите изображение'
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'Размер файла не должен превышать 10MB'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imageSrc.value = e.target.result
    imageLoaded.value = true
    error.value = ''
  }
  reader.readAsDataURL(file)
}

const handleRealTime = (data) => {
  previews.value = data
}

const resetImage = () => {
  imageSrc.value = ''
  imageLoaded.value = false
  previews.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetAll = () => {
  resetImage()
  loading.value = false
}

const cropAndUpload = async () => {
  if (!cropper.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    cropper.value.getCropBlob((blob) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const maxSize = 512
      
      const img = new Image()
      img.onload = async () => {
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(async (compressedBlob) => {
          const reader = new FileReader()
          reader.onloadend = async () => {
            const base64 = reader.result
            
            try {
              const token = localStorage.getItem('auth_token')
              
              const response = await fetch(`${API_URL}/api/profile/me/avatar/upload`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  avatar: base64
                })
              })
              
              const data = await response.json()
              
              if (data.success) {
                emit('uploaded', data.avatar)
                close()
              } else {
                error.value = data.error || 'Не удалось загрузить аватар'
              }
            } catch (err) {
              error.value = 'Ошибка подключения к серверу'
              console.error('Upload error:', err)
            } finally {
              loading.value = false
            }
          }
          reader.readAsDataURL(compressedBlob)
        }, 'image/jpeg', 0.7)
      }
      img.src = URL.createObjectURL(blob)
    })
  } catch (err) {
    error.value = 'Ошибка при обрезке изображения'
    console.error('Crop error:', err)
    loading.value = false
  }
}
</script>

<style scoped>
.cropper-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1rem;
}

.cropper-modal {
  background: rgba(20, 20, 35, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #718096;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.upload-section {
  padding: 2rem 0;
}

.upload-area {
  border: 2px dashed rgba(102, 126, 234, 0.5);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
}

.upload-area:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #667eea;
  margin: 0 auto 1rem;
}

.upload-area p {
  margin: 0.5rem 0;
  color: #a0aec0;
}

.upload-hint {
  font-size: 0.9rem;
  color: #718096;
}

.upload-formats {
  font-size: 0.8rem;
  color: #4a5568;
  margin-top: 1rem;
}

.cropper-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-title {
  color: #a0aec0;
  font-size: 0.9rem;
  text-align: center;
}

.cropper-container {
  width: 100%;
  height: 400px;
  background: #0f0f1a;
  border-radius: 12px;
  overflow: hidden;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-avatar {
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.cropper-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 18px;
  height: 18px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #fca5a5;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .cropper-container {
    height: 300px;
  }
  
  .cropper-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>