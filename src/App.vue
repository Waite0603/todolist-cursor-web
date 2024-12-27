<template>
  <div class="min-h-screen transition-colors duration-300"
       :class="{ 'dark:bg-gray-900 dark:text-white': isDark }">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Todo List
        </h1>
        <button @click="toggleTheme" 
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <SunIcon v-if="isDark" class="h-6 w-6 text-yellow-400" />
          <MoonIcon v-else class="h-6 w-6 text-gray-600" />
        </button>
      </header>
      
      <TodoList />
    </div>
  </div>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid'
import { useTheme } from './composables/useTheme'
import TodoList from './components/TodoList.vue'

const { isDark, toggleTheme } = useTheme()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark {
  color-scheme: dark;
}
</style>
