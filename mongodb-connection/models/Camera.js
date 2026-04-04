const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    cameraId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'maintenance', 'offline'],
        default: 'active',
        index: true
    },
    cameraType: {
        type: String,
        required: true,
        enum: ['traffic', 'speed', 'signal', 'surveillance'],
        default: 'traffic'
    },
    resolution: {
        width: {
            type: Number,
            default: 1920
        },
        height: {
            type: Number,
            default: 1080
        }
    },
    fps: {
        type: Number,
        default: 30,
        min: 1,
        max: 60
    },
    ipAddress: {
        type: String,
        required: true,
        match: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    },
    port: {
        type: Number,
        default: 80
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rtspUrl: {
        type: String,
        required: true
    },
    detectionZones: [{
        name: String,
        coordinates: [{
            x: Number,
            y: Number
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    aiConfig: {
        helmetDetection: {
            enabled: { type: Boolean, default: true },
            confidence: { type: Number, default: 0.7, min: 0, max: 1 }
        },
        tripleRidingDetection: {
            enabled: { type: Boolean, default: true },
            confidence: { type: Number, default: 0.8, min: 0, max: 1 }
        },
        signalViolationDetection: {
            enabled: { type: Boolean, default: true },
            confidence: { type: Number, default: 0.9, min: 0, max: 1 }
        }
    },
    lastHeartbeat: {
        type: Date,
        default: null
    },
    uptime: {
        type: Number,
        default: 0 // in hours
    },
    maintenanceSchedule: {
        nextMaintenance: Date,
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly'],
            default: 'monthly'
        },
        lastMaintenance: Date
    },
    statistics: {
        totalDetections: { type: Number, default: 0 },
        totalViolations: { type: Number, default: 0 },
        avgConfidence: { type: Number, default: 0 },
        lastDetection: Date
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret.password; // Don't expose password in JSON
            return ret;
        }
    }
});

// Indexes
cameraSchema.index({ location: 'text' });
cameraSchema.index({ latitude: 1, longitude: 1 });
cameraSchema.index({ status: 1, lastHeartbeat: -1 });

// Pre-save middleware
cameraSchema.pre('save', function(next) {
    if (this.isModified('lastHeartbeat') && this.lastHeartbeat) {
        // Update uptime when heartbeat is received
        if (this.statistics.lastDetection) {
            const timeDiff = this.lastHeartbeat - this.statistics.lastDetection;
            this.uptime += timeDiff / (1000 * 60 * 60); // Convert to hours
        }
    }
    next();
});

// Static methods
cameraSchema.statics.findActive = function() {
    return this.find({ status: 'active' });
};

cameraSchema.statics.findByLocation = function(latitude, longitude, radiusKm = 1) {
    // Find cameras within specified radius
    return this.find({
        latitude: { $gte: latitude - radiusKm/111, $lte: latitude + radiusKm/111 },
        longitude: { $gte: longitude - radiusKm/(111 * Math.cos(latitude * Math.PI / 180)), 
                    $lte: longitude + radiusKm/(111 * Math.cos(latitude * Math.PI / 180)) },
        status: 'active'
    });
};

cameraSchema.statics.getOfflineCameras = function(hours = 1) {
    const threshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.find({
        status: 'active',
        $or: [
            { lastHeartbeat: { $lt: threshold } },
            { lastHeartbeat: null }
        ]
    });
};

// Instance methods
cameraSchema.methods.updateHeartbeat = function() {
    this.lastHeartbeat = new Date();
    return this.save();
};

cameraSchema.methods.updateStatistics = function(detections, violations, avgConfidence) {
    this.statistics.totalDetections += detections;
    this.statistics.totalViolations += violations;
    this.statistics.avgConfidence = avgConfidence;
    this.statistics.lastDetection = new Date();
    return this.save();
};

cameraSchema.methods.addDetectionZone = function(zoneName, coordinates) {
    this.detectionZones.push({
        name: zoneName,
        coordinates: coordinates,
        isActive: true
    });
    return this.save();
};

cameraSchema.methods.toggleDetectionZone = function(zoneName, isActive) {
    const zone = this.detectionZones.find(z => z.name === zoneName);
    if (zone) {
        zone.isActive = isActive;
        return this.save();
    }
    throw new Error(`Detection zone '${zoneName}' not found`);
};

// Virtual for camera health status
cameraSchema.virtual('isHealthy').get(function() {
    if (!this.lastHeartbeat) return false;
    const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat.getTime();
    return timeSinceLastHeartbeat < 5 * 60 * 1000; // Consider healthy if heartbeat within 5 minutes
});

const Camera = mongoose.model('Camera', cameraSchema);
module.exports = Camera;
