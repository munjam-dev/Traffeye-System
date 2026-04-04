const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createRepoAndPush() {
    console.log('🚀 Create Repository and Push');
    console.log('=============================\n');

    console.log('📋 Checking if repository exists...');
    
    try {
        // Try to check if repository exists
        execSync('git ls-remote https://github.com/Soujanya-20-create/TraffEye-System.git', { stdio: 'pipe' });
        console.log('✅ Repository exists');
        
        // If exists, try to push with different method
        await tryDifferentPushMethods();
        
    } catch (error) {
        console.log('❌ Repository does not exist or no access');
        console.log('\n🔧 Options:');
        console.log('1. Create repository manually at github.com');
        console.log('2. Use GitHub CLI to create and push');
        console.log('3. Use GitHub Desktop');
        
        const option = await askQuestion('\nChoose option (1/2/3): ');
        
        switch (option) {
            case '1':
                await manualCreateInstructions();
                break;
            case '2':
                await tryGitHubCLI();
                break;
            case '3':
                await gitDesktopInstructions();
                break;
        }
    }

    rl.close();
}

async function tryDifferentPushMethods() {
    console.log('\n🔧 Trying different push methods...');
    
    const methods = [
        'Try with HTTPS (current)',
        'Try with SSH',
        'Try with different token format'
    ];
    
    methods.forEach((method, index) => {
        console.log(`${index + 1}. ${method}`);
    });
    
    const choice = await askQuestion('\nChoose method (1/2/3): ');
    
    switch (choice) {
        case '1':
            await tryHTTPS();
            break;
        case '2':
            await trySSH();
            break;
        case '3':
            await tryDifferentToken();
            break;
    }
}

async function tryHTTPS() {
    console.log('\n🔗 Trying HTTPS push...');
    try {
        execSync('git push -u origin main', { stdio: 'inherit' });
        console.log('✅ Push successful!');
    } catch (error) {
        console.log('❌ HTTPS push failed');
    }
}

async function trySSH() {
    console.log('\n🔑 Trying SSH push...');
    try {
        execSync('git remote set-url origin git@github.com:Soujanya-20-create/TraffEye-System.git', { stdio: 'inherit' });
        execSync('git push -u origin main', { stdio: 'inherit' });
        console.log('✅ SSH push successful!');
    } catch (error) {
        console.log('❌ SSH push failed');
        console.log('💡 Make sure you have SSH keys set up in GitHub');
    }
}

async function tryDifferentToken() {
    console.log('\n🔧 Trying different token format...');
    const token = await askQuestion('Enter your Personal Access Token: ');
    
    if (token) {
        try {
            const repoUrl = `https://Soujanya-20-create:${token}@github.com/Soujanya-20-create/TraffEye-System.git`;
            execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'inherit' });
            execSync('git push -u origin main', { stdio: 'inherit' });
            console.log('✅ Token push successful!');
        } catch (error) {
            console.log('❌ Token push failed');
        }
    }
}

async function manualCreateInstructions() {
    console.log('\n📋 Manual Repository Creation:');
    console.log('1. Go to https://github.com/new');
    console.log('2. Repository name: TraffEye-System');
    console.log('3. Public repository');
    console.log('4. ❌ DO NOT initialize with README');
    console.log('5. Click "Create repository"');
    console.log('6. Then run: git push -u origin main');
}

async function tryGitHubCLI() {
    console.log('\n🔧 GitHub CLI Method:');
    console.log('1. Open Command Prompt as Administrator');
    console.log('2. Run: gh auth login');
    console.log('3. Run: gh repo create TraffEye-System --public --push');
}

async function gitDesktopInstructions() {
    console.log('\n🖥️ GitHub Desktop Method:');
    console.log('1. Download GitHub Desktop from https://desktop.github.com/');
    console.log('2. File → Add Local Repository');
    console.log('3. Select: C:\\Users\\PC\\CascadeProjects\\TraffEye-System');
    console.log('4. Repository name: TraffEye-System');
    console.log('5. Click "Publish repository"');
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

createRepoAndPush().catch(console.error);
