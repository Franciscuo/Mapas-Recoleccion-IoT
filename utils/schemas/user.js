const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userSchema = joi.string().max(20);
const userNameSchema = joi.string().max(20);
const userLastNameSchema = joi.string().max(20);
const userEmailSchema = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
const userPassSchema = joi.string()
const userRoleSchema = joi.string().valid('client', 'admin', 'worker');


const createUserSchema = {
    userName: userSchema.required(),
    name: userNameSchema.required(),
    lastName: userLastNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPassSchema.required()
};

const getUserSchema = {
    userName: userSchema,
    email: userEmailSchema,
    role: userRoleSchema,
    _id: userIdSchema
};

module.exports = {
    userIdSchema,
    createUserSchema,
    getUserSchema
};