const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userSchema = joi.string().max(30);
const userNameSchema = joi.string().max(30);
const userLastNameSchema = joi.string().max(30);
const userEmailSchema = joi.string().regex(/^[\u00f1\u00d1\w\._\-]{3,25}@[\w\.\-]{3,30}\.\w{2,5}$/);
const userPassSchema = joi.string(); //.regex(/^(?=[\wñÑ]*\d+)(?=[\wñÑ]*[A-ZÑ]+)(?=[\wñÑ]*[a-zñ]+)\S{8,20}$/)//sirve contraseñaA1
const userRoleSchema = joi.string().valid('client', 'admin', 'worker','none');
const userZoneSchema = joi.number().min(1).max(20);
const userPhone = joi.number();

const createUserSchema = {
    userName: userSchema.required(),
    name: userNameSchema.required(),
    lastName: userLastNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPassSchema,
    zone:userZoneSchema,
    phone:userPhone
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