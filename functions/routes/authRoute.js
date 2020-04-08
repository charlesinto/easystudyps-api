const express = require('express');

const {validateUserParams, validateUserLoginParams} = require('../middleware/authMiddleware');

const {createUser, loginUser} = require('../controller/authController');

const router = express.Router();

router.post('/signup', validateUserParams, createUser );

router.post('/login', validateUserLoginParams, loginUser)

module.exports = router;