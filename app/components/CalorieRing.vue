<script setup lang="ts">
interface Props {
  value: number
  max: number
  percentage: number
}

const props = defineProps<Props>()

const strokeDasharray = computed(() => {
  const circumference = 2 * Math.PI * 45
  const filled = (props.percentage / 100) * circumference
  return `${filled} ${circumference}`
})

const color = computed(() => {
  if (props.percentage >= 100) return '#ef4444'
  if (props.percentage >= 80) return '#f59e0b'
  return '#22c55e'
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-40 h-40">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          class="text-muted"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="color"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="strokeDasharray"
          class="transition-all duration-500"
        />
      </svg>
      <!-- Center text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-bold">{{ value }}</span>
        <span class="text-sm text-muted-foreground">/ {{ max }}</span>
      </div>
    </div>
  </div>
</template>
