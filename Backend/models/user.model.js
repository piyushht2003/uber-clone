const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// This module defines the User schema and model for MongoDB using Mongoose.
const jwt = require('jsonwebtoken');




const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false, // Do not return password in queries
    },
    socketId:{
        type: String,
    }  
});
// Define the user schema with fields for fullname, email, password, and socketId

// Generate a JWT token for the user
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
}
// Generate a JWT token for the user

// Method to compare the candidate password with the stored password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Static method to hash the password
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}


// Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;