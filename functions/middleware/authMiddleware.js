

const {userCreationSchema, userLoginSchema} = require('../model/userModels');

const validateUserParams = (req, res, next) => {
   const {error} = userCreationSchema.validate(req.body);
   if(error)
        return res.status(400).send({error});

    return next();
}

const validateUserLoginParams = (req, res, next) => {
    const {error} = userLoginSchema.validate(req.body);
    if(error)
         return res.status(400).send({error});
 
     return next();
 }

module.exports = {
    validateUserParams,
    validateUserLoginParams
}