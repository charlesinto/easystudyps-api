const {testCreationModel} = require('../model/testModel');

const validateTestCreationParams = (req, res, next) => {
    try{
        const {error} = testCreationModel.validate(req.body);

        if(error){
			console.error(req.body);
			console.error(error);
			return res.status(400).send(error);
		}
		
            
        
        return next();
    }catch(error){
        return res.status(500).send(error);
    }
    
}

module.exports = {
    validateTestCreationParams
}