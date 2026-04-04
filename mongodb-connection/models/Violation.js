const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        match: /^[A-Z]{2}\s*[0-9]{1,2}\s*[A-Z]{1,3}\s*[0-9]{1,4}$/,
        index: true
    },
    violationType: {
        type: String,
        required: true,
        enum: ['no_helmet', 'triple_riding', 'signal_violation', 'overspeeding', 'wrong_parking'],
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
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
    imageUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: null
    },
    fineAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['unpaid', 'paid', 'disputed', 'cancelled'],
        default: 'unpaid',
        index: true
    },
    confidenceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    cameraId: {
        type: String,
        required: true,
        ref: 'Camera',
        index: true
    },
    detectedBy: {
        type: String,
        required: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    },
    paymentId: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        maxlength: 500,
        default: ''
    },
    evidence: {
        boundingBoxes: [{
            x: Number,
            y: Number,
            width: Number,
            height: Number,
            label: String,
            confidence: Number
        }],
        metadata: {
            frameNumber: Number,
            timestamp: Number,
            weather: String,
            lighting: String
        }
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

// Compound indexes for better query performance
violationSchema.index({ vehicleNumber: 1, date: -1 });
violationSchema.index({ violationType: 1, status: 1 });
violationSchema.index({ date: -1, status: 1 });
violationSchema.index({ cameraId: 1, date: -1 });
violationSchema.index({ location: 'text', vehicleNumber: 'text' });

// Pre-save middleware
violationSchema.pre('save', function(next) {
    if (this.status === 'paid' && !this.paidAt) {
        this.paidAt = new Date();
    }
    if (this.reviewedBy && !this.reviewedAt) {
        this.reviewedAt = new Date();
    }
    next();
});

// Static methods
violationSchema.statics.findByVehicle = function(vehicleNumber) {
    return this.find({ vehicleNumber: vehicleNumber.toUpperCase() }).sort({ date: -1 });
};

violationSchema.statics.findByStatus = function(status) {
    return this.find({ status }).sort({ date: -1 });
};

violationSchema.statics.findByDateRange = function(startDate, endDate) {
    return this.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: -1 });
};

violationSchema.statics.getStatistics = function(startDate, endDate) {
    const matchStage = {};
    if (startDate && endDate) {
        matchStage.date = {
            $gte: startDate,
            $lte: endDate
        };
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalViolations: { $sum: 1 },
                unpaidViolations: {
                    $sum: { $cond: [{ $eq: ['$status', 'unpaid'] }, 1, 0] }
                },
                paidViolations: {
                    $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
                },
                totalFines: { $sum: '$fineAmount' },
                collectedFines: {
                    $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$fineAmount', 0] }
                },
                violationTypes: {
                    $push: '$violationType'
                }
            }
        },
        {
            $addFields: {
                violationTypeBreakdown: {
                    $reduce: {
                        input: '$violationTypes',
                        initialValue: {},
                        in: {
                            $mergeObjects: [
                                '$$value',
                                {
                                    $arrayToObject: [
                                        [{ k: '$$this', v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] } }]
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]);
};

// Instance methods
violationSchema.methods.markAsPaid = function(paymentId) {
    this.status = 'paid';
    this.paidAt = new Date();
    if (paymentId) {
        this.paymentId = paymentId;
    }
    return this.save();
};

violationSchema.methods.markAsReviewed = function(reviewerId) {
    this.reviewedBy = reviewerId;
    this.reviewedAt = new Date();
    return this.save();
};

const Violation = mongoose.model('Violation', violationSchema);
module.exports = Violation;
