<template>
  <div class="space-y-6">
    <!-- 添加新待办事项 -->
    <div class="flex gap-3">
      <input
        v-model="newTodo"
        type="text"
        placeholder="添加新的待办事项..."
        class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
               bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 
               focus:border-transparent outline-none transition-all"
        @keyup.enter="addTodo"
        :disabled="isLoading"
      />
      <button
        @click="addTodo"
        class="btn btn-primary flex items-center gap-2"
        :disabled="!newTodo.trim() || isLoading"
      >
        <SpinnerIcon v-if="isLoading" class="w-5 h-5 animate-spin" />
        <PlusIcon v-else class="w-5 h-5" />
        添加
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
      {{ error }}
    </div>

    <!-- 过滤器和统计 -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div class="flex gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          class="btn btn-secondary"
          :class="{ 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700': currentFilter === filter.value }"
        >
          {{ filter.label }}
          <span class="ml-1 text-sm">
            ({{ getFilterCount(filter.value) }})
          </span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500 transition-all duration-500"
            :style="{ width: `${completionRate}%` }"
          ></div>
        </div>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ completionRate }}%
        </span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading && !todos.length" class="flex justify-center py-12">
      <SpinnerIcon class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- 空状态 -->
    <div v-else-if="!isLoading && !todos.length" class="text-center py-12">
      <InboxIcon class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">还没有待办事项</p>
    </div>

    <!-- 待办事项列表 -->
    <TransitionGroup
      v-else
      name="list"
      tag="div"
      class="space-y-3"
    >
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo._id"
        :todo="todo"
        :disabled="isLoading"
        @toggle-status="toggleTodoStatus"
        @delete="deleteTodo"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, InboxIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon as SpinnerIcon } from '@heroicons/vue/24/outline'
import TodoItem from './TodoItem.vue'
import { todoApi } from '../api/todoApi'

const todos = ref([])
const newTodo = ref('')
const currentFilter = ref('all')
const isLoading = ref(false)
const error = ref(null)

const filters = [
  { label: '全部', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '未完成', value: 'active' }
]

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'completed':
      return todos.value.filter(todo => todo.isCompleted)
    case 'active':
      return todos.value.filter(todo => !todo.isCompleted)
    default:
      return todos.value
  }
})

const completionRate = computed(() => {
  if (todos.value.length === 0) return 0
  const completedCount = todos.value.filter(todo => todo.isCompleted).length
  return Math.round((completedCount / todos.value.length) * 100)
})

const getFilterCount = (filterValue) => {
  switch (filterValue) {
    case 'completed':
      return todos.value.filter(todo => todo.isCompleted).length
    case 'active':
      return todos.value.filter(todo => !todo.isCompleted).length
    default:
      return todos.value.length
  }
}

async function fetchTodos() {
  isLoading.value = true
  error.value = null
  try {
    todos.value = await todoApi.getAllTodos()
  } catch (err) {
    error.value = '获取待办事项失败，请稍后重试'
    console.error('Failed to fetch todos:', err)
  } finally {
    isLoading.value = false
  }
}

async function addTodo() {
  if (!newTodo.value.trim() || isLoading.value) return
  isLoading.value = true
  error.value = null
  try {
    const todo = await todoApi.addTodo({ value: newTodo.value })
    todos.value.push(todo)
    newTodo.value = ''
  } catch (err) {
    error.value = '添加待办事项失败，请稍后重试'
    console.error('Failed to add todo:', err)
  } finally {
    isLoading.value = false
  }
}

async function toggleTodoStatus(id) {
  if (isLoading.value) return
  isLoading.value = true
  error.value = null
  try {
    const updatedTodo = await todoApi.updateTodoStatus(id)
    const index = todos.value.findIndex(todo => todo._id === id)
    if (index !== -1) {
      todos.value[index] = updatedTodo
    }
  } catch (err) {
    error.value = '更新待办事项状态失败，请稍后重试'
    console.error('Failed to update todo:', err)
  } finally {
    isLoading.value = false
  }
}

async function deleteTodo(id) {
  if (isLoading.value) return
  isLoading.value = true
  error.value = null
  try {
    await todoApi.deleteTodo(id)
    todos.value = todos.value.filter(todo => todo._id !== id)
  } catch (err) {
    error.value = '删除待办事项失败，请稍后重试'
    console.error('Failed to delete todo:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTodos)
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style> 