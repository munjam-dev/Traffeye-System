const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function verifyCluster() {
    console.log('🔍 MongoDB Atlas Cluster Verification');
    console.log('=====================================\n');

    console.log('📋 Please check the following in MongoDB Atlas:');
    console.log('1. Go to: https://cloud.mongodb.com');
    console.log('2. Navigate to "Database Access"');
    console.log('3. Find your database user (should be "traffeye")');
    console.log('4. Navigate to "Clusters"');
    console.log('5. Click on your cluster');
    console.log('6. Click "Connect" → "Connect your application"\n');

    console.log('🔧 Required Information:');
    console.log('   - Cluster Name: Should be "traffeye"');
    console.log('   - Username: Should be "traffeye"');
    console.log('   - Password: Your database password');
    console.log('   - Driver: MongoDB Node.js Driver');
    console.log('   - Version: 4.1 or later\n');

    console.log('📋 Connection String Format:');
    console.log('   mongodb+srv://<username>:<password>@<cluster-name>.<mongodb-host>/');
    console.log('   Example: mongodb+srv://traffeye:password123@traffeye.abcde.mongodb.net/\n');

    console.log('🚨 Common Issues:');
    console.log('   1. Cluster URL is wrong');
    console.log('   2. Cluster is not active/running');
    console.log('   3. User doesn\'t have access to the cluster');
    console.log('   4. IP address not whitelisted');
    console.log('   5. Password contains special characters\n');

    const clusterUrl = await askQuestion('Enter your exact cluster URL from MongoDB Atlas: ');
    
    if (clusterUrl) {
        console.log('\n📝 Updating .env file with new cluster URL...');
        
        // Read current .env
        let envContent = fs.readFileSync('.env', 'utf8');
        
        // Extract username and password from current URI
        const currentMatch = envContent.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
        
        if (currentMatch) {
            const username = currentMatch[1];
            const password = currentMatch[2];
            
            // Create new URI with correct cluster URL
            const newURI = `mongodb+srv://${username}:${password}@${clusterUrl}/?appName=Traffeye`;
            
            // Update .env file
            envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${newURI}`);
            fs.writeFileSync('.env', envContent);
            
            console.log('✅ .env file updated!');
            console.log(`📍 New URI: mongodb+srv://${username}:***@${clusterUrl}/?appName=Traffeye`);
            console.log('\n🚀 Now test with: npm test');
        } else {
            console.log('❌ Could not parse current URI format');
        }
    }

    rl.close();
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

verifyCluster().catch(console.error);
