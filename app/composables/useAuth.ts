interface User {
  id: number
  email: string
  dailyCalorieGoal: number | null
}

const user = ref<User | null>(null)
const isLoading = ref(true)

export function useAuth() {
  const fetchUser = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<User>('/api/auth/me')
      user.value = data
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    const data = await $fetch<User>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data
    return data
  }

  const register = async (email: string, password: string) => {
    const data = await $fetch<User>('/api/auth/register', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data
    return data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  const updateCalorieGoal = async (dailyCalorieGoal: number) => {
    await $fetch('/api/settings', {
      method: 'POST',
      body: { dailyCalorieGoal },
    })
    if (user.value) {
      user.value.dailyCalorieGoal = dailyCalorieGoal
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    })
  }

  return {
    user,
    isLoading,
    fetchUser,
    login,
    register,
    logout,
    updateCalorieGoal,
    changePassword,
  }
}
