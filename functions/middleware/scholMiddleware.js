const { schoolSchema } = require('../model/userModels')
const { studentSchema} = require('../model/userModels')

const validateSchoolParams =(req, res, next) => {
    const {error} = schoolSchema.validate(req.body);

    if(error){
        console.error(error);
        return res.status(400).send({error});
    }

    return next();

}

const validateStudentParams =(req, res, next) => {
    const {error} = studentSchema.validate(req.body);

    if(error){
        console.error(error);
     return res.status(400).send({error});
    }

    return next();

}

module.exports = {
    validateSchoolParams,
    validateStudentParams
}