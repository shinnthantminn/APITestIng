const DB = require('../models/admin')
const roleDB = require('../models/role')
const permitDB = require('../models/permit')
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
  addRole: async (req, res, next) => {
    const admin = await DB.findById(req.body.adminId)
    const role = await roleDB.findById(req.body.roleId)

    const finder = admin.role.find((i) => i.equals(role._id))
    if (finder) {
      next(new Error('this role was existing in our server'))
      return
    }
    if (admin && role) {
      await DB.findByIdAndUpdate(admin._id, { $push: { role: role._id } })
      const newAdmin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'add role complete', newAdmin)
    } else next(new Error('something error'))
  },
  addPermit: async (req, res, next) => {
    const admin = await DB.findById(req.body.adminId)
    const permit = await permitDB.findById(req.body.permitId)

    const finder = admin.permit.find((i) => i.equals(permit._id))
    if (finder) {
      next(new Error('this permit was existing in our server'))
      return
    }
    if (admin && permit) {
      await DB.findByIdAndUpdate(admin._id, { $push: { permit: permit._id } })
      const newAdmin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'add permit complete', newAdmin)
    } else next(new Error('something error'))
  },
  removeRole: async (req, res, next) => {
    const admin = await DB.findById(req.body.adminId)
    if (admin) {
      await DB.findByIdAndUpdate(admin._id, {
        $pull: { role: req.body.roleId },
      })
      const newAdmin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'remove role complete', newAdmin)
    } else next(new Error('admin no found'))
  },
  removePermit: async (req, res, next) => {
    const admin = await DB.findById(req.body.adminId)
    if (admin) {
      await DB.findByIdAndUpdate(admin._id, {
        $pull: { permit: req.body.permitId },
      })
      const newAdmin = await DB.find().populate('permit role', '-__v')
      helper.fMsg(res, 'reomve permit complete', newAdmin)
    } else next(new Error('admin no found'))
  },
}
