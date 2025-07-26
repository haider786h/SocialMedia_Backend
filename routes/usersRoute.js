// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/User');
const profileController = require('../Controller/ProfileController');
const auth = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', auth, userController.getProfile);

// Profile routes
router.post('/upload-profile', auth, upload.single('image'), profileController.uploadProfile);
router.get('/profile', auth, profileController.getProfile); 

module.exports = router;
