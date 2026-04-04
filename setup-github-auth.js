const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setupGitHubAuth() {
    console.log('🔐 GitHub Authentication Setup');
    console.log('===============================\n');

    console.log('📋 Current Git Configuration:');
    try {
        const currentName = execSync('git config user.name', { encoding: 'utf8' }).trim();
        const currentEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
        console.log(`   Name: ${currentName}`);
        console.log(`   Email: ${currentEmail}\n`);
    } catch (error) {
        console.log('   No Git configuration found\n');
    }

    console.log('🔧 Options for GitHub Authentication:');
    console.log('1. Personal Access Token (Recommended)');
    console.log('2. SSH Key Setup');
    console.log('3. GitHub CLI (gh)');

    const option = await askQuestion('\nChoose authentication method (1/2/3): ');

    switch (option) {
        case '1':
            await setupPersonalAccessToken();
            break;
        case '2':
            await setupSSHKey();
            break;
        case '3':
            await setupGitHubCLI();
            break;
        default:
            console.log('❌ Invalid option. Please try again.');
    }

    rl.close();
}

async function setupPersonalAccessToken() {
    console.log('\n🔑 Personal Access Token Setup');
    console.log('================================\n');

    console.log('📋 Steps:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Give it a name (e.g., "TraffEye-Dev")');
    console.log('4. Select scopes: repo, workflow');
    console.log('5. Click "Generate token"');
    console.log('6. Copy the token (it won\'t show again)\n');

    const token = await askQuestion('Enter your Personal Access Token: ');
    const username = await askQuestion('Enter your GitHub username: ');

    if (token && username) {
        try {
            // Update remote URL with token
            const repoUrl = `https://${username}:${token}@github.com/${username}/TraffEye-System.git`;
            execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'inherit' });

            // Configure git user
            const name = await askQuestion('Enter your name for Git commits: ');
            const email = await askQuestion('Enter your email for Git commits: ');

            if (name && email) {
                execSync(`git config user.name "${name}"`, { stdio: 'inherit' });
                execSync(`git config user.email "${email}"`, { stdio: 'inherit' });
            }

            console.log('\n✅ Authentication setup complete!');
            console.log('🚀 Now you can push to GitHub');

        } catch (error) {
            console.error('❌ Error setting up authentication:', error.message);
        }
    }
}

async function setupSSHKey() {
    console.log('\n🔑 SSH Key Setup');
    console.log('==============\n');

    console.log('📋 Steps:');
    console.log('1. Check if you have an SSH key: ls ~/.ssh/id_rsa.pub');
    console.log('2. If not, generate one: ssh-keygen -t rsa -b 4096 -C "your_email@example.com"');
    console.log('3. Add SSH key to ssh-agent: eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_rsa');
    console.log('4. Copy public key: cat ~/.ssh/id_rsa.pub');
    console.log('5. Go to GitHub Settings > SSH and GPG keys');
    console.log('6. Click "New SSH key" and paste the key\n');

    console.log('💡 After setting up SSH, use this URL:');
    console.log('   git@github.com:username/TraffEye-System.git');
}

async function setupGitHubCLI() {
    console.log('\n🔧 GitHub CLI Setup');
    console.log('==================\n');

    console.log('📋 Steps:');
    console.log('1. Install GitHub CLI: https://cli.github.com/');
    console.log('2. Authenticate: gh auth login');
    console.log('3. Follow the prompts\n');

    console.log('💡 After setup, you can push with: gh repo create TraffEye-System --public --push');
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

setupGitHubAuth().catch(console.error);
