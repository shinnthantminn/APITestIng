const router = require('express').Router()
const controller = require('../controllers/admin')
const {
  validateBody,
  validateParams,
  validateUnique,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/admin')

router
  .route('/')
  .post(validateBody(schemaBody.admin.login), controller.login)
  .get(controller.all)

router.post(
  '/register',
  validateBody(schemaBody.admin.register),
  validateUnique(DB, 'email', 'phone'),
  controller.register,
)

module.exports = router
