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
          try {
            const response = await axios.post('/api/todo', { text })
            this.todoList.push(response.data)
          } catch(e) {
            const message = e.response ? e.response.data.error : e.message
            this.$buefy.notification.open({
              position: 'is-top',
              type: 'is-danger',
              message
            })
          }
        }
      })
    },
    async setToDone(index, todo, value) {
      if(value === false) {
        return
      }

      this.todoList.splice(index, 1, { ...todo, done: true })
      try {
        const [ response ] = await Promise.all([
          axios.post(`/api/todo/${todo.id}/done`),
          this._wait()
        ])
        this.todoList.splice(index, 1)
        this.doneList.push(response.data)
      } catch(e) {
        const message = e.response ? e.response.data.error : e.message
        this.$buefy.notification.open({
          position: 'is-top',
          type: 'is-danger',
          message
        })
      }
    },
    async undone(index, todo, value) {
      if(value === true) {
        return
      }

      this.doneList.splice(index, 1, { ...todo, done: false })
      try {
        const [ response ] = await Promise.all([
          axios.post(`/api/done/${todo.id}/undone`),
          this._wait()
        ])
        this.doneList.splice(index, 1)
        this.todoList.push(response.data)
      } catch(e) {
        const message = e.response ? e.response.data.error : e.message
        this.$buefy.notification.open({
          position: 'is-top',
          type: 'is-danger',
          message
        })
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
