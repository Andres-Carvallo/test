const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Auto-Setup Script for PixelUp Clients
 * 
 * This script automatically runs component generation when:
 * 1. Repository is first cloned/deployed
 * 2. .env.local doesn't exist or is incomplete
 * 3. PIXELUP_AUTO_SETUP environment variable is true
 * 
 * Usage:
 * - Set PIXELUP_CLIENT_NAME in environment
 * - Set PIXELUP_AUTO_SETUP=true
 * - Run: node scripts/auto-setup.js
 * - Or add to package.json build script
 */

console.log("🔍 PixelUp Auto-Setup: Checking if setup is needed...");

// Configuration
const CLIENT_NAME = process.env.PIXELUP_CLIENT_NAME || process.env.CLIENT_NAME;
const AUTO_SETUP = process.env.PIXELUP_AUTO_SETUP === 'true';
const FORCE_SETUP = process.env.PIXELUP_FORCE_SETUP === 'true';

// Files to check for existing setup
const ENV_FILE = '.env.local';
const SETUP_MARKER = '.pixelup-setup-complete';

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

// Check if setup is needed
function isSetupNeeded() {
  // Force setup if requested
  if (FORCE_SETUP) {
    logInfo("Force setup requested");
    return true;
  }
  
  // Check if auto-setup is enabled
  if (!AUTO_SETUP) {
    logInfo("Auto-setup is disabled (PIXELUP_AUTO_SETUP not true)");
    return false;
  }
  
  // Check if client name is provided
  if (!CLIENT_NAME) {
    logWarning("No client name provided (PIXELUP_CLIENT_NAME or CLIENT_NAME)");
    return false;
  }
  
  // Check if setup marker exists
  if (fs.existsSync(SETUP_MARKER)) {
    logInfo("Setup already completed (marker file exists)");
    return false;
  }
  
  // Check if environment file exists and has SITEID
  if (fs.existsSync(ENV_FILE)) {
    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_API_URL_SITEID=') && 
        !envContent.includes('NEXT_PUBLIC_API_URL_SITEID=undefined') &&
        !envContent.includes('NEXT_PUBLIC_API_URL_SITEID=')) {
      logInfo("Environment file exists with valid SITEID");
      return false;
    }
  }
  
  logInfo("Setup is needed - proceeding with auto-generation");
  return true;
}

// Validate client name format
function validateClientName(name) {
  if (!name) return false;
  if (!/^[a-z0-9-]+$/.test(name)) {
    logError(`Invalid client name format: ${name}`);
    logError("Client name must contain only lowercase letters, numbers, and hyphens");
    return false;
  }
  return true;
}

// Create basic environment file if it doesn't exist
function createBasicEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    logInfo("Creating basic environment file...");
    
    const basicEnv = `# PixelUp Auto-Setup Environment
# Client: ${CLIENT_NAME}
# Generated: ${new Date().toISOString()}

NEXT_PUBLIC_API_URL_BO_CLIENTE=https://pixelup-customer-backoffice-api-git-de-80bd27-pixelups-projects.vercel.app
NEXT_PUBLIC_API_URL_CLIENTE=https://pixelup-ecommerce-api-git-development-pixelups-projects.vercel.app
NEXT_PUBLIC_BASE_URL=https://${CLIENT_NAME}.vercel.app
PIXELUP_CLIENT_NAME=${CLIENT_NAME}
PIXELUP_AUTO_SETUP=true
`;
    
    fs.writeFileSync(ENV_FILE, basicEnv);
    logSuccess("Basic environment file created");
  }
}

// Run the onboarding process
async function runOnboarding() {
  try {
    logInfo(`Starting automated onboarding for: ${CLIENT_NAME}`);
    
    // Ensure onboard script exists
    const onboardScript = 'scripts/onboard.js';
    if (!fs.existsSync(onboardScript)) {
      logError(`Onboard script not found: ${onboardScript}`);
      return false;
    }
    
    // Run the onboarding script
    logInfo("Running onboarding script...");
    execSync(`node ${onboardScript} ${CLIENT_NAME}`, { 
      stdio: 'inherit',
      env: { ...process.env, PIXELUP_AUTO_MODE: 'true' }
    });
    
    // Create setup completion marker
    fs.writeFileSync(SETUP_MARKER, JSON.stringify({
      clientName: CLIENT_NAME,
      setupDate: new Date().toISOString(),
      autoSetup: true
    }, null, 2));
    
    logSuccess("Auto-setup completed successfully!");
    logSuccess(`Site should be available at: https://${CLIENT_NAME}.vercel.app`);
    
    return true;
    
  } catch (error) {
    logError(`Auto-setup failed: ${error.message}`);
    return false;
  }
}

// Fallback: Create minimal environment for manual setup
function createFallbackEnv() {
  logWarning("Auto-setup failed or skipped - creating minimal environment");
  
  const fallbackEnv = `# PixelUp Environment - Manual Setup Required
# Client: ${CLIENT_NAME || 'undefined'}
# Generated: ${new Date().toISOString()}

NEXT_PUBLIC_API_URL_BO_CLIENTE=https://pixelup-customer-backoffice-api-git-de-80bd27-pixelups-projects.vercel.app
NEXT_PUBLIC_API_URL_CLIENTE=https://pixelup-ecommerce-api-git-development-pixelups-projects.vercel.app
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MANUAL SETUP REQUIRED
# Run: npm run onboard <client-name>
# Or use GitHub Actions workflow
`;
  
  if (!fs.existsSync(ENV_FILE)) {
    fs.writeFileSync(ENV_FILE, fallbackEnv);
    logInfo("Fallback environment file created");
  }
}

// Main execution
async function main() {
  console.log("🚀 PixelUp Auto-Setup Starting...");
  console.log(`Client Name: ${CLIENT_NAME || 'not provided'}`);
  console.log(`Auto Setup: ${AUTO_SETUP}`);
  console.log(`Force Setup: ${FORCE_SETUP}`);
  console.log("=" .repeat(50));
  
  // Validate setup requirements
  if (!isSetupNeeded()) {
    logInfo("Auto-setup not needed or not enabled");
    return;
  }
  
  // Validate client name
  if (!validateClientName(CLIENT_NAME)) {
    logError("Invalid or missing client name");
    createFallbackEnv();
    return;
  }
  
  // Create basic environment file
  createBasicEnvFile();
  
  // Run onboarding
  const success = await runOnboarding();
  
  if (!success) {
    createFallbackEnv();
    logError("Auto-setup failed - manual setup required");
    logInfo("Run: npm run onboard <client-name>");
  }
}

// Execute if called directly
if (require.main === module) {
  main().catch(error => {
    logError(`Auto-setup error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, isSetupNeeded, validateClientName };
