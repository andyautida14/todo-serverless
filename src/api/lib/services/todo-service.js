const ksuid = require('ksuid')
const { Todo } = require('../db').entities
const TodoNotFound = require('../errors/todo-not-found')

const TodoService = {
  async createTodo({ text }) {
    const now = new Date().toISOString()
    const id = await ksuid.random(now)

    const todo = {
      id: id.string,
      created: now,
      modified: now,
      done: false,
      text
    }

    await Todo.put({
      PK: `TODO#${todo.id}`,
      SK: `TODO#${todo.id}`,
      GSI1PK: `TODO`,
      GSI1SK: `TODO#${todo.id}`,
      ...todo
    })

    return todo
  },
  async getTodos() {
    const { Items: todos } = await Todo.query('TODO', {
      index: 'GSI1'
    })
    return todos
  },
  async setToDone(id) {
    try {
      const { Attributes: todo } = await Todo.update({
        PK: `TODO#${id}`,
        SK: `TODO#${id}`,
        GSI1PK: `DONE`,
        done: true
      }, {
        conditions: {
          attr: 'PK',
          exists: true
        },
        returnValues: 'all_new'
      })
      return todo
    } catch(e) {
      if(e.code === 'ConditionalCheckFailedException') {
        throw new TodoNotFound(id)
      }
      throw e
    }
  },
  async getDone() {
    const { Items: todos } = await Todo.query('DONE', {
      index: 'GSI1'
    })
    return todos
  },
  async undone(id) {
    try {
      const { Attributes: todo } = await Todo.update({
        PK: `TODO#${id}`,
        SK: `TODO#${id}`,
        GSI1PK: `TODO`,
        done: false
      }, {
        conditions: {
          attr: 'PK',
          exists: true
        },
        returnValues: 'all_new'
      })
      return todo
    } catch(e) {
      if(e.code === 'ConditionalCheckFailedException') {
        throw new TodoNotFound(id)
      }
      throw e
    }
  }
}

module.exports = TodoService
