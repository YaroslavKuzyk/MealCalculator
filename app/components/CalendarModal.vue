<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  open: boolean
  selectedDate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  select: [date: string]
}>()

const currentMonth = ref(new Date())

const monthName = computed(() => {
  return currentMonth.value.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> = []

  const startDayOfWeek = firstDay.getDay() || 7
  for (let i = startDayOfWeek - 1; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isCurrentMonth: false,
    })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: true,
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: date.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: false,
    })
  }

  return days
})

const prevMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  )
}

const isToday = (date: string) => date === new Date().toISOString().split('T')[0]
const isSelected = (date: string) => date === props.selectedDate

watch(() => props.open, (open) => {
  if (open) {
    currentMonth.value = new Date(props.selectedDate)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div class="fixed inset-0 bg-black/50" @click="emit('close')" />

      <div class="relative bg-background border rounded-t-xl sm:rounded-xl w-full max-w-md p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Оберіть дату</h2>
          <button class="p-1 hover:bg-accent rounded" @click="emit('close')">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Month navigation -->
        <div class="flex items-center justify-between mb-4">
          <button class="p-2 hover:bg-accent rounded-md" @click="prevMonth">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <span class="font-medium capitalize">{{ monthName }}</span>
          <button class="p-2 hover:bg-accent rounded-md" @click="nextMonth">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Weekdays -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']"
            :key="day"
            class="text-center text-xs text-muted-foreground py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="day in daysInMonth"
            :key="day.date"
            class="aspect-square flex items-center justify-center rounded-md text-sm transition-colors"
            :class="{
              'text-muted-foreground': !day.isCurrentMonth,
              'bg-primary text-primary-foreground': isSelected(day.date),
              'ring-2 ring-primary': isToday(day.date) && !isSelected(day.date),
              'hover:bg-accent': !isSelected(day.date),
            }"
            @click="emit('select', day.date)"
          >
            {{ day.day }}
          </button>
        </div>

        <button
          type="button"
          class="w-full mt-4 h-10 px-4 rounded-md border border-input bg-background hover:bg-accent font-medium"
          @click="emit('select', new Date().toISOString().split('T')[0])"
        >
          Сьогодні
        </button>
      </div>
    </div>
  </Teleport>
</template>
