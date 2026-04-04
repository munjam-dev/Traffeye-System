const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testNativeConnection() {
    console.log('🔍 Testing Native MongoDB Connection');
    console.log('====================================\n');

    const uri = process.env.MONGODB_URI;
    console.log('📍 Connection String:', uri.replace(/:([^@]+)@/, ':***@'));

    const client = new MongoClient(uri);

    try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected successfully!');

        const database = client.db('traffeye');
        console.log('🗄️ Database:', database.databaseName);

        // Test database operations
        const collections = await database.listCollections().toArray();
        console.log('📁 Collections:', collections.length);
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Test ping
        const admin = database.admin();
        const pingResult = await admin.ping();
        console.log('🏓 Ping result:', pingResult);

        console.log('\n✅ All tests passed!');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 DNS/Network Issues:');
            console.log('   - Check if cluster URL is correct');
            console.log('   - Verify cluster is active in Atlas');
            console.log('   - Check network connectivity');
            console.log('   - Try different DNS servers');
        } else if (error.message.includes('Authentication')) {
            console.log('\n💡 Authentication Issues:');
            console.log('   - Verify username and password');
            console.log('   - Check user permissions');
            console.log('   - Ensure IP is whitelisted');
        }
    } finally {
        await client.close();
        console.log('🔌 Connection closed');
    }
}

testNativeConnection().catch(console.error);
