#!/usr/bin/env node

/**
 * Deployment script for CodePractical Backend
 * 
 * This script helps with deploying the application to a traditional hosting environment.
 * It performs the following tasks:
 * 1. Builds the application
 * 2. Creates necessary directories
 * 3. Ensures environment variables are set
 * 
 * Usage: node scripts/deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  buildCommand: 'npm run build',
  startCommand: 'npm start',
  requiredDirs: ['uploads', 'uploads/aims', 'uploads/code'],
  envFile: '.env',
  envExampleFile: '.env.example',
};

// Helper functions
function executeCommand(command) {
  console.log(`Executing: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function ensureDirectoriesExist() {
  console.log('Ensuring required directories exist...');
  config.requiredDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  const envPath = path.join(process.cwd(), config.envFile);
  const envExamplePath = path.join(process.cwd(), config.envExampleFile);
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log(`Environment file ${config.envFile} not found. Creating from example...`);
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`Created ${config.envFile} from ${config.envExampleFile}. Please edit it with your configuration.`);
    return false;
  }
  
  return true;
}

// Main deployment function
async function deploy() {
  console.log('Starting deployment process...');
  
  // Check environment variables
  const envReady = checkEnvironmentVariables();
  if (!envReady) {
    console.log('Please configure your environment variables before continuing.');
    process.exit(1);
  }
  
  // Install dependencies
  console.log('Installing dependencies...');
  if (!executeCommand('npm install --production')) {
    process.exit(1);
  }
  
  // Build the application
  console.log('Building the application...');
  if (!executeCommand(config.buildCommand)) {
    process.exit(1);
  }
  
  // Ensure directories exist
  ensureDirectoriesExist();
  
  console.log('Deployment preparation complete!');
  console.log(`To start the application, run: ${config.startCommand}`);
  console.log('For production environments, consider using a process manager like PM2:');
  console.log('  npm install -g pm2');
  console.log('  pm2 start npm --name "codepractical-backend" -- start');
  console.log('  pm2 startup');
  console.log('  pm2 save');
}

// Run the deployment
deploy().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});