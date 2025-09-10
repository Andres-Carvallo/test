const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config({ path: ".env.local" });

// Import all initialization scripts
const { initHomeConfig } = require("./initHomeConfig");
const { initFooterConfig } = require("./initFooterConfig");
const { initContactFormConfig } = require("./initContactFormConfig");
const { initWhatsAppConfig } = require("./initWhatsAppConfig");
const { initAllMissingComponents } = require("./initAllMissingComponents");

// Configuration
const clientName = process.argv[2];
if (!clientName) {
  console.error("❌ Usage: node onboard.js <client-name>");
  console.error("   Example: node onboard.js cliente-ejemplo");
  process.exit(1);
}

// Validate client name format
if (!/^[a-z0-9-]+$/.test(clientName)) {
  console.error("❌ Client name must contain only lowercase letters, numbers, and hyphens");
  process.exit(1);
}

// Environment variables
const SITE_API_URL = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE + "/api/v1/sites";
const BANNERS_API_URL = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE + "/api/v1/banners";
const CONTENT_BLOCKS_API_URL = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE + "/api/v1/content-blocks";
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

// Storage for generated IDs
const generatedIds = {
  siteId: null,
  components: {}
};

console.log("🚀 Starting PixelUp Client Onboarding Automation");
console.log(`📝 Client Name: ${clientName}`);
console.log("=" .repeat(60));

// Utility functions
function generateId() {
  return `${clientName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function logSuccess(message, data = null) {
  console.log(`✅ ${message}`);
  if (data) console.log(`   ${data}`);
}

function logError(message, error = null) {
  console.error(`❌ ${message}`);
  if (error) console.error(`   ${error}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

// Phase 1: Pre-Setup Validation
async function validateSetup() {
  logInfo("Phase 1: Validating setup...");
  
  const requiredVars = [
    'NEXT_PUBLIC_API_URL_BO_CLIENTE',
    'NEXT_PUBLIC_API_URL_CLIENTE'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logError(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  // Test API connectivity
  try {
    await axios.get(process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE + "/api/v1/sites?pageNumber=1&pageSize=1");
    logSuccess("API connectivity verified");
  } catch (error) {
    logError("Failed to connect to API", error.message);
    process.exit(1);
  }
  
  logSuccess("Pre-setup validation completed");
}

// Phase 2: Site Creation
async function createSiteId() {
  logInfo("Phase 2: Creating site infrastructure...");
  
  try {
    const response = await axios.post(SITE_API_URL, {
      name: clientName,
      slug: clientName,
      description: `Automated site for ${clientName}`,
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_AUTH_TOKEN}`
      }
    });
    
    if (response.data.code === 0) {
      generatedIds.siteId = response.data.site.id;
      logSuccess(`Site created with ID: ${generatedIds.siteId}`);
      
      // Update environment variable for subsequent API calls
      process.env.NEXT_PUBLIC_API_URL_SITEID = generatedIds.siteId;
      
      return generatedIds.siteId;
    } else {
      throw new Error(response.data.message || 'Unknown error creating site');
    }
  } catch (error) {
    logError("Failed to create site", error.response?.data?.message || error.message);
    process.exit(1);
  }
}

// Phase 3: Component Generation
async function generateComponents() {
  logInfo("Phase 3: Generating components...");
  
  try {
    // Initialize core configurations
    logInfo("Initializing core configurations...");
    
    // Home Configuration
    await initHomeConfig();
    generatedIds.components.homeConfig = process.env.NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK || "home-config-default";
    
    // Footer Configuration
    await initFooterConfig();
    generatedIds.components.footerConfig = process.env.NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK || "footer-config-default";
    
    // Contact Form Configuration
    await initContactFormConfig();
    generatedIds.components.contactFormBanner = generateId();
    generatedIds.components.contactFormBannerImg = generateId();
    
    // WhatsApp Configuration
    await initWhatsAppConfig();
    generatedIds.components.whatsappConfig = "whatsapp-config-default";
    
    logSuccess("Core configurations initialized");
    
    // Generate principal banners
    await generatePrincipalBanners();
    
    // Generate category banners
    await generateCategoryBanners();
    
    // Generate hero sections
    await generateHeroSections();
    
    // Generate service sections
    await generateServiceSections();
    
    // Generate content blocks
    await generateContentBlocks();
    
    // Generate ALL missing components from migrateToEnums.js
    logInfo("Generating all missing components from migrateToEnums.js...");
    const missingComponentIds = await initAllMissingComponents();
    
    // Merge missing component IDs with existing ones
    Object.assign(generatedIds.components, missingComponentIds);
    
    logSuccess("All components generated successfully");
    logSuccess(`Total components generated: ${Object.keys(generatedIds.components).length}`);
    
  } catch (error) {
    logError("Failed to generate components", error.message);
    process.exit(1);
  }
}

async function generatePrincipalBanners() {
  logInfo("Generating principal banners...");
  
  const banners = [
    {
      key: 'bannerPrincipal01',
      title: 'Banner Principal 01',
      description: 'Main homepage banner'
    },
    {
      key: 'bannerPrincipal01Mobile',
      title: 'Banner Principal 01 Mobile',
      description: 'Mobile version of main banner'
    }
  ];
  
  for (const banner of banners) {
    // Create banner - let API generate the ID
    const response = await axios.post(`${BANNERS_API_URL}?siteId=${generatedIds.siteId}`, {
      title: banner.title,
      landingText: banner.description,
      buttonText: "Ver más",
      buttonLink: "/tienda",
      mainImage: {
        name: `${banner.key}-image.jpg`,
        type: "image/jpeg",
        size: 100,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      },
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 0) {
      // Capture the auto-generated IDs from API response
      const bannerId = response.data.banner?.id || response.data.id;
      const imageId = response.data.banner?.mainImage?.id || bannerId + '-img';
      
      generatedIds.components[banner.key] = bannerId;
      generatedIds.components[banner.key + 'Img'] = imageId;
      logSuccess(`${banner.title} created: ${bannerId}`);
    }
  }
}

async function generateCategoryBanners() {
  logInfo("Generating category banners...");
  
  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 
    'Books', 'Toys', 'Health & Beauty'
  ];
  
  for (let i = 1; i <= 7; i++) {
    const categoryName = categories[i - 1];
    
    const response = await axios.post(`${BANNERS_API_URL}?siteId=${generatedIds.siteId}`, {
      title: `Categoría ${i}: ${categoryName}`,
      landingText: `Explora nuestra colección de ${categoryName}`,
      buttonText: "Ver categoría",
      buttonLink: `/tienda/categoria-${i}`,
      mainImage: {
        name: `categoria-${i}.jpg`,
        type: "image/jpeg",
        size: 100,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      },
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 0) {
      // Capture auto-generated IDs
      const bannerId = response.data.banner?.id || response.data.id;
      const imageId = response.data.banner?.mainImage?.id || bannerId + '-img';
      
      generatedIds.components[`categoria${String(i).padStart(2, '0')}`] = bannerId;
      generatedIds.components[`categoria${String(i).padStart(2, '0')}Img`] = imageId;
      logSuccess(`Category ${i} banner created: ${bannerId}`);
    }
  }
}

async function generateHeroSections() {
  logInfo("Generating hero sections...");
  
  const heroes = [
    'Welcome Hero', 'Featured Products', 'Special Offers', 
    'About Us', 'Contact Hero'
  ];
  
  for (let i = 1; i <= 5; i++) {
    const heroName = heroes[i - 1];
    const bannerId = generateId();
    const imageId = generateId();
    
    const response = await axios.post(`${BANNERS_API_URL}?siteId=${generatedIds.siteId}`, {
      id: bannerId,
      title: `Hero ${i}: ${heroName}`,
      landingText: `${heroName} section content`,
      buttonText: "Explorar",
      buttonLink: "/",
      mainImage: {
        name: `hero-${i}.jpg`,
        type: "image/jpeg",
        size: 100,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      },
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 0) {
      generatedIds.components[`hero${String(i).padStart(2, '0')}`] = bannerId;
      generatedIds.components[`hero${String(i).padStart(2, '0')}Img`] = imageId;
      logSuccess(`Hero ${i} section created: ${bannerId}`);
    }
  }
}

async function generateServiceSections() {
  logInfo("Generating service sections...");
  
  const services = [
    { name: 'Envío Gratis', description: 'Envío gratuito en compras sobre $50.000' },
    { name: 'Soporte 24/7', description: 'Atención al cliente las 24 horas' }
  ];
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const bannerId = generateId();
    const imageId = generateId();
    
    const response = await axios.post(`${BANNERS_API_URL}?siteId=${generatedIds.siteId}`, {
      id: bannerId,
      title: service.name,
      landingText: service.description,
      buttonText: "Más información",
      buttonLink: "/servicios",
      mainImage: {
        name: `servicio-${i + 1}.jpg`,
        type: "image/jpeg",
        size: 100,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      },
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 0) {
      const serviceKey = i === 0 ? 'servicioUno' : 'servicioDos';
      generatedIds.components[serviceKey] = bannerId;
      generatedIds.components[serviceKey + 'Img'] = imageId;
      logSuccess(`${service.name} created: ${bannerId}`);
    }
  }
}

async function generateContentBlocks() {
  logInfo("Generating content blocks...");
  
  const contentBlocks = [
    {
      key: 'marqueeTop',
      title: 'Marquee Superior',
      content: { text: '🎉 ¡Ofertas especiales! Envío gratis en compras sobre $50.000', speed: 50 }
    },
    {
      key: 'colecciones02',
      title: 'Colecciones Destacadas',
      content: { collections: [], showAll: true }
    },
    {
      key: 'feedInstagram',
      title: 'Feed de Instagram',
      content: { hashtag: '#tienda', count: 6 }
    },
    {
      key: 'ubicacion',
      title: 'Ubicación',
      content: { 
        address: 'Dirección de la tienda',
        phone: '+56 9 XXXX XXXX',
        email: 'contacto@tienda.com'
      }
    }
  ];
  
  for (const block of contentBlocks) {
    const contentBlockId = generateId();
    
    const response = await axios.post(`${CONTENT_BLOCKS_API_URL}?siteId=${generatedIds.siteId}`, {
      id: contentBlockId,
      title: block.title,
      contentText: JSON.stringify(block.content, null, 2),
      type: block.key,
      isActive: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 0) {
      generatedIds.components[block.key] = contentBlockId;
      logSuccess(`${block.title} created: ${contentBlockId}`);
    }
  }
}

// Phase 4: Environment Configuration
async function generateEnvironmentFile() {
  logInfo("Phase 4: Generating environment configuration...");
  
  const envContent = `# Generated by PixelUp Automation on ${new Date().toISOString()}
# Client: ${clientName}

#---------------------------------------------------------------------------------------------------------------------------
#--------------------------------------------------------NO CAMBIAR---------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------
#API
NEXT_PUBLIC_API_URL_BO_CLIENTE=https://pixelup-customer-backoffice-api-git-de-80bd27-pixelups-projects.vercel.app
NEXT_PUBLIC_API_URL_CLIENTE=https://pixelup-ecommerce-api-git-development-pixelups-projects.vercel.app
NEXT_PUBLIC_BASE_URL=https://${clientName}.vercel.app
NEXT_PUBLIC_PIXELUP_URL=https://www.development.pixelup.cl/
NEXT_PUBLIC_INTERVAL_DURATION=10800000
NEXT_PUBLIC_CHECKOUT_URL=https://www.development.pixelup.cl/

#RECAPTCHA DESDE GOOGLE
NEXT_PUBLIC_SITE_KEY_PUBLIC=6Le-QQAqAAAAAJsmJ0MmyNIuMFQZW5HvJ7_KIAMc
RECAPTCHA_SITE_KEY=6LfRQAqAAAAAL-0YvhYOWgLiCBDD8N4_rImVLcD
RECAPTCHA_PUBLIC_SITE_KEY=6Le-QQAqAAAAAJsmJ0MmyNIuMFQZW5HvJ7_KIAMc

#---------------------------------------------------------------------------------------------------------------------------
#--------------------------------------------------------DEVELOPMENT--------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------

#SITEID CONFIG DESDE ADMIN.PIXELUP
NEXT_PUBLIC_API_URL_SITEID=${generatedIds.siteId}

#BODEGA INICIAL DE STARKEN (MANTENER SI ES QUE NO SE USA STARKEN)    
NEXT_PUBLIC_DEFAULT_COMMUNE_ID=08420

#CODIGO PARA MEDIR CON GOOGLE ANALYTICS
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-GENERATED-${clientName.toUpperCase()}

#---------------------------------------------------------------------------------------------------------------------------
#--------------------------------------------------------CONFIG-------------------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------

NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/56988888888
NEXT_PUBLIC_DIRECCION_TIENDA=
NEXT_PUBLIC_NOMBRE_TIENDA="${clientName.charAt(0).toUpperCase() + clientName.slice(1).replace(/-/g, ' ')}"
NEXT_PUBLIC_LOGO="/logo-${clientName}.png"
NEXT_PUBLIC_LOGO_COLOR=https://pixelup.cl/images/logo/2.png
NEXT_PUBLIC_LOGO_COLORMOBILE=https://pixelup.cl/images/logo/2.png
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/
NEXT_PUBLIC_FACEBOOK=
NEXT_PUBLIC_TWITTER=
NEXT_PUBLIC_TIKTOK=
NEXT_PUBLIC_COLOR_OFERTA=
NEXT_PUBLIC_MAILCHIMP_URL=
MAINTENANCE_MODE=false

#---------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------COMPONENTES GENERADOS--------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------

# Core Configuration
NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK=${generatedIds.components.homeConfig}
NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK=${generatedIds.components.footerConfig}
NEXT_PUBLIC_WHATSAPP_CONFIG_CONTENTBLOCK=${generatedIds.components.whatsappConfig}

# Contact Form Configuration
NEXT_PUBLIC_CONTACT_FORM_BANNER_ID=${generatedIds.components.contactFormBanner}
NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID=${generatedIds.components.contactFormBannerImg}

# Principal Banners
NEXT_PUBLIC_BANNERPRINCIPAL01_ID=${generatedIds.components.bannerPrincipal01}
NEXT_PUBLIC_BANNERPRINCIPAL01MOBILE_ID=${generatedIds.components.bannerPrincipal01Mobile}

# Category Banners
NEXT_PUBLIC_CATEGORIA01_ID=${generatedIds.components.categoria01}
NEXT_PUBLIC_CATEGORIA01_IMGID=${generatedIds.components.categoria01Img}
NEXT_PUBLIC_CATEGORIA02_ID=${generatedIds.components.categoria02}
NEXT_PUBLIC_CATEGORIA02_IMGID=${generatedIds.components.categoria02Img}
NEXT_PUBLIC_CATEGORIA03_ID=${generatedIds.components.categoria03}
NEXT_PUBLIC_CATEGORIA03_IMGID=${generatedIds.components.categoria03Img}
NEXT_PUBLIC_CATEGORIA04_ID=${generatedIds.components.categoria04}
NEXT_PUBLIC_CATEGORIA04_IMGID=${generatedIds.components.categoria04Img}
NEXT_PUBLIC_CATEGORIA05_ID=${generatedIds.components.categoria05}
NEXT_PUBLIC_CATEGORIA05_IMGID=${generatedIds.components.categoria05Img}
NEXT_PUBLIC_CATEGORIA06_ID=${generatedIds.components.categoria06}
NEXT_PUBLIC_CATEGORIA06_IMGID=${generatedIds.components.categoria06Img}
NEXT_PUBLIC_CATEGORIA07_ID=${generatedIds.components.categoria07}
NEXT_PUBLIC_CATEGORIA07_IMGID=${generatedIds.components.categoria07Img}

# Hero Sections
NEXT_PUBLIC_HERO01_ID=${generatedIds.components.hero01}
NEXT_PUBLIC_HERO01_IMGID=${generatedIds.components.hero01Img}
NEXT_PUBLIC_HERO02_ID=${generatedIds.components.hero02}
NEXT_PUBLIC_HERO02_IMGID=${generatedIds.components.hero02Img}
NEXT_PUBLIC_HERO03_ID=${generatedIds.components.hero03}
NEXT_PUBLIC_HERO03_IMGID=${generatedIds.components.hero03Img}
NEXT_PUBLIC_HERO04_ID=${generatedIds.components.hero04}
NEXT_PUBLIC_HERO04_IMGID=${generatedIds.components.hero04Img}
NEXT_PUBLIC_HERO05_ID=${generatedIds.components.hero05}
NEXT_PUBLIC_HERO05_IMGID=${generatedIds.components.hero05Img}

# Service Sections
NEXT_PUBLIC_SERVICIO_UNO_ID=${generatedIds.components.servicioUno}
NEXT_PUBLIC_SERVICIO_DOS_ID=${generatedIds.components.servicioDos}
NEXT_PUBLIC_SERVICIO_UNO_IMGID=${generatedIds.components.servicioUnoImg}
NEXT_PUBLIC_SERVICIO_DOS_IMGID=${generatedIds.components.servicioDosImg}

# Content Blocks
NEXT_PUBLIC_MARQUEE_TOP_CONTENTBLOCK=${generatedIds.components.marqueeTop}
NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK=${generatedIds.components.colecciones02}
NEXT_PUBLIC_FEEDINSTAGRAM_CONTENTBLOCK=${generatedIds.components.feedInstagram}
NEXT_PUBLIC_UBICACION_CONTENTBLOCK=${generatedIds.components.ubicacion}

#---------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------CONFIGURACIÓN DINÁMICA-------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------
NEXT_PUBLIC_REDESSOCIALES_CONTENTBLOCK=a48d6a37-3fe9-426a-a036-11ecd28335d7

#---------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------COMPONENTES LEGACY----------------------------------------------------
#---------------------------------------------------------------------------------------------------------------------------
NEXT_PUBLIC_SEO_ID_BANNER=fba10f7e-00e1-45dd-86fc-cea2dd479568
NEXT_PUBLIC_SEO_IMGID_BANNER=4a11b470-0470-4c1b-8dc9-a76ba4234aa8
`;

  // Write environment file
  fs.writeFileSync('.env.local', envContent);
  
  // Create backup
  fs.writeFileSync(`scripts/automationDocs/backups/.env.${clientName}.${Date.now()}.backup`, envContent);
  
  logSuccess("Environment file generated successfully");
  logInfo(`Environment file written to: .env.local`);
  logInfo(`Backup created in: scripts/automationDocs/backups/`);
}

// Phase 5: Git Operations
async function commitAndPush() {
  logInfo("Phase 5: Committing changes to Git...");
  
  try {
    // Create backups directory if it doesn't exist
    if (!fs.existsSync('scripts/automationDocs/backups')) {
      fs.mkdirSync('scripts/automationDocs/backups', { recursive: true });
    }
    
    // Save generation summary
    const summary = {
      clientName,
      timestamp: new Date().toISOString(),
      siteId: generatedIds.siteId,
      components: generatedIds.components,
      totalComponents: Object.keys(generatedIds.components).length
    };
    
    fs.writeFileSync(
      `scripts/automationDocs/backups/${clientName}-generation-summary.json`,
      JSON.stringify(summary, null, 2)
    );
    
    execSync('git add .');
    execSync(`git commit -m "🚀 Add client ${clientName} - Generated ${Object.keys(generatedIds.components).length} components"`);
    execSync('git push');
    
    logSuccess("Changes committed and pushed to repository");
  } catch (error) {
    logError("Failed to commit changes", error.message);
    // Don't exit here, continue with Vercel deployment
  }
}

// Phase 6: Vercel Deployment
async function deployToVercel() {
  logInfo("Phase 6: Deploying to Vercel...");
  
  if (!VERCEL_TOKEN) {
    logError("VERCEL_TOKEN not found. Skipping Vercel deployment.");
    logInfo("You can deploy manually using: vercel --prod");
    return;
  }
  
  try {
    const projectData = {
      name: clientName,
      framework: "nextjs",
      gitRepository: {
        type: "github",
        repo: process.env.GITHUB_REPOSITORY || "your-org/pixelup-ecommerce-web"
      },
      environmentVariables: [
        {
          key: "NEXT_PUBLIC_API_URL_SITEID",
          value: generatedIds.siteId,
          target: ["production", "preview"]
        }
      ]
    };
    
    const response = await axios.post('https://api.vercel.com/v9/projects', projectData, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data) {
      logSuccess(`Vercel project created: ${response.data.name}`);
      logInfo(`Project URL: https://${clientName}.vercel.app`);
      logInfo(`Dashboard: https://vercel.com/dashboard/projects/${response.data.id}`);
    }
  } catch (error) {
    logError("Failed to create Vercel project", error.response?.data?.error?.message || error.message);
    logInfo("You can create the project manually at: https://vercel.com/new");
  }
}

// Phase 7: Final Summary
function generateSummary() {
  logInfo("Phase 7: Generating final summary...");
  
  console.log("\n" + "=".repeat(80));
  console.log("🎉 CLIENT ONBOARDING COMPLETED SUCCESSFULLY");
  console.log("=".repeat(80));
  
  console.log(`\n📊 GENERATION SUMMARY:`);
  console.log(`   Client Name: ${clientName}`);
  console.log(`   Site ID: ${generatedIds.siteId}`);
  console.log(`   Components Generated: ${Object.keys(generatedIds.components).length}`);
  console.log(`   Environment Variables: 50+`);
  
  console.log(`\n🌐 DEPLOYMENT INFORMATION:`);
  console.log(`   Expected URL: https://${clientName}.vercel.app`);
  console.log(`   Environment File: .env.local`);
  
  console.log(`\n📁 GENERATED COMPONENTS:`);
  Object.entries(generatedIds.components).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  console.log(`\n📋 NEXT STEPS:`);
  console.log(`   1. Verify deployment at: https://${clientName}.vercel.app`);
  console.log(`   2. Configure custom domain in Vercel dashboard`);
  console.log(`   3. Update client-specific content through admin panel`);
  console.log(`   4. Test all components and functionality`);
  
  console.log(`\n🔧 BACKUP FILES:`);
  console.log(`   Environment: scripts/automationDocs/backups/.env.${clientName}.*.backup`);
  console.log(`   Summary: scripts/automationDocs/backups/${clientName}-generation-summary.json`);
  
  console.log("\n" + "=".repeat(80));
  logSuccess("Onboarding automation completed!");
}

// Main execution function
async function main() {
  try {
    await validateSetup();
    await createSiteId();
    await generateComponents();
    await generateEnvironmentFile();
    await commitAndPush();
    await deployToVercel();
    generateSummary();
  } catch (error) {
    logError("Onboarding failed", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Execute main function
main();
