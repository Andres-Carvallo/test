# 🚀 PixelUp Client Automation Roadmap

**Single-App Architecture with Complete Component Generation**

This roadmap defines the complete automation process for onboarding new clients in our PixelUp ecommerce platform with automated component generation, environment configuration, and Vercel deployment.

---

## 🎯 Overview

### Final Goal

When onboarding a new client, the system will automatically:

1. **Create Site Infrastructure**: Generate `siteId` via backend API
2. **Component Generation**: Create all required banners, content blocks, and configurations
3. **Environment Setup**: Generate complete `.env.local` with all component IDs
4. **Code Integration**: Update enums and configuration files
5. **Deployment**: Deploy directly to Vercel with custom domain
6. **Documentation**: Generate client-specific documentation

---

## 🏗️ Architecture Overview

```
pixelup-ecommerce-web/
├── scripts/
│   ├── automationDocs/
│   │   ├── automation_roadmap.md          # This file
│   │   ├── client_onboarding_roadmap.txt  # Original (archived)
│   │   └── onboard.yml                    # GitHub Actions
│   ├── onboard.js                         # Main automation script
│   ├── initHomeConfig.js                  # Home component setup
│   ├── initFooterConfig.js                # Footer component setup
│   ├── initContactFormConfig.js           # Contact form setup
│   └── initWhatsAppConfig.js              # WhatsApp config setup
├── .env.local                             # Generated environment variables
└── .github/workflows/onboard.yml          # GitHub Actions workflow
```

---

## 📋 Component Generation System

### Core Components Created

| Component Type | Script | Environment Variables Generated | Description |
|---------------|--------|--------------------------------|-------------|
| **Site Configuration** | `onboard.js` | `NEXT_PUBLIC_API_URL_SITEID` | Main site identifier |
| **Home Layout** | `initHomeConfig.js` | `NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK` | Homepage component ordering |
| **Footer** | `initFooterConfig.js` | `NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK` | Footer configuration |
| **Contact Form** | `initContactFormConfig.js` | `NEXT_PUBLIC_CONTACT_FORM_BANNER_ID`<br/>`NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID` | Contact form banners |
| **WhatsApp Integration** | `initWhatsAppConfig.js` | `NEXT_PUBLIC_WHATSAPP_CONFIG_CONTENTBLOCK` | WhatsApp floating widget |
| **Principal Banners** | `onboard.js` | `NEXT_PUBLIC_BANNERPRINCIPAL01_ID`<br/>`NEXT_PUBLIC_BANNERPRINCIPAL01MOBILE_ID` | Main homepage banners |
| **Category Banners** | `onboard.js` | `NEXT_PUBLIC_CATEGORIA01_ID` to `NEXT_PUBLIC_CATEGORIA07_ID`<br/>`NEXT_PUBLIC_CATEGORIA01_IMGID` to `NEXT_PUBLIC_CATEGORIA07_IMGID` | Category showcase banners |
| **Hero Sections** | `onboard.js` | `NEXT_PUBLIC_HERO01_ID` to `NEXT_PUBLIC_HERO05_ID`<br/>`NEXT_PUBLIC_HERO01_IMGID` to `NEXT_PUBLIC_HERO05_IMGID` | Hero section components |
| **Service Sections** | `onboard.js` | `NEXT_PUBLIC_SERVICIO_UNO_ID`<br/>`NEXT_PUBLIC_SERVICIO_DOS_ID`<br/>`NEXT_PUBLIC_SERVICIO_UNO_IMGID`<br/>`NEXT_PUBLIC_SERVICIO_DOS_IMGID` | Service highlight sections |
| **Content Blocks** | `onboard.js` | `NEXT_PUBLIC_MARQUEE_TOP_CONTENTBLOCK`<br/>`NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK`<br/>`NEXT_PUBLIC_FEEDINSTAGRAM_CONTENTBLOCK`<br/>`NEXT_PUBLIC_UBICACION_CONTENTBLOCK` | Various content sections |

---

## 🔄 Automation Flow

### Phase 1: Pre-Setup Validation
```bash
# 1. Validate environment variables
# 2. Check API connectivity
# 3. Verify Vercel token
# 4. Validate client name format
```

### Phase 2: Site Creation
```bash
# 1. Create siteId via API
# 2. Generate base environment variables
```

### Phase 3: Component Generation
```bash
# 1. Run initHomeConfig.js
# 2. Run initFooterConfig.js  
# 3. Run initContactFormConfig.js
# 4. Run initWhatsAppConfig.js
# 5. Generate all banners and content blocks
# 6. Collect all generated IDs
```

### Phase 4: Environment Configuration
```bash
# 1. Generate complete .env.local file
# 2. Update configuration enums
# 3. Update component mappings
```

### Phase 5: Code Integration
```bash
# 1. Update TypeScript enums
# 2. Generate component configuration files
# 3. Update API endpoints
```

### Phase 6: Deployment
```bash
# 1. Git commit and push changes
# 2. Create Vercel project
# 3. Configure environment variables in Vercel
# 4. Deploy application
# 5. Configure custom domain (optional)
```

### Phase 7: Post-Deployment
```bash
# 1. Generate client documentation
# 2. Send deployment summary
# 3. Create backup configuration
```

---

## ⚙️ Environment Variables Template

The automation will generate a complete `.env.local` file with all necessary variables:

```bash
# Site Configuration
NEXT_PUBLIC_API_URL_SITEID={{GENERATED_SITE_ID}}

# API Configuration  
NEXT_PUBLIC_API_URL_BO_CLIENTE=https://pixelup-customer-backoffice-api-git-de-80bd27-pixelups-projects.vercel.app
NEXT_PUBLIC_API_URL_CLIENTE=https://pixelup-ecommerce-api-git-development-pixelups-projects.vercel.app
NEXT_PUBLIC_BASE_URL=https://{{CLIENT_NAME}}.vercel.app

# Component Configuration
NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK={{GENERATED_HOME_CONFIG_ID}}
NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK={{GENERATED_FOOTER_CONFIG_ID}}
NEXT_PUBLIC_CONTACT_FORM_BANNER_ID={{GENERATED_CONTACT_BANNER_ID}}
NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID={{GENERATED_CONTACT_IMG_ID}}
NEXT_PUBLIC_WHATSAPP_CONFIG_CONTENTBLOCK={{GENERATED_WHATSAPP_CONFIG_ID}}

# Banner Configuration
NEXT_PUBLIC_BANNERPRINCIPAL01_ID={{GENERATED_BANNER_01_ID}}
NEXT_PUBLIC_BANNERPRINCIPAL01MOBILE_ID={{GENERATED_BANNER_01_MOBILE_ID}}

# Category Banners (1-7)
NEXT_PUBLIC_CATEGORIA01_ID={{GENERATED_CAT_01_ID}}
NEXT_PUBLIC_CATEGORIA01_IMGID={{GENERATED_CAT_01_IMG_ID}}
# ... (repeats for categories 2-7)

# Hero Sections (1-5)  
NEXT_PUBLIC_HERO01_ID={{GENERATED_HERO_01_ID}}
NEXT_PUBLIC_HERO01_IMGID={{GENERATED_HERO_01_IMG_ID}}
# ... (repeats for heroes 2-5)

# Service Sections
NEXT_PUBLIC_SERVICIO_UNO_ID={{GENERATED_SERVICE_01_ID}}
NEXT_PUBLIC_SERVICIO_DOS_ID={{GENERATED_SERVICE_02_ID}}
NEXT_PUBLIC_SERVICIO_UNO_IMGID={{GENERATED_SERVICE_01_IMG_ID}}
NEXT_PUBLIC_SERVICIO_DOS_IMGID={{GENERATED_SERVICE_02_IMG_ID}}

# Content Blocks
NEXT_PUBLIC_MARQUEE_TOP_CONTENTBLOCK={{GENERATED_MARQUEE_ID}}
NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK={{GENERATED_COLLECTIONS_ID}}
NEXT_PUBLIC_FEEDINSTAGRAM_CONTENTBLOCK={{GENERATED_INSTAGRAM_ID}}
NEXT_PUBLIC_UBICACION_CONTENTBLOCK={{GENERATED_LOCATION_ID}}

# Store Configuration
NEXT_PUBLIC_NOMBRE_TIENDA="{{CLIENT_STORE_NAME}}"
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/{{CLIENT_PHONE}}
NEXT_PUBLIC_LOGO="/logo-{{CLIENT_NAME}}.png"

# SEO and Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID={{GENERATED_GA_ID}}
```

---

## 🚀 Usage Instructions

### Manual Execution
```bash
# Run complete onboarding process
npm run onboard <client-name>

# Or directly with node
node scripts/onboard.js client-name
```

### GitHub Actions (Recommended)
1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Find **"Onboard New Client"** workflow
4. Click **"Run workflow"**
5. Enter client name (e.g., `client-xyz`)
6. Click **"Run workflow"**

### Required Environment Variables in GitHub Secrets
```bash
API_AUTH_TOKEN=your-secret-token
SITE_API_URL=https://your-api.com/sites
BANNERS_API_URL=https://your-api.com/banners
VERCEL_TOKEN=your-vercel-token
GITHUB_TOKEN=your-github-token
```

---

## 📊 Success Metrics

After successful automation, you will have:

- ✅ **New Site ID** created in your backend
- ✅ **50+ Components** automatically generated and configured
- ✅ **Complete Environment File** with all necessary variables
- ✅ **Deployed Application** on Vercel
- ✅ **Custom Domain** configured (if specified)
- ✅ **Client Documentation** generated
- ✅ **Backup Configuration** created

---

## 🔧 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
```bash
# Check file location
ls -la .env.local

# Verify format
cat .env.local | head -10
```

**API Authentication Errors**
```bash
# Test API connectivity
curl -H "Authorization: Bearer $API_AUTH_TOKEN" $SITE_API_URL
```

**Vercel Deployment Issues**
```bash
# Check Vercel token
vercel whoami

# Manual deployment
vercel --prod
```

### Recovery Commands
```bash
# Rollback last deployment
vercel rollback

# Regenerate specific component
node scripts/initFooterConfig.js

# Reset environment variables
cp scripts/automationDocs/env.template .env.local
```

---

## 🔄 Maintenance

### Monthly Tasks
- [ ] Update component templates
- [ ] Review generated IDs for duplicates
- [ ] Update API endpoints if changed
- [ ] Test automation with dummy client

### Quarterly Tasks  
- [ ] Update GitHub Actions versions
- [ ] Review and optimize component generation
- [ ] Update documentation
- [ ] Backup automation configurations

---

## 📈 Future Enhancements

### Phase 2 Features
- [ ] **Multi-language Support**: Automatic translation setup
- [ ] **Theme Generation**: Custom color schemes per client
- [ ] **Advanced SEO**: Automated meta tags and schema
- [ ] **Performance Monitoring**: Built-in analytics setup

### Phase 3 Features
- [ ] **AI Content Generation**: Automated content creation
- [ ] **Custom Component Builder**: Visual component designer
- [ ] **Advanced Deployment**: Multi-environment support
- [ ] **Client Portal**: Self-service configuration interface

---

*Last updated: {{CURRENT_DATE}}*
*Version: 2.0.0*
*Architecture: Single-App with Complete Automation*
