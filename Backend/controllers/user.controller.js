const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const blacklistTokenModel = require('../models/blacklistToken');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    // Yahan par validation errors check kar rahe hain, agar koi error hai toh response bhej rahe hain
}
    const { fullname, email, password } = req.body; // User se data le rahe hain
    const {firstname, lastname} = fullname; // Fullname se firstname aur lastname nikaal rahe hain

    const isUserAlreadyExists = await userModel.findOne({ email }); // Email se user ko dhoond rahe hain
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' }); // Agar user already exists toh error bhej rahe hain
    }

    const hashPassword = await userModel.hashPassword(password); // Password ko hash kar rahe hain

    const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password: hashPassword // Hashed password ko store kar rahe hain
    });

    const token = user.generateAuthToken(); // User ke liye JWT token generate kar rahe hain

    res.status(201).json({
        message: 'User registered successfully', user, token // Token ko response mein bhej rahe hain
    });
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    // Yahan par validation errors check kar rahe hain, agar koi error hai toh response bhej rahe hain
}
    const { email, password } = req.body; // User se email aur password le rahe hain

    const user = await userModel.findOne({ email }).select('+password'); // Email se user ko dhoond rahe hain aur password bhi select kar rahe hain

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Agar user nahi mila toh error bhej rahe hain
    }

    const isMatch = await user.comparePassword(password); // Password match kar rahe hain

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Agar password match nahi hua toh error bhej rahe hain
    }

    const token = user.generateAuthToken(); // User ke liye JWT token generate kar rahe hain



    res.status(200).json({
        message: 'Login successful', user, token // Token ko response mein bhej rahe hain
    });
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user); // Authenticated user ka profile response mein bhej rahe hain
}

module.exports.logoutUser = async (req, res, next) => {
    // Logout ke liye sirf token ko invalidate karna hota hai, yahan par hum sirf success message bhej rahe hain
    res.clearCookie('token'); // Cookie se token ko clear kar rahe hain

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token }); // Token ko blacklist kar rahe hain
    // BlacklistToken model mein token ko store kar rahe hain taaki future mein use na ho sake

    res.status(200).json({ message: 'Logout successful' });
}