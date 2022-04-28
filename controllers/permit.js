const DB = require('../models/permit')
const helper = require('../helper/helper')

module.exports = {
  all: async (req, res, next) => {
    const permit = await DB.find()
    helper.fMsg(res, 'all permit from Server', permit)
  },
  add: async (req, res, next) => {
    await new DB(req.body).save()
    const permit = await DB.find()
    helper.fMsg(res, 'add permit Complete', permit)
  },
  get: async (req, res, next) => {
    const permit = await DB.findById(req.params.id)
    permit
      ? helper.fMsg(res, 'single permit by id', permit)
      : next(new Error('no permit with that id'))
  },
  patch: async (req, res, next) => {
    const permit = await DB.findById(req.params.id)
    if (permit) {
      await DB.findByIdAndUpdate(permit._id, req.body)
      const newPermit = await DB.find()
      helper.fMsg(res, 'update permit Complete', newPermit)
    } else next(new Error('no permit with that id'))
  },
  drop: async (req, res, next) => {
    const permit = await DB.findById(req.params.id)
    if (permit) {
      await DB.findByIdAndDelete(permit._id)
      const newPermit = await DB.find()
      helper.fMsg(res, 'update permit Complete', newPermit)
    } else next(new Error('no permit with that id'))
  },
}
