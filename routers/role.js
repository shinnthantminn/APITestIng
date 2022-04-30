const router = require('express').Router()
const controller = require('../controllers/role')
const {
  validateBody,
  validateParams,
  validateUnique,
  validateToken,
  validateRole,
} = require('../helper/validator')
const { schemaBody, schemaParams } = require('../helper/joiSchema')
const DB = require('../models/role')

router
  .route('/')
  .get(controller.all)
  .post([
    validateToken(),
    validateRole('Admin'),
    validateBody(schemaBody.role.body),
    validateUnique(DB, 'name'),
    controller.add,
  ])

router
  .route('/:id')
  .get(validateParams(schemaParams.id, 'id'), controller.get)
  .patch(
    validateToken(),
    validateRole('Admin'),
    validateBody(schemaBody.role.patch),
    validateUnique(DB, 'name'),
    validateParams(schemaParams.id, 'id'),
    controller.patch,
  )
  .delete(
    validateToken(),
    validateRole('Admin'),
    validateParams(schemaParams.id, 'id'),
    controller.drop,
  )

router.post(
  '/add/permit',
  validateToken(),
  validateRole('Admin'),
  validateBody(schemaBody.role.permit),
  controller.addPermit,
)

router.delete(
  '/remove/permit',
  validateToken(),
  validateRole('Admin'),
  validateBody(schemaBody.role.permit),
  controller.removePermit,
)

module.exports = router
