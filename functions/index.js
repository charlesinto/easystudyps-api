const functions = require('firebase-functions');

const app = require('express')();

const authRoute = require('./routes/authRoute');

app.use('/v1/auth', authRoute);



exports.api = functions.https.onRequest(app)
