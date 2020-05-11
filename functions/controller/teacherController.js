const {firebase, admin} = require('../Database')

const db = admin.firestore();

const createTest = async (req, res) => {
    try{
        const {id, quizName, numberOfQuestions, isTimed, numberOfMinutesToComplete, 
            subject, schoolLevel, questions, totalValidMarks, validUntil, targetedClass} = req.body;
    
        const teacherId = req.decodedToken.uid;
        const schoolLevelToLowerCase = schoolLevel.toLowerCase()
        const targetedClassToLowerCase = targetedClass.toLowerCase()
        const subjectToLowerCase = subject.toLowerCase()
        const teacherDoc = await db.doc(`/teachers/${teacherId}`).get()
        const schoolCode = teacherDoc.data().partnerCode;
        await db.collection(`assessments`)
                .add({
                    id,
                    quizName,
                    numberOfQuestions,
                    isTimed,
                    schoolCode,
                    numberOfMinutesToComplete,
                    subject: subjectToLowerCase,
                    schoolLevel: schoolLevelToLowerCase,
                    questions,
                    totalValidMarks,
                    validUntil,
                    studentClass: targetedClassToLowerCase,
                    createdBy: teacherId,
                    createdAt: new Date()
                })

        return res.status(201).send({message:'Test created successfully'})
    }catch(error){
        console.error(error);
        return res.status(500).send({error});
    }
    
}

const getTestsTeacher = async (req, res) => {
    try{
        console.log(req.query)
        const {schoolLevel, subject} = req.query;
        const teacherId = req.decodedToken.uid;
        const schoolLevelToLowerCase = schoolLevel.toLowerCase()
        const subjectToLowerCase = subject.toLowerCase()
        const teacherDoc = await db.doc(`/teachers/${teacherId}`).get()
        const schoolCode = teacherDoc.data().partnerCode;
        const assessments = [];


        const  document = await db.collection(`assessments`)
                            .where('schoolCode', '==', schoolCode)
                            .where('subjectToLowerCase', '==', subjectToLowerCase)
                            .orderBy('createdAt','desc').get();
        
        
        document.forEach(doc => assessments.push({
            id: doc.id,
            quizName: doc.data().quizName,
            numberOfQuestions: doc.data().numberOfQuestions,
            isTimed: doc.data().isTimed,
            numberOfMinutesToComplete: doc.data().numberOfMinutesToComplete,
            subject: doc.data().subject,
            schoolLevel: doc.data().schoolLevel,
            questions: doc.data().questions,
            totalValidMarks: doc.data().totalValidMarks,
            valideUntil: doc.data().valideUntil,
            createdBy: doc.data().createdBy,
            createdAt: doc.data().createdAt
        }))

        return res.status(200).send({message: 'Operation successful', assessments})
    }catch(error){
        console.error(error);
        return res.status(500).send({error});
    }
}

module.exports = {
    createTest,
    getTestsTeacher
}

/*
quizName: Joi.string().required(),
    numberOfQuestions: Joi.string(),
    isTimed: Joi.boolean().required(),
    numberOfMinutesToComplete: Joi.string().required(),
    subject: Joi.string().required(),
    schoolLevel: Joi.string().required(),
    questions: Joi.array().min(1).required(),
    totalValidMarks: Joi.number().required(),
    valideUntil: Joi.date()

*/