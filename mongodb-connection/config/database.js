const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConnection {
    constructor() {
        this.mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
        this.dbName = process.env.MONGODB_DB_NAME || 'traffeye';
        this.options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            retryWrites: true,
            writeConcern: {
                w: 'majority'
            }
        };
    }

    /**
     * Connect to MongoDB database
     */
    async connect() {
        try {
            console.log('🔄 Connecting to MongoDB...');
            console.log(`📍 URI: ${this.mongoURI}`);
            console.log(`🗄️  Database: ${this.dbName}`);

            const connection = await mongoose.connect(this.mongoURI, {
                ...this.options,
                dbName: this.dbName
            });

            console.log('✅ MongoDB connected successfully!');
            console.log(`🎯 Connected to database: ${connection.connection.name}`);
            console.log(`🌐 Host: ${connection.connection.host}`);
            console.log(`📡 Port: ${connection.connection.port}`);

            // Set up connection event listeners
            this.setupEventListeners();

            return connection;
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            console.error('🔧 Troubleshooting tips:');
            console.error('   1. Make sure MongoDB is running: mongod');
            console.error('   2. Check if MongoDB is installed: mongod --version');
            console.error('   3. Verify connection string in .env file');
            console.error('   4. Check if port 27017 is accessible');
            
            process.exit(1);
        }
    }

    /**
     * Disconnect from MongoDB database
     */
    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('✅ MongoDB disconnected successfully');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error.message);
        }
    }

    /**
     * Setup MongoDB event listeners
     */
    setupEventListeners() {
        const db = mongoose.connection;

        // Connection events
        db.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
        });

        db.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        db.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected from MongoDB');
        });

        // Process termination events
        process.on('SIGINT', async () => {
            console.log('\n🛑 Received SIGINT. Closing MongoDB connection...');
            await this.disconnect();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n🛑 Received SIGTERM. Closing MongoDB connection...');
            await this.disconnect();
            process.exit(0);
        });
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        return {
            state: states[mongoose.connection.readyState],
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
        };
    }

    /**
     * Health check for database connection
     */
    async healthCheck() {
        try {
            const state = this.getConnectionStatus();
            
            if (state.state !== 'connected') {
                return {
                    status: 'unhealthy',
                    message: 'Database not connected',
                    details: state
                };
            }

            // Try to execute a simple command to test connection
            await mongoose.connection.db.admin().ping();
            
            return {
                status: 'healthy',
                message: 'Database connection is working',
                details: state
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                message: 'Database health check failed',
                error: error.message,
                details: this.getConnectionStatus()
            };
        }
    }

    /**
     * Get database statistics
     */
    async getDatabaseStats() {
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected');
            }

            const stats = await mongoose.connection.db.stats();
            const collections = await mongoose.connection.db.listCollections().toArray();
            
            return {
                database: stats,
                collections: collections.map(col => col.name),
                collectionCount: collections.length
            };
        } catch (error) {
            console.error('❌ Error getting database stats:', error.message);
            return null;
        }
    }
}

// Create and export singleton instance
const database = new DatabaseConnection();
module.exports = database;
