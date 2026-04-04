require('dotenv').config();
const database = require('./config/database');

async function testConnection() {
    console.log('🧪 Testing MongoDB Connection...\n');
    
    try {
        // Test connection
        await database.connect();
        
        // Test health check
        console.log('📊 Performing health check...');
        const health = await database.healthCheck();
        console.log('Health Status:', health);
        
        // Test database stats
        console.log('\n📈 Getting database statistics...');
        const stats = await database.getDatabaseStats();
        if (stats) {
            console.log('Database Stats:', JSON.stringify(stats, null, 2));
        }
        
        // Test connection status
        console.log('\n🔍 Connection status...');
        const status = database.getConnectionStatus();
        console.log('Connection Status:', status);
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        // Disconnect
        await database.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run test
testConnection();
