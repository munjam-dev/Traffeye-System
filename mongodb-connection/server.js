require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const { User, Violation, Camera } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🚦 TraffEye MongoDB API Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            users: '/api/users',
            violations: '/api/violations',
            cameras: '/api/cameras',
            stats: '/api/stats'
        }
    });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbHealth = await database.healthCheck();
        const connectionStatus = database.getConnectionStatus();
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbHealth,
            connection: connectionStatus,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Database statistics
app.get('/api/stats', async (req, res) => {
    try {
        const dbStats = await database.getDatabaseStats();
        const userCount = await User.countDocuments();
        const violationCount = await Violation.countDocuments();
        const cameraCount = await Camera.countDocuments();
        
        res.json({
            database: dbStats,
            collections: {
                users: userCount,
                violations: violationCount,
                cameras: cameraCount
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Failed to fetch statistics'
        });
    }
});

// User routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(50);
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Violation routes
app.get('/api/violations', async (req, res) => {
    try {
        const { status, vehicleNumber, startDate, endDate, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (status) query.status = status;
        if (vehicleNumber) query.vehicleNumber = vehicleNumber.toUpperCase();
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const violations = await Violation.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('reviewedBy', 'name email');
            
        const total = await Violation.countDocuments(query);
        
        res.json({
            success: true,
            count: violations.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            data: violations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/violations', async (req, res) => {
    try {
        const violation = new Violation(req.body);
        await violation.save();
        res.status(201).json({
            success: true,
            message: 'Violation recorded successfully',
            data: violation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/violations/statistics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const stats = await Violation.getStatistics(
            startDate ? new Date(startDate) : null,
            endDate ? new Date(endDate) : null
        );
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Camera routes
app.get('/api/cameras', async (req, res) => {
    try {
        const { status, location } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (location) query.location = new RegExp(location, 'i');
        
        const cameras = await Camera.find(query).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: cameras.length,
            data: cameras
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/cameras', async (req, res) => {
    try {
        const camera = new Camera(req.body);
        await camera.save();
        res.status(201).json({
            success: true,
            message: 'Camera added successfully',
            data: camera
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Camera ID already exists'
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

app.get('/api/cameras/offline', async (req, res) => {
    try {
        const { hours = 1 } = req.query;
        const offlineCameras = await Camera.getOfflineCameras(parseInt(hours));
        
        res.json({
            success: true,
            count: offlineCameras.length,
            data: offlineCameras
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Start server
async function startServer() {
    try {
        // Connect to database first
        await database.connect();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 TraffEye API Server running on port ${PORT}`);
            console.log(`🌐 Server URL: http://localhost:${PORT}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
            console.log(`📖 API Documentation: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    await database.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    await database.disconnect();
    process.exit(0);
});

// Start the server
startServer();
