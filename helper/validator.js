const helper = require('../helper/helper')

module.exports = {
  validateBody: (schema) => {
    return async (req, res, next) => {
      const result = await schema.validate(req.body)
      if (result.error) {
        next(new Error(result.error.details[0].message))
      } else next()
    }
  },
  validateParams: (schema, name) => {
    return async (req, res, next) => {
      const obj = {}
      obj[name] = req.params[name]
      const result = await schema.validate(obj)
      if (result.error) {
        next(new Error(result.error.details[0].message))
      } else next()
    }
  },
  validateUnique: (db, ...name) => {
    return async (req, res, next) => {
      const num = []
      for (const i of name) {
        const obj = {}
        obj[i] = req.body[i]
        const finder = await db.findOne(obj)
        num.push(i)
        if (finder) {
          next(new Error(`this ${i} was existing in our server`))
        } else if (num.length === name.length) {
          next()
        }
      }
    }
  },
  validateToken: () => {
    return async (req, res, next) => {
      console.log()
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const data = await helper.decode(token)
        const item = await helper.get(data._id)
        const admin = JSON.parse(item)
        if (admin) {
          req.admin = admin
          next()
        } else next(new Error('your are no login'))
      } else next(new Error('tokenization error'))
    }
  },
  validateRole: (...role) => {
    return async (req, res, next) => {
      const data = req.admin.role.map((i) => i.name)
      const finder = await data.some((i) => role.includes(i))
      if (finder) {
        next()
      } else next(new Error('you have no permission'))
    }
  },
}
