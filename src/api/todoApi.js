import axios from 'axios'

const BASE_URL = 'https://wpifxnmfmpef.sealoshzh.site/api'

export const todoApi = {
  async getAllTodos() {
    const response = await axios.get(`${BASE_URL}/get-todo`)
    return response.data
  },

  async addTodo(todo) {
    const response = await axios.post(`${BASE_URL}/add-todo`, {
      value: todo.value,
      isCompleted: false
    })
    return response.data
  },

  async updateTodoStatus(id) {
    const response = await axios.post(`${BASE_URL}/update-todo/${id}`)
    return response.data
  },

  async deleteTodo(id) {
    const response = await axios.post(`${BASE_URL}/del-todo/${id}`)
    return response.data
  }
} 