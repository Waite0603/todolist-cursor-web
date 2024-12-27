<template>
  <div
    class="group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl 
           shadow-sm hover:shadow-md transition-all duration-200"
    :class="{ 
      'opacity-75': todo.isCompleted,
      'opacity-50 pointer-events-none': disabled 
    }"
  >
    <button
      @click="$emit('toggle-status', todo._id)"
      class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 
             dark:border-gray-600 flex items-center justify-center 
             hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      :class="{ 'bg-blue-500 border-blue-500': todo.isCompleted }"
      :disabled="disabled"
    >
      <CheckIcon v-if="todo.isCompleted" class="w-4 h-4 text-white" />
    </button>
    
    <span
      class="flex-1 text-gray-700 dark:text-gray-200"
      :class="{ 'line-through text-gray-400 dark:text-gray-500': todo.isCompleted }"
    >
      {{ todo.value }}
    </span>
    
    <button
      @click="$emit('delete', todo._id)"
      class="opacity-0 group-hover:opacity-100 p-2 text-gray-400 
             hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 
             rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
             transition-all duration-200"
      :disabled="disabled"
    >
      <TrashIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/solid'

defineProps({
  todo: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-status', 'delete'])
</script> 