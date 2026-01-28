<script setup lang="ts">
import { CalendarDays, Plus, Settings, LogOut } from 'lucide-vue-next'

const { user, isLoading, fetchUser, logout } = useAuth()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const showMealModal = ref(false)
const showSettingsModal = ref(false)
const showCalendarModal = ref(false)

const stats = ref({ calories: 0, protein: 0, fat: 0, carbs: 0 })
const dailyGoals = ref<Array<{ id: number; title: string; completed: boolean }>>([])
const meals = ref<Array<any>>([])

const caloriePercentage = computed(() => {
  if (!user.value?.dailyCalorieGoal) return 0
  return Math.min((stats.value.calories / user.value.dailyCalorieGoal) * 100, 100)
})

const remainingCalories = computed(() => {
  if (!user.value?.dailyCalorieGoal) return 0
  return Math.max(user.value.dailyCalorieGoal - stats.value.calories, 0)
})

const formattedDate = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  if (selectedDate.value === today) return 'Сьогодні'
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
})

const fetchData = async () => {
  if (!user.value) return

  const [statsData, goalsData, mealsData] = await Promise.all([
    $fetch(`/api/stats?date=${selectedDate.value}`),
    $fetch(`/api/daily-goals?date=${selectedDate.value}`),
    $fetch(`/api/meals?date=${selectedDate.value}`),
  ])

  stats.value = statsData as any
  dailyGoals.value = goalsData as any
  meals.value = mealsData as any
}

const toggleGoal = async (goalId: number, completed: boolean) => {
  await $fetch('/api/daily-goals', {
    method: 'POST',
    body: { goalId, date: selectedDate.value, completed },
  })
  const goal = dailyGoals.value.find(g => g.id === goalId)
  if (goal) goal.completed = completed
}

const addMeal = async (meal: { calories: number; protein: number; fat: number; carbs: number }) => {
  await $fetch('/api/meals', {
    method: 'POST',
    body: { ...meal, date: selectedDate.value },
  })
  await fetchData()
  showMealModal.value = false
}

const deleteMeal = async (id: number) => {
  await $fetch(`/api/meals?id=${id}`, { method: 'DELETE' })
  await fetchData()
}

const changeDate = (date: string) => {
  selectedDate.value = date
  showCalendarModal.value = false
}

onMounted(async () => {
  await fetchUser()
  if (!user.value) {
    navigateTo('/login')
    return
  }
  await fetchData()
})

watch(selectedDate, fetchData)
</script>

<template>
  <div class="min-h-screen bg-background pb-24">
    <!-- Header -->
    <header class="sticky top-0 bg-background border-b z-10">
      <div class="flex items-center justify-between p-4">
        <button
          class="flex items-center gap-2 text-lg font-medium"
          @click="showCalendarModal = true"
        >
          <CalendarDays class="w-5 h-5" />
          {{ formattedDate }}
        </button>
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-accent rounded-md" @click="showSettingsModal = true">
            <Settings class="w-5 h-5" />
          </button>
          <button class="p-2 hover:bg-accent rounded-md" @click="logout">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <main v-if="!isLoading && user" class="p-4 space-y-4">
      <!-- Calorie Ring -->
      <div class="border rounded-lg p-6 bg-card">
        <CalorieRing
          :value="stats.calories"
          :max="user.dailyCalorieGoal || 2000"
          :percentage="caloriePercentage"
        />
        <p class="text-center mt-4 text-muted-foreground">
          Залишилось: <span class="font-semibold text-foreground">{{ remainingCalories }}</span> ккал
        </p>
      </div>

      <!-- Daily Goals -->
      <div class="border rounded-lg p-4 bg-card">
        <h2 class="font-semibold mb-3">Щоденні цілі</h2>
        <div v-if="dailyGoals.length === 0" class="text-muted-foreground text-sm">
          Немає цілей. Додайте в налаштуваннях.
        </div>
        <div v-else class="space-y-2">
          <label
            v-for="goal in dailyGoals"
            :key="goal.id"
            class="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="goal.completed"
              @change="toggleGoal(goal.id, !goal.completed)"
              class="h-5 w-5 rounded border-primary text-primary focus:ring-primary"
            />
            <span :class="{ 'line-through text-muted-foreground': goal.completed }">
              {{ goal.title }}
            </span>
          </label>
        </div>
      </div>

      <!-- Macros -->
      <div class="border rounded-lg p-4 bg-card">
        <h2 class="font-semibold mb-3">БЖВ</h2>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-blue-500">{{ stats.protein }}</p>
            <p class="text-xs text-muted-foreground">Білки (г)</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-500">{{ stats.fat }}</p>
            <p class="text-xs text-muted-foreground">Жири (г)</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-orange-500">{{ stats.carbs }}</p>
            <p class="text-xs text-muted-foreground">Вуглеводи (г)</p>
          </div>
        </div>
      </div>

      <!-- Meals List -->
      <div v-if="meals.length > 0" class="border rounded-lg p-4 bg-card">
        <h2 class="font-semibold mb-3">Прийоми їжі</h2>
        <div class="space-y-2">
          <div
            v-for="meal in meals"
            :key="meal.id"
            class="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div>
              <p class="font-medium">{{ meal.calories }} ккал</p>
              <p class="text-xs text-muted-foreground">
                Б: {{ meal.protein }}г · Ж: {{ meal.fat }}г · В: {{ meal.carbs }}г
              </p>
            </div>
            <button class="text-destructive text-sm" @click="deleteMeal(meal.id)">
              Видалити
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- FAB -->
    <button
      type="button"
      class="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
      @click="showMealModal = true"
    >
      <Plus class="w-6 h-6" />
    </button>

    <!-- Modals -->
    <MealModal :open="showMealModal" @close="showMealModal = false" @submit="addMeal" />

    <SettingsModal
      v-if="user"
      :open="showSettingsModal"
      :calorie-goal="user.dailyCalorieGoal || 2000"
      @close="showSettingsModal = false"
      @saved="fetchData"
    />

    <CalendarModal
      :open="showCalendarModal"
      :selected-date="selectedDate"
      @close="showCalendarModal = false"
      @select="changeDate"
    />
  </div>
</template>
