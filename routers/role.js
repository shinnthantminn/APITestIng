const router = require('express').Router()
const controller = require('../controllers/role')
const {
  validateBody,
  validateParams,
  validateUnique,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/role')

router
  .route('/')
  .get(controller.all)
  .post([
    validateBody(schemaBody.role.body),
    validateUnique(DB, 'name'),
    controller.add,
  ])

router
  .route('/:id')
  .get(validateParams(schemaParams.id, 'id'), controller.get)
  .patch(
    validateBody(schemaBody.role.patch),
    validateUnique(DB, 'name'),
    validateParams(schemaParams.id, 'id'),
    controller.patch,
  )
  .delete(validateParams(schemaParams.id, 'id'), controller.drop)

router.post(
  '/add/permit',
  validateBody(schemaBody.role.permit),
  controller.addPermit,
)

router.delete(
  '/remove/permit',
  validateBody(schemaBody.role.permit),
  controller.removePermit,
)

module.exports = router
