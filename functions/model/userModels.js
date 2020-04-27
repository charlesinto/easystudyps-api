const joi = require('@hapi/joi');

const userCreationSchema = joi.object({
    appDomain: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    phoneNumber: joi.number().required(),
    lastName: joi.string().required(),
    firstName: joi.string().required(),
    classes: joi.array().min(1)
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});


const schoolSchema = joi.object({
    appDomain: joi.string().required(),
    schoolName: joi.string().required(),
    licenseStartDate: joi.date().required(),
    licenseEndDate: joi.date().required()
})

const studentSchema = joi.object({
    students: joi.array().min(1).required(),
    appDomain: joi.string().required()
})

module.exports = {
    userCreationSchema,
    userLoginSchema,
    schoolSchema,
    studentSchema
}