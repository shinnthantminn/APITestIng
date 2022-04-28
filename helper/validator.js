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
      name.map(async (i) => {
        const obj = {}
        obj[i] = req.body[name]
        const finder = await db.findOne(obj)
        num.push(i)
        if (finder) {
          next(new Error(`this ${i} was existing in our server`))
        } else if (num.length === name.length) {
          next()
        }
      })
    }
  },
}