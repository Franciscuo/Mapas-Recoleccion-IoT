const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userSchema = joi.string().max(20);
const userNameSchema = joi.string().max(20);
const userLastNameSchema = joi.string().max(20);
const userEmailSchema = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
const userPassSchema = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

const createUserSchema = {
  userName: userSchema.required(),
  name: userNameSchema.required(),
  lastName: userLastNameSchema.required(),
  email: userEmailSchema.required(),
  password: userPassSchema.required()
};

const getUserSchema = {
  userName: userSchema,
  name: userNameSchema,
  lastName: userLastNameSchema,
  email: userEmailSchema,
  password: userPassSchema
};

module.exports = {
  userIdSchema,
  createUserSchema,
  getUserSchema
};