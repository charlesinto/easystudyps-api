const functions = require('firebase-functions');
const cors = require('cors');

const { firebase, admin} = require('./Database');

const db = admin.firestore();
const fcm = admin.messaging()
const app = require('express')();

app.use(cors());

const authRoute = require('./routes/authRoute');

const teacherRoute = require('./routes/teacherRoute')

const schoolRoute = require('./routes/schoolRoute');

const studentRoute = require('./routes/studentRoute');

app.use('/v1/auth', authRoute);

app.use('/v1/auth/teacher', teacherRoute);

app.use('/v1/auth/school', schoolRoute);

app.use('/v1/auth/student', studentRoute)


exports.deleteAssessmentNotification = functions.region('us-central1').firestore.document('assessments/{id}')
                                                 .onDelete( async (snapshot, context) => {
                                                        try{
                                                            // console.log('created documents', snapshot);
                                                            // return null;
                                                            await db.doc(`notifications/${id}`).delete()
                                                              // path = school-schoolLevel-class-subject ===> chris4041-Primary School-SS 1-Mathematics
                                                            return null;
                                                        }  catch (error){
                                                            console.error(error);
                                                            return null;
                                                        }
                                                 })

exports.createNotificationOnAssementCreation = functions.region('us-central1').firestore.document('assessments/{id}')
                                                    .onCreate( async (snapshot, context) => {
                                                    try{
                                                    // console.log('created documents', snapshot);
                                                    // return null;
                                                    
                                                    const {id} = context.params;
                                                    await db.doc(`notifications/${id}`).set({
                                                        quizName: snapshot.data().quizName,
                                                        type: 'Test',
                                                        validUntil: snapshot.data().validUntil,
                                                        subject: snapshot.data().subject,
                                                        schoolCode: snapshot.data().schoolCode,
                                                        studentClass: snapshot.data().studentClass,
                                                        schoolLevel: snapshot.data().schoolLevel,
                                                        createdAt: new Date()
                                                    })
                                                    const payload = {
                                                        notification: {
                                                            title: 'New Assessment Posted!',
                                                            body: `Test on ${snapshot.data().subject} for  ${snapshot.data().subject}
                                                                Posted valid Until ${snapshot.data().validUntil}`,
                                                            icon: 'https://firebasestorage.googleapis.com/v0/b/educationapp-42ccf.appspot.com/o/easy_study.png?alt=media',
                                                            click_action: 'FLUTTER_NOTIFICATION_CLICK' // required only for onResume or onLaunch callbacks
                                                        }
                                                        }
                                                        const group = snapshot.data().studentClass.split(' ').join('-').toLowerCase();
                                                        // schoolcode-class
                                                        return fcm.sendToTopic(`${snapshot.data().schoolCode}-${group}`, payload);
                                                        // path = school-schoolLevel-class-subject ===> chris4041-Primary School-SS 1-Mathematics
                                                        // return fcm.sendToTopic(`${snapshot.data().schoolCode}-${snapshot.data().schoolLevel}-${snapshot.data().studentClass}-${snapshot.data().subject}`, payload)
                                                    }  catch (error){
                                                    console.error(error);
                                                    return null;
                                                    }
                                                    })

exports.teacherNotificationCreate = functions.region('us-central1').firestore.document('notifications/{id}')
                                            .onCreate( async (snapshot, context) => {
                                                try{
                                                    if(snapshot.data().type === 'teacherNotification'){
                                                        const doc = await db.collection('teachers').where('uid', '==', snapshot.data().createdBy).get();
                                                        const schoolCode = doc.docs[0].data()['partnerCode'];
                                                        const payload = {
                                                            notification: {
                                                                title: snapshot.data().title,
                                                                body: snapshot.data().message,
                                                                icon: 'https://firebasestorage.googleapis.com/v0/b/educationapp-42ccf.appspot.com/o/easy_study.png?alt=media',
                                                                click_action: 'FLUTTER_NOTIFICATION_CLICK' // required only for onResume or onLaunch callbacks
                                                            }
                                                            }
                                                            ''.toLowerCase
                                                            const studentClass = snapshot.data().target;
                                                            const userGroup = studentClass.split(' ').join('-').toLowerCase()
                                                        return fcm.sendToTopic(`${schoolCode}-${userGroup}`, payload)
                                                    }
                                                    return null;
                                                }catch(error){
                                                    console.error(error);
                                                }
                                            })




exports.api = functions.https.onRequest(app)
