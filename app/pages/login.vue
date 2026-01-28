<script setup lang="ts">
const { login, register, user } = useAuth()

const email = ref('')
const password = ref('')
const isRegister = ref(false)
const error = ref('')
const loading = ref(false)

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const handleSubmit = async () => {
  console.log('handleSubmit');
  
  error.value = ''
  loading.value = true

  try {
    if (isRegister.value) {
      await register(email.value, password.value)
    } else {
      await login(email.value, password.value)
    }
    navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Помилка'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-background">
    <div class="w-full max-w-sm border rounded-lg p-6 bg-card">
      <h1 class="text-2xl font-bold text-center mb-6">
        {{ isRegister ? 'Реєстрація' : 'Вхід' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="email@example.com"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <p v-if="error" class="text-destructive text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {{ loading ? 'Завантаження...' : (isRegister ? 'Зареєструватись' : 'Увійти') }}
        </button>
      </form>

      <p class="text-center mt-4 text-sm text-muted-foreground">
        {{ isRegister ? 'Вже є акаунт?' : 'Немає акаунту?' }}
        <button
          type="button"
          class="text-primary underline"
          @click="isRegister = !isRegister"
        >
          {{ isRegister ? 'Увійти' : 'Зареєструватись' }}
        </button>
      </p>
    </div>
  </div>
</template>
