#!/usr/bin/env node

/**
 * TraffEye Frontend Setup Script
 * Automatically installs dependencies and creates environment files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed successfully`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

function checkNodeVersion() {
    console.log("📦 Checking Node.js version...");
    try {
        const version = process.version;
        const majorVersion = parseInt(version.slice(1).split('.')[0]);
        
        if (majorVersion < 18) {
            console.log("❌ Node.js 18+ is required");
            console.log(`Current version: ${version}`);
            return false;
        }
        
        console.log(`✅ Node.js ${version} detected`);
        return true;
    } catch (error) {
        console.error("❌ Failed to check Node.js version");
        return false;
    }
}

function createEnvFile() {
    console.log("\n📝 Creating environment file...");
    
    if (!fs.existsSync('.env.local')) {
        if (fs.existsSync('.env.example')) {
            fs.copyFileSync('.env.example', '.env.local');
            console.log("✅ .env.local file created from example");
            console.log("⚠️  Please edit .env.local file with your configuration");
        } else {
            console.log("❌ .env.example file not found");
            return false;
        }
    } else {
        console.log("✅ .env.local file already exists");
    }
    
    return true;
}

function checkPackageJson() {
    console.log("\n📦 Checking package.json...");
    
    if (!fs.existsSync('package.json')) {
        console.log("❌ package.json not found");
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log(`✅ package.json found (${packageJson.name} v${packageJson.version})`);
        return true;
    } catch (error) {
        console.error("❌ Failed to parse package.json");
        return false;
    }
}

function installDependencies() {
    return runCommand("npm install", "Installing Node.js dependencies");
}

function testBuild() {
    return runCommand("npm run build", "Testing build process");
}

function createDirectories() {
    console.log("\n📁 Creating necessary directories...");
    
    const directories = [
        'components/ui',
        'hooks',
        'lib',
        'app',
        'public'
    ];
    
    directories.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        } else {
            console.log(`✅ Directory exists: ${dir}`);
        }
    });
    
    return true;
}

function main() {
    console.log("🌐 TraffEye Frontend Setup");
    console.log("=".repeat(50));
    
    // Check Node.js version
    if (!checkNodeVersion()) {
        process.exit(1);
    }
    
    // Check package.json
    if (!checkPackageJson()) {
        process.exit(1);
    }
    
    // Create directories
    if (!createDirectories()) {
        process.exit(1);
    }
    
    // Install dependencies
    if (!installDependencies()) {
        console.log("❌ Failed to install dependencies");
        process.exit(1);
    }
    
    // Create environment file
    if (!createEnvFile()) {
        process.exit(1);
    }
    
    // Test build (optional)
    console.log("\n🧪 Testing build process...");
    const buildSuccess = testBuild();
    if (!buildSuccess) {
        console.log("⚠️  Build test failed, but setup may still work");
    }
    
    console.log("\n🎉 TraffEye Frontend setup completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Edit .env.local file with your configuration");
    console.log("2. Make sure backend is running on http://localhost:8000");
    console.log("3. Run: npm run dev");
    console.log("4. Visit: http://localhost:3000");
}

if (require.main === module) {
    main();
}

module.exports = { main };
