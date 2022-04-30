const DB = require('../models/role')
const permitDB = require('../models/permit')
const helper = require('../helper/helper')

module.exports = {
  all: async (req, res, next) => {
    const role = await DB.find().populate('permit', '-__v')
    helper.fMsg(res, 'all role from server', role)
  },
  add: async (req, res, next) => {
    await new DB(req.body).save()
    const role = await DB.find().populate('permit', '-__v')
    helper.fMsg(res, 'add role complete', role)
  },
  get: async (req, res, next) => {
    const role = await DB.findById(req.params.id).populate('permit', '-__v')
    role
      ? helper.fMsg(res, 'get role by id', role)
      : next(new Error('no role with that id'))
  },
  patch: async (req, res, next) => {
    const role = await DB.findById(req.params.id)
    if (role) {
      await DB.findByIdAndUpdate(role._id, req.body)
      const newRole = await DB.find().populate('permit', '-__v')
      helper.fMsg(res, 'update role complete', newRole)
    } else next(new Error('no role with that id'))
  },
  drop: async (req, res, next) => {
    const role = await DB.findById(req.params.id)
    if (role) {
      await DB.findByIdAndDelete(role._id)
      const newRole = await DB.find().populate('permit', '-__v')
      helper.fMsg(res, 'delete role complete', newRole)
    } else next(new Error('no role with that id'))
  },
  addPermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId)
    const permitId = await permitDB.findById(req.body.permitId)
    const finder = roleId.permit.find((i) => i.equals(permitId._id))
    if (finder) {
      next(new Error('this permit was existing in our server'))
      return
    }
    if (roleId && permitId) {
      await DB.findByIdAndUpdate(roleId._id, {
        $push: { permit: permitId._id },
      })
      const newRole = await DB.find().populate('permit', '-__v')
      helper.fMsg(res, 'permit add complete', newRole)
    } else next(new Error('something wrong'))
  },
  removePermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId)
    if (roleId) {
      await DB.findByIdAndUpdate(roleId._id, {
        $pull: { permit: req.body.permitId },
      })
      const newRole = await DB.find().populate('permit', '-__v')
      helper.fMsg(res, 'permit remove complete', newRole)
    } else next(new Error('no role found'))
  },
}
