const express = require('express');

const {verifyToken} = require('../middleware/authMiddleware')

const {validateTestCreationParams} = require('../middleware/teacherMiddleware');

const {createTest, getTestsTeacher, addTestQuestion} = require('../controller/teacherController')

const router = express.Router();

router.post('/create-test', verifyToken, validateTestCreationParams, createTest )

router.get('/tests', verifyToken, getTestsTeacher)




router.patch('/test/:id/add-question', verifyToken, addTestQuestion )

module.exports = router;