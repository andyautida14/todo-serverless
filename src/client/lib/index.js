const app = new Vue({
  el: '#app',
  data: {
    todoList: [],
    doneList: []
  },
  mounted() {
    this.loadData('todo')
  },
  methods: {
    async loadData(type) {
      const response = await axios.get(`/api/${type}`)
      this[`${type}List`] = response.data
    },
    promptCreateTodo() {
      this.$buefy.dialog.prompt({
        message: 'Todo\'s text description:',
        inputAttrs: {
          placeholder: 'e.g. Do my homework',
          maxlength: 512
        },
        trapFocus: true,
        onConfirm: async (text) => {
          const response = await axios.post('/api/todo', { text })
          this.todoList.push(response.data)
        }
      })
    },
    async setToDone(index, todo) {
      this.todoList.splice(index, 1, { ...todo, done: true })
      try {
        const response = await axios.post(`/api/todo/${todo.id}/done`)
        this.todoList.splice(index, 1)
        this.doneList.push(response.data)
      } catch(e) {
        this.todoList.splice(index, 1, todo)
      }
    },
    async undone(index, todo) {
      this.doneList.splice(index, 1, { ...todo, done: false })
      try {
        const response = await axios.post(`/api/done/${todo.id}/undone`)
        this.doneList.splice(index, 1)
        this.todoList.push(response.data)
      } catch(e) {
        this.doneList.splice(index, 1, todo)
      }
    }
  },
  components: {
    todo: httpVueLoader('./lib/components/todo.vue'),
    fab: httpVueLoader('./lib/components/fab.vue')
  }
})
