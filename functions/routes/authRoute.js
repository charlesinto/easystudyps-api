const express = require('express');
const {verifyToken} = require('../middleware/authMiddleware')
const {validateUserParams, validateUserLoginParams} = require('../middleware/authMiddleware');

const {createUser, loginUser, deleteTeacher} = require('../controller/authController');
 

const router = express.Router();

router.post('/signup', validateUserParams, createUser );

router.delete('/teacher/delete/:email', verifyToken, deleteTeacher)

router.post('/login', validateUserLoginParams, loginUser)

module.exports = router;