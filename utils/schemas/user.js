const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userSchema = joi.string().max(20);
const userNameSchema = joi.string().max(20);
const userLastNameSchema = joi.string().max(20);
const userEmailSchema = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
const userPassSchema = joi.string(); //.regex(/^(?=[\wñÑ]*\d+)(?=[\wñÑ]*[A-ZÑ]+)(?=[\wñÑ]*[a-zñ]+)\S{8,20}$/)//sirve contraseñaA1
const userRoleSchema = joi.string().valid('client', 'admin', 'worker');
const userZoneSchema = joi.number().min(1).max(20);

const createUserSchema = {
    userName: userSchema.required(),
    name: userNameSchema.required(),
    lastName: userLastNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPassSchema,
    zone:userZoneSchema,
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