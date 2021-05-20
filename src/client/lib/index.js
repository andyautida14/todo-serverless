const app = new Vue({
  el: '#app',
  data: {
    todoList: [],
    doneList: []
  },
  mounted() {
    if(window.location.protocol !== 'https:') {
      // it is running locally
      axios.defaults.baseURL = 'http://localhost:3000'
    }

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
        const [ response ] = await Promise.all([
          axios.post(`/api/todo/${todo.id}/done`),
          this._wait()
        ])
        this.todoList.splice(index, 1)
        this.doneList.push(response.data)
      } catch(e) {
        this.todoList.splice(index, 1, todo)
      }
    },
    async undone(index, todo) {
      this.doneList.splice(index, 1, { ...todo, done: false })
      try {
        const [ response ] = await Promise.all([
          axios.post(`/api/done/${todo.id}/undone`),
          this._wait()
        ])
        this.doneList.splice(index, 1)
        this.todoList.push(response.data)
      } catch(e) {
        this.doneList.splice(index, 1, todo)
      }
    },
    _wait(delay = 5000) {
      return new Promise(resolve => setTimeout(resolve, delay))
    }
  },
  components: {
    todo: httpVueLoader('./lib/components/todo.vue'),
    fab: httpVueLoader('./lib/components/fab.vue')
  }
})
