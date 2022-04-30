const DB = require('../models/admin')
const helper = require('../helper/helper')

module.exports = {
  all: async (req, res, next) => {
    const admin = await DB.find().populate('role permit', '-__v')
    helper.fMsg(res, 'all user from server', admin)
  },
  login: async (req, res, next) => {
    const finder = await DB.findOne({ email: req.body.email })
    if (finder) {
      const checker = await helper.compare(req.body.password, finder.password)
      if (checker) {
        const admin = finder.toObject()
        delete admin.password
        admin.token = await helper.token(admin)
        helper.set(admin._id, admin)
        helper.fMsg(res, 'login complete', admin)
      } else next(new Error('password wrong'))
    } else next(new Error('no admin with that id'))
  },
}
