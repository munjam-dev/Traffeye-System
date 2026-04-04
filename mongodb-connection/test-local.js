const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testLocalConnection() {
    console.log('🔍 Testing Local MongoDB Connection');
    console.log('===================================\n');

    // Try local MongoDB first
    const localUri = 'mongodb://localhost:27017/traffeye';
    console.log('📍 Local Connection String:', localUri);

    const client = new MongoClient(localUri);

    try {
        console.log('🔄 Connecting to local MongoDB...');
        await client.connect();
        console.log('✅ Connected to local MongoDB successfully!');

        const database = client.db('traffeye');
        console.log('🗄️ Database:', database.databaseName);

        // Test database operations
        const collections = await database.listCollections().toArray();
        console.log('📁 Collections:', collections.length);
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Create test collections if they don't exist
        if (collections.length === 0) {
            console.log('\n📝 Creating initial collections...');
            
            // Create users collection
            await database.createCollection('users');
            console.log('✅ Created users collection');
            
            // Create violations collection
            await database.createCollection('violations');
            console.log('✅ Created violations collection');
            
            // Create cameras collection
            await database.createCollection('cameras');
            console.log('✅ Created cameras collection');
            
            // Insert sample data
            const usersCollection = database.collection('users');
            await usersCollection.insertOne({
                name: 'Demo User',
                email: 'demo@traffeye.com',
                vehicles: ['MH12AB1234'],
                role: 'user',
                createdAt: new Date()
            });
            console.log('✅ Inserted sample user');
            
            const violationsCollection = database.collection('violations');
            await violationsCollection.insertOne({
                vehicleNumber: 'MH12AB1234',
                violationType: 'no_helmet',
                date: new Date(),
                time: '14:30:25',
                location: 'Main Street & 5th Avenue',
                latitude: 19.0760,
                longitude: 72.8777,
                imageUrl: '/violations/sample.jpg',
                fineAmount: 500,
                status: 'unpaid',
                confidenceScore: 0.95,
                cameraId: 'CAM001'
            });
            console.log('✅ Inserted sample violation');
            
            const camerasCollection = database.collection('cameras');
            await camerasCollection.insertOne({
                cameraId: 'CAM001',
                location: 'Main Street & 5th Avenue',
                latitude: 19.0760,
                longitude: 72.8777,
                status: 'active',
                cameraType: 'traffic'
            });
            console.log('✅ Inserted sample camera');
        }

        console.log('\n✅ Local MongoDB setup complete!');

    } catch (error) {
        console.error('❌ Local MongoDB connection failed:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Local MongoDB is not running:');
            console.log('   - Install MongoDB: https://www.mongodb.com/try/download/community');
            console.log('   - Start MongoDB: mongod');
            console.log('   - Or use Docker: docker run -d -p 27017:27017 mongo');
        }
    } finally {
        await client.close();
        console.log('🔌 Connection closed');
    }
}

testLocalConnection().catch(console.error);
