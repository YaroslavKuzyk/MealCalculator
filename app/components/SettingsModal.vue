<script setup lang="ts">
import { X, Plus, Trash2 } from 'lucide-vue-next'

interface Props {
  open: boolean
  calorieGoal: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { updateCalorieGoal } = useAuth()

const localCalorieGoal = ref(props.calorieGoal)
const goals = ref<Array<{ id: number; title: string }>>([])
const newGoalTitle = ref('')

watch(() => props.open, async (open) => {
  if (open) {
    localCalorieGoal.value = props.calorieGoal
    const data = await $fetch<Array<{ id: number; title: string }>>('/api/goals')
    goals.value = data
  }
})

const saveCalorieGoal = async () => {
  await updateCalorieGoal(localCalorieGoal.value)
  emit('saved')
}

const addGoal = async () => {
  if (!newGoalTitle.value.trim()) return

  const goal = await $fetch<{ id: number; title: string }>('/api/goals', {
    method: 'POST',
    body: { title: newGoalTitle.value },
  })

  goals.value.push(goal)
  newGoalTitle.value = ''
  emit('saved')
}

const deleteGoal = async (id: number) => {
  await $fetch(`/api/goals?id=${id}`, { method: 'DELETE' })
  goals.value = goals.value.filter(g => g.id !== id)
  emit('saved')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div class="fixed inset-0 bg-black/50" @click="emit('close')" />

      <div class="relative bg-background border rounded-t-xl sm:rounded-xl w-full max-w-md p-6 shadow-lg max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Налаштування</h2>
          <button class="p-1 hover:bg-accent rounded" @click="emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Calorie Goal -->
        <div class="mb-6">
          <label class="text-sm font-medium mb-2 block">Денна норма калорій</label>
          <div class="flex gap-2">
            <input
              v-model.number="localCalorieGoal"
              type="number"
              min="500"
              max="10000"
              class="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              class="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              @click="saveCalorieGoal"
            >
              Зберегти
            </button>
          </div>
        </div>

        <!-- Goals -->
        <div>
          <h3 class="text-sm font-medium mb-2">Щоденні цілі</h3>

          <div class="space-y-2 mb-3">
            <div
              v-for="goal in goals"
              :key="goal.id"
              class="flex items-center justify-between p-2 border rounded-md"
            >
              <span>{{ goal.title }}</span>
              <button
                class="p-1 text-destructive hover:bg-destructive/10 rounded"
                @click="deleteGoal(goal.id)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex gap-2">
            <input
              v-model="newGoalTitle"
              type="text"
              placeholder="Нова ціль..."
              class="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @keyup.enter="addGoal"
            />
            <button
              type="button"
              class="inline-flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              @click="addGoal"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
