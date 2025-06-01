const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistToken = require('../models/blacklistToken');

module.exports.authUser = async(req, res, next)=>{
    // Token ko cookies se ya headers se nikal rahe hain (authorization header me 'Bearer <token>' format hota hai)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklistToken.findOne({
        token: token,
        isBlacklisted: true
    });
    
    if(isBlacklisted){
        return res.status(401).json({ message: 'Unauthorized' });
    }// Agar token blacklist me hai toh unauthorized response bhej rahe hain

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user =await userModel.findById(decoded._id);

        req.user = user; // User ko request object me set kar rahe hain
        next(); // Agla middleware ya route handler call kar rahe hain
    }catch(err){
        return res.status(401).json({message: 'Unathorized'});
    }
}

module.exports.authCaptain = async(req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklistToken.findOne({
        token: token
    });

    if(isBlacklisted){
        return res.status(401).json({ message: 'Unauthorized' });
    } // Agar token blacklist me hai toh unauthorized response bhej rahe hain

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await userModel.findById(decoded._id);

        req.captain = captain; // Captain ko request object me set kar rahe hain
        next(); // Agla middleware ya route handler call kar rahe hain
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}