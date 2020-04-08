const {firebase, admin} = require('../Database')

const db = admin.firestore();

const createUser = async (req, res) => {
    try{
        const {email, password, phoneNumber, lastName, firstName} = req.body;

        const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const token = await data.user.getIdToken(true);
        const uid = data.user.uid;
        await db.doc(`/teachers/${uid}`)
                .set({email, phoneNumber, lastName, firstName, uid});
        return res.status(201).send({
            message:'User created successfully',
            token
        })
    }catch(error){
        if(error.code === 'auth/email-already-in-use')
            return res.status(400).send({message: 'Email already exists'});
        if(error.code === 'auth/invalid-phone-number')
            return res.status(400).send({message: 'Phone Number is invalid'})
        if(error.code === 'auth/invalid-email')
            return res.status(400).send({message:'Email is invalid'});
        console.log('error is: ', error);
        return res.status(500).send({error});
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const data = await firebase.auth().signInWithEmailAndPassword(email, password);
        const token = await data.user.getIdToken(true);
        const uid = data.user.uid;

        const doc = await db.doc(`/teachers/${uid}`).get()

        if(!doc.exists)
            return res.status(404).send({message:'User details not found'});
        return res.status(200).send({
            token,
            email: doc.data().email,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            phoneNumber: doc.data().phoneNumber
        })
    }catch(error){
        if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')
            return res.status(404).send({message: 'Wrong email or password'})
        return res.status(500).send({error})
    }

}

module.exports = {
    createUser,
    loginUser
}