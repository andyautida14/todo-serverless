const aws4 = require('aws4-browser')
const { Auth } = require('@aws-amplify/auth')
const { PubSub, AWSIoTProvider } = require('@aws-amplify/pubsub')

const app = new Vue({
  el: '#app',
  data: {
    todoList: [],
    doneList: [],
    checkedTodo: [],
    uncheckedDone: []
  },
  mounted() {
    if(window.location.protocol !== 'https:') {
      // it is running locally
      axios.defaults.baseURL = 'http://localhost:3000'
    }

    this.subscribe()
    this.loadData('todo')
  },
  methods: {
    async subscribe() {
      const config = await this.getConfig()
      Auth.configure(config.auth)
      const credentials = await Auth.currentCredentials()

      const path = `${config.stage}/api/subscribe`
      const signedRequest = aws4.sign({
        host: config.apiGatewayUrl,
        method: 'POST',
        url: `https://${config.apiGatewayUrl}/${path}`,
        path
      }, credentials)
      delete signedRequest.headers['Host']
      delete signedRequest.headers['Content-Length']
      await axios(signedRequest)

      PubSub.addPluggable(new AWSIoTProvider({
        aws_pubsub_region: config.auth.region,
        aws_pubsub_endpoint: `wss://${config.iotEndpoint}/mqtt`
      }))

      const topic = `${config.stage}/todo/#`
      PubSub.subscribe(topic).subscribe({
        next: ({ value: todo }) => {
          if(todo.done) {
            this.removeTodo(todo)
            this.addDone(todo)
          } else {
            this.addTodo(todo)
            this.removeDone(todo)
          }
        },
        error: (err) => {
          console.error('mqtt error:', errr)
        },
        close: () => {
          console.log('mqtt closed')
        }
      })
    },
    async getConfig() {
      const response = await axios.get('/api/config')
      return response.data
    },
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
    removeCheckedTodo(todo) {
      const index = this.checkedTodo.findIndex(item => item.id === todo.id)
      if(index >= 0) {
        this.checkedTodo.splice(index, 1)
      }
    },
    removeUncheckedDone(todo) {
      const index = this.uncheckedDone.findIndex(item => item.id === todo.id)
      if(index >= 0) {
        this.uncheckedDone.splice(index, 1)
      }
    },
    addTodo(todo) {
      const index = this.todoList.findIndex(item => item.id === todo.id)
      if(index === -1) {
        this.todoList.push(todo)
      }
    },
    removeTodo(todo) {
      const index = this.todoList.findIndex(item => item.id === todo.id)
      if(index >= 0) {
        this.todoList.splice(index, 1)
      }
    },
    addDone(todo) {
      const index = this.doneList.findIndex(item => item.id === todo.id)
      if(index === -1) {
        this.doneList.push(todo)
      }
    },
    removeDone(todo) {
      const index = this.doneList.findIndex(item => item.id === todo.id)
      if(index >= 0) {
        this.doneList.splice(index, 1)
      }
    },
    async setToDone(index, todo, value) {
      if(value === false) {
        return
      }

      this.todoList.splice(index, 1)
      this.checkedTodo.push(todo)
      try {
        const response = await axios.post(`/api/todo/${todo.id}/done`)
        this.addDone(response.data)
        await this._wait()
      } catch(e) {
        this.addTodo(todo)
        const message = e.response ? e.response.data.error : e.message
        this.$buefy.notification.open({
          position: 'is-top',
          type: 'is-danger',
          message
        })
      } finally {
        this.removeCheckedTodo(todo)
      }
    },
    async undone(index, todo, value) {
      if(value === true) {
        return
      }

      this.doneList.splice(index, 1)
      this.uncheckedDone.push(todo)
      try {
        const response = await axios.post(`/api/done/${todo.id}/undone`)
        this.addTodo(response.data)
        this._wait()
      } catch(e) {
        this.addDone(todo)
        const message = e.response ? e.response.data.error : e.message
        this.$buefy.notification.open({
          position: 'is-top',
          type: 'is-danger',
          message
        })
      } finally {
        this.removeUncheckedDone(todo)
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
