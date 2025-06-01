const blacklistToken = require('../models/blacklistToken');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
// Controller for registering a captain (driver)

// You can add validation and service logic here
module.exports.registerCaptain = async (req, res, next) => {
    // Validation errors ko check kar rahe hain, agar koi error hai toh response bhej rahe hain
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullname, email, password, vehicle } = req.body; // Captain se data le rahe hain
    const { firstname, lastname } = fullname; // Fullname se firstname aur lastname nikaal rahe hain

    const isCaptainAlreadyExists = await captainModel.findOne({ email }); // Email se captain ko dhoond rahe hain

    if (isCaptainAlreadyExists) {
        return res.status(400).json({ message: 'Captain already exists' }); // Agar captain already exists toh error bhej rahe hain
    }

    const hashedPassword = await captainModel.hashPassword(password); // Password ko hash kar rahe hain

    const captain = await captainService.createCaptain({
        firstname,
        lastname,
        email,
        password: hashedPassword, // Hashed password ko store kar rahe hain
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken(); // Captain ke liye JWT token generate kar rahe hain
    res.status(201).json({
        message: 'Captain registered successfully',
        captain,
        token // Token ko response mein bhej rahe hain
    });
};

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body; // Login ke liye email aur password le rahe hain
    const captain = await captainModel.findOne({ email }).select('+password'); // Email se captain ko dhoond rahe hain aur password bhi select kar rahe hain
    if (!captain) {
        return res.status(400).json({ message: 'Invalid email or password' }); // Agar captain nahi mila toh error bhej rahe hain
    }
    const isMatch = await captain.comparePassword(password); // Password ko compare kar rahe hain (instance method)
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' }); // Agar password match nahi hua toh error bhej rahe hain
    }


    const token = captain.generateAuthToken(); // Captain ke liye JWT token generate kar rahe hain

    res.cookie('token', token, {
        httpOnly: true, // Cookie ko HTTP only banate hain
        secure: process.env.NODE_ENV === 'production', // Production mein secure cookie set karte hain
        maxAge: 24 * 60 * 60 * 1000 // Cookie ka expiry time set karte hain (1 din)
    });

    res.status(200).json({
        message: 'Captain logged in successfully',
        captain,
        token // Token ko response mein bhej rahe hain
    });
}

module.exports.getCaptainPtofile = async (req, res, next) => {
    res.status(200).json({
        message: 'Captain profile fetched successfully',
        captain: req.captain // Request se captain ko bhej rahe hain
    });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Token ko cookies ya headers se le rahe hain
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // Agar token nahi hai toh unauthorized response bhej rahe hain
    }
    await blacklistToken.create({ token }); // Token ko blacklist mein daal rahe hain
    
    res.clearCookie('token'); // Cookie ko clear kar rahe hain
    res.status(200).json({ message: 'Captain logged out successfully' }); // Logout success message bhej rahe hain
}