const router = require('express').Router()
const controller = require('../controllers/admin')
const {
  validateBody,
  validateParams,
  validateUnique,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')

router
  .route('/')
  .post(validateBody(schemaBody.admin.login), controller.login)
  .get(controller.all)

module.exports = router
