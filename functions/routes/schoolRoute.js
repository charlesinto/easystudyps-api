const express = require('express');

const { validateSchoolParams } = require('../middleware/scholMiddleware')
const { createSchool,updateSchool, getStudentCount } = require('../controller/schoolController')
const router = express.Router();


router.post('/create-school', validateSchoolParams, createSchool );

router.patch('/update', updateSchool)

router.get('/count', getStudentCount);


module.exports = router;