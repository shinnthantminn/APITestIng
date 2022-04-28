const router = require('express').Router()
const controller = require('../controllers/permit')
const {
  validateBody,
  validateParams,
  validateUnique,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/permit')

router
  .route('/')
  .get(controller.all)
  .post(
    validateBody(schemaBody.permit.body),
    validateUnique(DB, 'name'),
    controller.add,
  )

router
  .route('/:id')
  .get(validateParams(schemaParams.id, 'id'), controller.get)
  .patch(
    validateParams(schemaParams.id, 'id'),
    validateUnique(DB, 'name'),
    validateBody(schemaBody.permit.patch),
    controller.patch,
  )
  .delete(validateParams(schemaParams.id, 'id'), controller.drop)

module.exports = router
