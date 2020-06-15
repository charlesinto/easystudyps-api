const {admin} = require('../Database')

const {userCreationSchema, userLoginSchema} = require('../model/userModels');

const validateUserParams = (req, res, next) => {
   const {error} = userCreationSchema.validate(req.body);
   if(error){
       console.error(error);
    return res.status(400).send({error});
   }
        

    return next();
}

const validateUserLoginParams = (req, res, next) => {
    const {error} = userLoginSchema.validate(req.body);
    if(error){
        console.error(error);
     return res.status(400).send({error});
    }
 
     return next();
 }


verifyToken = async (req, res, next) => {
    try{
        const bearerHeader = req.body.token || req.headers['x-access-token'];
        if (!bearerHeader){
            return res.status(401).send({
                message: 'Unauthorized user'
            });
        }

       const decodedToken = await admin.auth().verifyIdToken(bearerHeader)

       req.decodedToken = decodedToken;

       return next();
    }catch(error){
        console.error(error);
        if(error.code === 'auth/id-token-expired'){
            return res.status(406).send({message:'Session expired, please login to continue'})
        }
        return res.status(500).send({error})
    }
}

module.exports = {
    validateUserParams,
    validateUserLoginParams,
    verifyToken
}