const {firebase, admin} = require('../Database')

const db = admin.firestore();

const createUser = async (req, res) => {
    try{
        const {email, password, phoneNumber, lastName, firstName, appDomain, classes, subjects} = req.body;
        const partners = await db.collection('partners').where('appDomain','==',appDomain).get()
        const serverPartner = [];
        partners.forEach(doc => serverPartner.push({id: doc.id, appDomain: doc.data().appDomain}))
        if(serverPartner.length <= 0)
            return res.status(400).send({message: 'Partner not recongised, invalid app domain'})
        const partnerCode = serverPartner[0].id;
        const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const token = await firebase.auth().currentUser.getIdToken(true)
        const uid = data.user.uid;
        await db.doc(`/teachers/${uid}`)
                .set({email, phoneNumber, lastName, firstName, uid, partnerCode, classes, subjects});
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

const adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const data = await firebase.auth().signInWithEmailAndPassword(email, password);
        const token = await data.user.getIdToken(true);
        return res.status(200).send({
            token,
        })
    }catch(error){
        if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')
            return res.status(404).send({message: 'Wrong email or password'})
        return res.status(500).send({error})
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
            phoneNumber: doc.data().phoneNumber,
        })
    }catch(error){
        if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found')
            return res.status(404).send({message: 'Wrong email or password'})
        return res.status(500).send({error})
    }

}

const deleteTeacher = async (req, res) => {
    try{
        // console.log('caller here')
        const {email} = req.params;

        if(!email) return res.status(400).send({message:' MISSING PARAMS, EMAIL IS REQUIRED'})

        const docSnapshot = await db.collection('teachers').where('email', '==', email ).get()
        // console.log(docSnapshot.docs[0].id)
        if(!docSnapshot.empty){
            const doc = docSnapshot.docs[0];
            const uid = doc.data().uid
            if(uid){
                // console.log('found here')
                await admin.auth().deleteUser(uid)
                await db.doc(`/teachers/${doc.id}`).delete()
                return res.status(200).send({
                    meessage: 'Account Deleted successfully'
                })
            }
            return res.status(404).send({
                message: 'No Account found with the email'
            })
        }
        return res.status(404).send({
            message: 'User Account does not exist'
        })
    }catch(error){
        console.error(error);
        return res.status(500).send({error})
    }
}

const updateTeacherDetails = async (req, res) => {
    try{
        const {oldEmail, newEmail, password, firstName, lastName, phoneNumber, classes, subjects} = req.body;
        let id;
        let uid;
        let docSnapshot1;
        let docSnapshot;
        
        if((newEmail && newEmail.trim() !== '') && (password && password && password.trim() !== '')){
            docSnapshot1 = await db.collection('teachers').where('email', '==', newEmail).get();
            if(!docSnapshot1.empty){
                return res.status(400).send({message: `AN ACCOUNT EXISTS WITH EMAIL: ${newEmail}`})
            }
            docSnapshot = await db.collection('teachers').where('email', '==', oldEmail).get();
            if(docSnapshot.empty){
                return res.status(404).send({message: `NO ACCOUNT FOUND WITH THE EMAIL: ${oldEmail}`})
            }
            uid = docSnapshot.docs[0].data().uid; 
            await admin.auth().updateUser(uid, {
                email: newEmail,
                emailVerified: true,
                password: password,
            })

            await db.doc(`/teachers/${id}`).update({
                email: newEmail
            })
        }
        else if((newEmail && newEmail.trim() !== '') && !(password && password && password.trim() !== '')){
            docSnapshot1 = await db.collection('teachers').where('email', '==', newEmail).get();
            if(!docSnapshot1.empty){
                return res.status(400).send({message: `AN ACCOUNT EXISTS WITH EMAIL: ${newEmail}`})
            }
            docSnapshot = await db.collection('teachers').where('email', '==', oldEmail).get();
            if(docSnapshot.empty){
                return res.status(404).send({message: `NO ACCOUNT FOUND WITH THE EMAIL: ${oldEmail}`})
            }
            uid = docSnapshot.docs[0].data().uid; 
            await admin.auth().updateUser(uid, {
                email: newEmail,
                emailVerified: true,
            })
            await db.doc(`/teachers/${id}`).update({
                email: newEmail
            })
        }
        else if(!(newEmail && newEmail.trim() !== '') || (password && password && password.trim() !== '')){
            
            docSnapshot = await db.collection('teachers').where('email', '==', oldEmail).get();
            if(docSnapshot.empty){
                return res.status(404).send({message: `NO ACCOUNT FOUND WITH THE EMAIL: ${oldEmail}`})
            }
            uid = docSnapshot.docs[0].data().uid; 
             await admin.auth().updateUser(uid, {
                password
            })
        }
        docSnapshot = await db.collection('teachers').where('email', '==', oldEmail).get();
        if(docSnapshot.empty){
            return res.status(404).send({message: `NO ACCOUNT FOUND WITH THE EMAIL: ${oldEmail}`})
        }
        id = docSnapshot.docs[0].id
        if(classes){
            await db.doc(`/teachers/${id}`).update({
                classes,
            })
        }
        if(subjects){
            await db.doc(`/teachers/${id}`).update({
                subjects,
            })
        }

        if(firstName){
            await db.doc(`/teachers/${id}`).update({
                firstName,
            })
        }

        if(lastName){
            await db.doc(`/teachers/${id}`).update({
                lastName
            })
        }
        
        if(phoneNumber){
            await db.doc(`/teachers/${id}`).update({
                phoneNumber,
            })
        }
        

        return res.status(200).send({
            message: 'Account Updated successfully'
        })
    }catch(error){
        console.error(error);
        return res.status(500).send({error})
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteTeacher,
    updateTeacherDetails,
    adminLogin
}