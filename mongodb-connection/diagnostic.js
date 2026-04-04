const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

async function runDiagnostics() {
    console.log('🔍 MongoDB Atlas Connection Diagnostics');
    console.log('==========================================\n');

    const mongoURI = process.env.MONGODB_URI;
    console.log('📍 Connection String:', mongoURI.replace(/:([^@]+)@/, ':***@'));

    // Extract cluster info
    const clusterMatch = mongoURI.match(/@([^/]+)/);
    if (clusterMatch) {
        const clusterHost = clusterMatch[1];
        console.log('🌐 Cluster Host:', clusterHost);

        // Test DNS resolution
        console.log('\n🔍 Testing DNS resolution...');
        try {
            const addresses = await dns.promises.resolve4(clusterHost);
            console.log('✅ DNS resolution successful:');
            addresses.forEach(addr => console.log(`   - ${addr.address}`));
        } catch (error) {
            console.log('❌ DNS resolution failed:', error.message);
            console.log('💡 Possible solutions:');
            console.log('   - Check cluster URL in MongoDB Atlas');
            console.log('   - Verify network connectivity');
            console.log('   - Check if cluster is active');
            return;
        }

        // Test MongoDB connection
        console.log('\n🔍 Testing MongoDB connection...');
        try {
            await mongoose.connect(mongoURI, {
                maxPoolSize: 1,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 10000
            });
            
            console.log('✅ MongoDB connection successful!');
            console.log('🎯 Database:', mongoose.connection.name);
            console.log('🌐 Host:', mongoose.connection.host);
            
            // Test database operations
            console.log('\n🔍 Testing database operations...');
            const admin = mongoose.connection.db.admin();
            const result = await admin.ping();
            console.log('✅ Ping successful:', result);

            // List collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('📁 Collections found:', collections.length);
            collections.forEach(col => console.log(`   - ${col.name}`));

        } catch (error) {
            console.log('❌ MongoDB connection failed:', error.message);
            
            if (error.message.includes('Authentication failed')) {
                console.log('💡 Authentication issue:');
                console.log('   - Check username and password');
                console.log('   - Verify user has database access');
                console.log('   - Check IP whitelist in Atlas');
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
                console.log('💡 Network issue:');
                console.log('   - Verify cluster URL is correct');
                console.log('   - Check firewall settings');
                console.log('   - Ensure cluster is running');
            }
        } finally {
            if (mongoose.connection.readyState === 1) {
                await mongoose.disconnect();
                console.log('\n🔌 Disconnected from MongoDB');
            }
        }
    } else {
        console.log('❌ Invalid MongoDB URI format');
    }
}

runDiagnostics().catch(console.error);
