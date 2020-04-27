const { firebase, admin} = require('../Database')


const db = admin.firestore();

const createSchool = async (req, res) => {
    const {appDomain, schoolName, licenseStartDate, licenseEndDate} = req.body;
    const randomGenerator = Math.floor(Math.random() * 10000);
    const schoolCodeT = schoolName.substring(0,4);
    const schoolCode = `${schoolCodeT}${randomGenerator}`;

    await db.doc(`/partners/${schoolCode}`).set({appDomain, schoolName, licenseStartDate, licenseEndDate});

    return res.status(201).send({
        schoolCode,
        schoolName,
        licenseEndDate, 
        licenseStartDate,
        appDomain
    })
}


const updateSchool = async (req, res) => {
    const {appDomain, schoolCode } = req.query;

    if(appDomain && appDomain.trim() !== ''){
        const dataDoc =  await db.collection('partners').where('appDomain', '==', appDomain).get()
        if(dataDoc.docs.length <= 0){
            return res.status(404).send({
                message: 'Client is not regiestered'
            });
        }
        const schoolCode = dataDoc.docs[0].id;
        await db.doc(`/partners/${schoolCode}`).update(req.body);
      }
    await db.doc(`/partners/${schoolCode}`).set(req.body);

    return res.status(200).send({
        message: 'Updated successfully'
    })
}



const getStudentCount = async (req, res) => {
    const {appDomain, schoolCode } = req.query;

    if(appDomain && appDomain.trim() !== ''){
      const dataDoc =  await db.collection('partners').where('appDomain', '==', appDomain).get()
      if(dataDoc.docs.length <= 0){
          return res.status(404).send({
              message: 'Client is not regiestered'
          })
      }
      const schoolCode = dataDoc.docs[0].id;
      const studentDoc = await db.collection(`/users/${schoolCode}/activated users`).get();
      return res.status(200).send({
          studentCount: studentDoc.docs.length
      })
    }
    const studentDoc = await db.collection(`/users/${schoolCode}/activated users`).get();
    return res.status(200).send({
        studentCount: studentDoc.docs.length
    })
}

module.exports = {
    createSchool,
    getStudentCount,
    updateSchool
}