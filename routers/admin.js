const router = require('express').Router()
const controller = require('../controllers/admin')
const {
  validateBody,
  validateParams,
  validateUnique,
  validateToken,
  validateRole,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/admin')

router
  .route('/')
  .post(validateBody(schemaBody.admin.login), controller.login)
  .get(controller.all)

router
  .route('/:id')
  .get(validateParams(schemaParams.id, 'id'), controller.get)
  .patch(
    validateParams(schemaParams.id, 'id'),
    validateBody(schemaBody.admin.patch),
    validateUnique(DB, 'email', 'phone'),
    controller.patch,
  )
  .delete(validateParams(schemaParams.id, 'id'), controller.drop)

router.post(
  '/register',
  validateBody(schemaBody.admin.register),
  validateUnique(DB, 'email', 'phone'),
  controller.register,
)

router.post('/add/role', [
  validateBody(schemaBody.admin.role),
  validateToken(),
  validateRole('Admin'),
  controller.addRole,
])

router.post('/add/permit', [
  validateBody(schemaBody.admin.permit),
  validateToken(),
  validateRole('Admin'),
  controller.addPermit,
])

router.delete('/remove/permit', [
  validateBody(schemaBody.admin.permit),
  validateToken(),
  validateRole('Admin'),
  controller.removePermit,
])

router.delete('/remove/role', [
  validateBody(schemaBody.admin.role),
  validateToken(),
  validateRole('Admin'),
  controller.removeRole,
])

module.exports = router
