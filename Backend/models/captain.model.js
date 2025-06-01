const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Yahan pe mongoose ko import kiya gaya hai, taki hum schema bana sakein
const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
        // Email field with validation for unique and valid email format
    },
    password: {
        type: String,
        required: true,
        select: false // Password ko query mein return nahi karna hai
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long']
        },
        plate:{
            type: String,
            required: true,
            unique: true,
            minlength: [3, 'Plate must be at least 3 characters long']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'], // Allowed vehicle types
        }
    },
    location:{
        lat: {
            type: Number,
        },
        lng:{
            type: Number,
        }
    }
}); 
// Yahan pe schema define kiya gaya hai, jisme fullname, email, password aur role fields hain

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, role: 'captain' }, // Role ko bhi token mein include kiya gaya hai
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
}
// Yahan pe JWT token generate kiya gaya hai, jo user ke ID aur role ko include karta hai
captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('Captain', captainSchema);
// Yahan pe model ko export kiya gaya hai, taki hum ise baaki files mein use kar sakein

module.exports = captainModel;