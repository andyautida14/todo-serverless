const aws4 = require('aws4-browser')
const { Auth } = require('@aws-amplify/auth')
const PubSub = require('@aws-amplify/pubsub')
const { AWSIotProvider } = PubSub

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
      await axios(signedRequest)

      PubSub.addPluggable(new AWSIoTProvider({
        aws_pubsub_region: config.auth.region,
        aws_pubsub_endpoint: `wss://${config.iotEndpoint}/mqtt`
      }))

      const topic = `${config.stage}/todo/*`
      PubSub.subscribe(topic).subscribe({
        next: ({ value: todo }) => {
          console.log(todo)
          if(todo.done) {
            this.removeTodo(todo)
            this.addDone(todo)
          } else {
            this.addTodo(todo)
            this.removeDone(done)
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
