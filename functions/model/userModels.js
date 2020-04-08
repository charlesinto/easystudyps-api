const joi = require('@hapi/joi');

const userCreationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    phoneNumber: joi.number().required(),
    lastName: joi.string().required(),
    firstName: joi.string().required(),
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

module.exports = {
    userCreationSchema,
    userLoginSchema
}