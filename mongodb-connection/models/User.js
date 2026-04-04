const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number']
    },
    vehicles: [{
        type: String,
        trim: true,
        uppercase: true,
        match: /^[A-Z]{2}\s*[0-9]{1,2}\s*[A-Z]{1,3}\s*[0-9]{1,4}$/, message: 'Invalid vehicle number format'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'traffic_police'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'vehicles': 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByVehicle = function(vehicleNumber) {
    return this.find({ vehicles: vehicleNumber.toUpperCase() });
};

// Instance methods
userSchema.methods.addVehicle = function(vehicleNumber) {
    const formattedVehicle = vehicleNumber.toUpperCase().trim();
    if (!this.vehicles.includes(formattedVehicle)) {
        this.vehicles.push(formattedVehicle);
    }
    return this.save();
};

userSchema.methods.removeVehicle = function(vehicleNumber) {
    const formattedVehicle = vehicleNumber.toUpperCase().trim();
    this.vehicles = this.vehicles.filter(v => v !== formattedVehicle);
    return this.save();
};

userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
