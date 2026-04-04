const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function pushToGitHub() {
    console.log('🚀 Push TraffEye to GitHub');
    console.log('=============================\n');

    console.log('📋 Instructions:');
    console.log('1. Go to https://github.com');
    console.log('2. Click "New repository"');
    console.log('3. Enter repository name: "TraffEye-System"');
    console.log('4. Make it Public');
    console.log('5. DO NOT initialize with README (we already have one)');
    console.log('6. Click "Create repository"');
    console.log('7. Copy the repository URL\n');

    const repoUrl = await askQuestion('Enter your GitHub repository URL (e.g., https://github.com/username/TraffEye-System.git): ');

    if (repoUrl) {
        try {
            console.log('\n🔗 Adding remote origin...');
            execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });

            console.log('📦 Pushing to GitHub...');
            execSync('git branch -M main', { stdio: 'inherit' });
            execSync('git push -u origin main', { stdio: 'inherit' });

            console.log('\n✅ Successfully pushed to GitHub!');
            console.log(`🌐 Repository: ${repoUrl}`);
            console.log('\n🎯 Your TraffEye system is now on GitHub!');
            console.log('📖 You can now share this with others or deploy from GitHub.');

        } catch (error) {
            console.error('❌ Error pushing to GitHub:', error.message);
            console.log('\n💡 Troubleshooting:');
            console.log('   - Make sure the repository URL is correct');
            console.log('   - Check if you have GitHub authentication set up');
            console.log('   - Verify you have push permissions to the repository');
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

pushToGitHub().catch(console.error);
