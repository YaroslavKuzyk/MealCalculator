<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
  open: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [meal: { calories: number; protein: number; fat: number; carbs: number }]
}>()

const calories = ref(0)
const protein = ref(0)
const fat = ref(0)
const carbs = ref(0)

const handleSubmit = () => {
  emit('submit', {
    calories: calories.value,
    protein: protein.value,
    fat: fat.value,
    carbs: carbs.value,
  })
  // Reset
  calories.value = 0
  protein.value = 0
  fat.value = 0
  carbs.value = 0
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50" @click="emit('close')" />

      <!-- Modal -->
      <div class="relative bg-background border rounded-t-xl sm:rounded-xl w-full max-w-md p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Додати прийом їжі</h2>
          <button class="p-1 hover:bg-accent rounded" @click="emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Калорії *</label>
            <input
              v-model.number="calories"
              type="number"
              min="0"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="text-sm font-medium mb-1 block">Білки (г)</label>
              <input
                v-model.number="protein"
                type="number"
                min="0"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-1 block">Жири (г)</label>
              <input
                v-model.number="fat"
                type="number"
                min="0"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-1 block">Вуглеводи (г)</label>
              <input
                v-model.number="carbs"
                type="number"
                min="0"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            class="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          >
            Додати
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
