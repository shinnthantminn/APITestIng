const DB = require('../models/admin')
const helper = require('../helper/helper')

module.exports = {
  all: async (req, res, next) => {
    const admin = await DB.find().populate('role permit', '-__v')
    helper.fMsg(res, 'all user from server', admin)
  },
  login: async (req, res, next) => {
    const finder = await DB.findOne({ email: req.body.email }).populate(
      'role permit',
      '-__v',
    )
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
  register: async (req, res, next) => {
    req.body.password = await helper.encode(req.body.password)
    await new DB(req.body).save()
    const admin = await DB.find().populate('role permit', '-__v')
    helper.fMsg(res, 'register complete', admin)
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id)
    finder
      ? helper.fMsg(res, 'get single admin', finder)
      : next(new Error('no admin with that id'))
  },
  patch: async (req, res, next) => {
    const finder = await DB.findById(req.params.id)
    if (finder) {
      await DB.findByIdAndUpdate(finder._id, req.body)
      const admin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'update complete', admin)
    } else next(new Error('no admin with that id'))
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id)
    if (finder) {
      await DB.findByIdAndDelete(finder._id)
      const admin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'delete complete', admin)
    } else next(new Error('no admin with that id'))
  },
}
