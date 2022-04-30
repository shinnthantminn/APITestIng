const joi = require('joi')

module.exports = {
  schemaBody: {
    permit: {
      body: joi.object({
        name: joi.string().min(3).required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
      }),
    },
    role: {
      body: joi.object({
        name: joi.string().min(3).required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
      }),
      permit: joi.object({
        roleId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        permitId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
    },
    admin: {
      login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      }),
      register: joi.object({
        name: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        phone: joi.string().required(),
        gender: joi.string().required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
        email: joi.string().email(),
        password: joi.string(),
        phone: joi.string(),
        gender: joi.string(),
      }),
      role: joi.object({
        adminId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        roleId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      permit: joi.object({
        adminId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        permitId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
    },
  },
  schemaParams: {
    id: joi.object({
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
}
