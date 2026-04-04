const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setupMongoDB() {
    console.log('🚦 TraffEye MongoDB Atlas Setup');
    console.log('=====================================\n');

    console.log('📋 Please provide your MongoDB Atlas credentials:');
    console.log('   - Go to MongoDB Atlas: https://cloud.mongodb.com');
    console.log('   - Navigate to Database Access');
    console.log('   - Find your user or create a new one\n');

    const username = await askQuestion('Enter MongoDB username (default: traffeye): ') || 'traffeye';
    const password = await askQuestion('Enter MongoDB password: ');
    const clusterUrl = await askQuestion('Enter cluster URL (default: traffeye.iruffvt.mongodb.net): ') || 'traffeye.iruffvt.mongodb.net';
    const dbName = await askQuestion('Enter database name (default: traffeye): ') || 'traffeye';

    // Create MongoDB connection string
    const mongoURI = `mongodb+srv://${username}:${password}@${clusterUrl}/?appName=Traffeye`;

    // Update .env file
    const envContent = `# MongoDB Configuration
MONGODB_URI=${mongoURI}
MONGODB_DB_NAME=${dbName}

# Server Configuration
PORT=3001
NODE_ENV=development

# Connection Options
MONGODB_OPTIONS=retryWrites=true&w=majority
`;

    fs.writeFileSync('.env', envContent);
    fs.writeFileSync('.env.example', envContent);

    console.log('\n✅ Configuration updated successfully!');
    console.log(`📁 .env file created with MongoDB URI: ${mongoURI.replace(password, '***')}`);
    console.log('\n🚀 Now you can test the connection with: npm test');
    console.log('🌐 Or start the server with: npm start');

    rl.close();
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

setupMongoDB().catch(console.error);
