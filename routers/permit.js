const router = require('express').Router()
const controller = require('../controllers/permit')
const {
  validateBody,
  validateParams,
  validateUnique,
  validateToken,
  validateRole,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/permit')

router
  .route('/')
  .get(controller.all)
  .post(
    validateToken(),
    validateRole('Admin'),
    validateBody(schemaBody.permit.body),
    validateUnique(DB, 'name'),
    controller.add,
  )

router
  .route('/:id')
  .get(validateParams(schemaParams.id, 'id'), controller.get)
  .patch(
    validateToken(),
    validateRole('Admin'),
    validateParams(schemaParams.id, 'id'),
    validateUnique(DB, 'name'),
    validateBody(schemaBody.permit.patch),
    controller.patch,
  )
  .delete(
    validateToken(),
    validateRole('Admin'),
    validateParams(schemaParams.id, 'id'),
    controller.drop,
  )

module.exports = router
