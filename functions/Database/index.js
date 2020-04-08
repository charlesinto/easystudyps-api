const admin = require('firebase-admin');

const firebase = require('firebase');
const serviceAccount = require('../serviceKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://educationapp-42ccf.firebaseio.com'
});

const config = {
    apiKey: "AIzaSyBlI2V_aemZXa0oqVZwNTCHuMQ-xwwX44E",
    authDomain: "educationapp-42ccf.firebaseapp.com",
    databaseURL: "https://educationapp-42ccf.firebaseio.com",
    projectId: "educationapp-42ccf",
    storageBucket: "educationapp-42ccf.appspot.com",
    messagingSenderId: "716733741407",
    appId: "1:716733741407:web:63cc33545e87b63ec69eea",
    measurementId: "G-9C6YKXCTS8"
}

firebase.initializeApp(config);

module.exports = {
    firebase,
    admin
}