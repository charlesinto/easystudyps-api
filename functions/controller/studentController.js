
const {firebase, admin} = require('../Database')

const db = admin.firestore()

const createStudent = async (req, res) => {
    const { students, appDomain } = req.body;
    const dataDoc =  await db.collection('partners').where('appDomain', '==', appDomain).get()
    if(dataDoc.docs.length <= 0){
        return res.status(404).send({
            message: 'Client is not regiestered'
        });
    }

    const schoolCode = dataDoc.docs[0].id;


    students.forEach( async(student)=> {
        student.schoolCode = schoolCode;
        student.class = student.class.toLowerCase()
        await db.collection('students').add(student)
    })

    return res.status(201).send({
        message: 'Student created successfully'
    })
    
}

module.exports = {
    createStudent
}