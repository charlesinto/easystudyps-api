const express = require('express');
const {verifyToken, validateTeacherUpdateParams} = require('../middleware/authMiddleware')
const {validateUserParams, validateUserLoginParams} = require('../middleware/authMiddleware');

const {createUser, loginUser, deleteTeacher, updateTeacherDetails, adminLogin} = require('../controller/authController');
 

const router = express.Router();

router.post('/signup', validateUserParams, createUser );

router.delete('/teacher/delete/:email', verifyToken, deleteTeacher)

router.post('/login', validateUserLoginParams, loginUser)

router.patch('/teacher/update',verifyToken, validateTeacherUpdateParams, updateTeacherDetails)

router.post('/admin/login', adminLogin)

module.exports = router;