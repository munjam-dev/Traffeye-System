const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function pushWithToken() {
    console.log('🔑 Push with Personal Access Token');
    console.log('================================\n');

    console.log('📋 Steps to get Personal Access Token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Name: "TraffEye-Push"');
    console.log('4. Scopes: repo, workflow');
    console.log('5. Click "Generate token"');
    console.log('6. Copy the token immediately (it won\'t show again)\n');

    const token = await askQuestion('Enter your Personal Access Token: ');

    if (token) {
        const repoUrl = `https://Soujanya-20-create:${token}@github.com/Soujanya-20-create/TraffEye-System.git`;
        
        console.log('\n🔗 Setting up authenticated remote...');
        const { execSync } = require('child_process');
        
        try {
            execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'inherit' });
            
            console.log('🚀 Pushing to GitHub...');
            execSync('git push -u origin main', { stdio: 'inherit' });
            
            console.log('\n✅ Successfully pushed to GitHub!');
            console.log('🌐 Repository: https://github.com/Soujanya-20-create/TraffEye-System');
            console.log('🎉 Your TraffEye system is now live on GitHub!');
            
        } catch (error) {
            console.error('❌ Error pushing:', error.message);
            
            if (error.message.includes('401')) {
                console.log('\n💡 Token Issues:');
                console.log('   - Token might be expired');
                console.log('   - Check if token has correct scopes');
                console.log('   - Generate a new token');
            } else if (error.message.includes('403')) {
                console.log('\n💡 Permission Issues:');
                console.log('   - Token might not have push permissions');
                console.log('   - Check repository access');
                console.log('   - Verify token scopes include "repo"');
            }
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

pushWithToken().catch(console.error);
