
const express = require('express')

const router = express.Router();

const { createStudent } = require('../controller/studentController')

const { validateStudentParams } = require('../middleware/scholMiddleware')

router.post('/create-student', validateStudentParams, createStudent)

module.exports = router;