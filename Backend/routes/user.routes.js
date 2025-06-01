const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// Importing necessary modules and initializing the router

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long')
],userController.registerUser)


router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password is required')
],userController.loginUser)


router.post('/profile',authMiddleware.authUser, userController.getUserProfile);


router.post('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;
// This file sets up the user routes for the Express application.