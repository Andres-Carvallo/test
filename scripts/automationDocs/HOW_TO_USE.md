# 🚀 How to Use PixelUp Client Automation System

Complete guide for setting up and using the automated client onboarding system.

---

## 🎯 Strategy Overview

### **Two Main Approaches:**

#### **Option 1: Manual Trigger (Current Setup)**
- Developer manually runs automation for each new client
- Controlled process with manual oversight
- GitHub Actions or NPM commands

#### **Option 2: Auto-Trigger on Clone (Your Preferred)**
- Automatic setup when repository is cloned
- No manual intervention needed
- Runs on first deployment/build

---

## 🔧 Current Setup (Manual Trigger)

### **Prerequisites**

1. **GitHub Repository** must exist
2. **Environment Variables** configured in GitHub Secrets:
   ```
   API_AUTH_TOKEN=your-backend-token
   SITE_API_URL=your-site-api-url
   BANNERS_API_URL=your-banners-api-url
   VERCEL_TOKEN=your-vercel-token
   ```
3. **Local Environment** (for NPM usage):
   ```bash
   # Create .env.local with basic API URLs
   NEXT_PUBLIC_API_URL_BO_CLIENTE=your-api-url
   NEXT_PUBLIC_API_URL_CLIENTE=your-api-url
   ```

### **Usage Methods**

#### **Method 1: GitHub Actions (Recommended for Production)**

1. **Go to your GitHub repository**
2. **Click "Actions" tab**
3. **Find "🚀 Onboard New PixelUp Client" workflow**
4. **Click "Run workflow"**
5. **Fill in the form:**
   ```
   Client Name: cliente-ejemplo
   Custom Domain: ejemplo.com (optional)
   Store Name: Tienda Ejemplo (optional)
   Phone Number: +56912345678 (optional)
   ```
6. **Click "Run workflow"**
7. **Wait 5-10 minutes for completion**

#### **Method 2: NPM Command (For Development)**

```bash
# Complete onboarding
npm run onboard cliente-ejemplo

# Individual components (if needed)
npm run init:home
npm run init:footer
npm run init:contact
npm run init:whatsapp
```

#### **Method 3: Direct Script**

```bash
node scripts/onboard.js cliente-ejemplo
```

---

## 🚀 Proposed Auto-Trigger Setup

### **Strategy: Auto-Generate on First Build**

This approach automatically generates components when the repository is first deployed, eliminating manual steps.

#### **How It Would Work:**

1. **Clone Repository** → `git clone pixelup-repo new-client`
2. **Set Client Name** → Environment variable or config file
3. **First Build/Deploy** → Automatically triggers component generation
4. **Components Created** → All IDs generated and saved
5. **Site Ready** → Fully functional with all components

#### **Implementation Options:**

##### **Option A: Environment-Based Trigger**
```bash
# In .env.local or Vercel environment
PIXELUP_CLIENT_NAME=cliente-ejemplo
PIXELUP_AUTO_SETUP=true

# Triggers automation on first build
```

##### **Option B: Config File Trigger**
```json
// pixelup.config.json
{
  "clientName": "cliente-ejemplo",
  "autoSetup": true,
  "firstRun": true
}
```

##### **Option C: Build-Time Detection**
```bash
# Detect if components exist, if not, auto-generate
if [ ! -f ".env.generated" ]; then
  node scripts/onboard.js $CLIENT_NAME
  touch .env.generated
fi
```

---

## 🔧 API ID Generation Fix

### **Current Issue:**
Scripts are sending pre-generated IDs to the API, but the API should auto-generate them.

### **Solution:**
Remove ID from POST requests and capture generated IDs from responses.

#### **Before (Current):**
```javascript
const response = await axios.post(API_URL, {
  id: generatedId,  // ❌ Pre-generated ID
  title: "Banner Title",
  // ... other data
});
```

#### **After (Fixed):**
```javascript
const response = await axios.post(API_URL, {
  // ❌ No ID sent - let API generate it
  title: "Banner Title",
  // ... other data
});

// ✅ Capture the auto-generated ID
const generatedId = response.data.banner.id; // or response.data.id
```

### **Updated Component Generation Flow:**

1. **POST without ID** → Let API auto-generate
2. **Capture Response ID** → Store in generatedIds object
3. **Use ID in Environment** → Add to .env.local
4. **Continue with Next Component** → Repeat process

---

## 📝 Step-by-Step Setup Guide

### **For New Clients (Manual Trigger)**

#### **Step 1: Prepare Repository**
```bash
# Ensure you have the latest automation code
git pull origin main

# Verify scripts exist
ls scripts/
# Should show: onboard.js, initHomeConfig.js, etc.
```

#### **Step 2: Configure GitHub Secrets**
Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:
```
API_AUTH_TOKEN=your-token-here
SITE_API_URL=https://your-api.com/api/v1/sites
BANNERS_API_URL=https://your-api.com/api/v1/banners
VERCEL_TOKEN=your-vercel-token-here
```

#### **Step 3: Run Automation**
Choose one method:

**GitHub Actions (Recommended):**
1. Go to Actions tab
2. Run "🚀 Onboard New PixelUp Client"
3. Enter client name: `cliente-ejemplo`
4. Wait for completion

**Local NPM:**
```bash
npm run onboard cliente-ejemplo
```

#### **Step 4: Verify Results**
Check that these were created:
- ✅ `.env.local` with all variables
- ✅ Site deployed to `https://cliente-ejemplo.vercel.app`
- ✅ Backup files in `scripts/automationDocs/backups/`
- ✅ Git commit with changes

### **For New Clients (Auto-Trigger - Future)**

#### **Step 1: Clone and Configure**
```bash
# Clone repository
git clone pixelup-repo cliente-ejemplo
cd cliente-ejemplo

# Set client name
echo "PIXELUP_CLIENT_NAME=cliente-ejemplo" > .env.local
```

#### **Step 2: Deploy**
```bash
# Deploy to Vercel (triggers auto-setup)
vercel --prod

# Or build locally (triggers auto-setup)
npm run build
```

#### **Step 3: Verify**
- ✅ Components auto-generated during build
- ✅ `.env.local` updated with all IDs
- ✅ Site fully functional

---

## 🗂️ What Gets Generated

### **Components Created (50+):**

#### **Core Configuration (4 components)**
```bash
NEXT_PUBLIC_HOME_CONFIG_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_WHATSAPP_CONFIG_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_CONTACT_FORM_BANNER_ID=auto-generated-id
```

#### **Visual Banners (32 components)**
```bash
# Principal Banners (2)
NEXT_PUBLIC_BANNERPRINCIPAL01_ID=auto-generated-id
NEXT_PUBLIC_BANNERPRINCIPAL01MOBILE_ID=auto-generated-id

# Category Banners (14 - 7 categories × 2 IDs)
NEXT_PUBLIC_CATEGORIA01_ID=auto-generated-id
NEXT_PUBLIC_CATEGORIA01_IMGID=auto-generated-id
# ... continues for categories 02-07

# Hero Sections (10 - 5 heroes × 2 IDs)
NEXT_PUBLIC_HERO01_ID=auto-generated-id
NEXT_PUBLIC_HERO01_IMGID=auto-generated-id
# ... continues for heroes 02-05

# Service Sections (4 - 2 services × 2 IDs)
NEXT_PUBLIC_SERVICIO_UNO_ID=auto-generated-id
NEXT_PUBLIC_SERVICIO_UNO_IMGID=auto-generated-id
NEXT_PUBLIC_SERVICIO_DOS_ID=auto-generated-id
NEXT_PUBLIC_SERVICIO_DOS_IMGID=auto-generated-id
```

#### **Content Blocks (4 components)**
```bash
NEXT_PUBLIC_MARQUEE_TOP_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_COLECCIONES02_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_FEEDINSTAGRAM_CONTENTBLOCK=auto-generated-id
NEXT_PUBLIC_UBICACION_CONTENTBLOCK=auto-generated-id
```

### **Additional Generated Variables:**
```bash
# Site Configuration
NEXT_PUBLIC_API_URL_SITEID=auto-generated-site-id
NEXT_PUBLIC_BASE_URL=https://cliente-ejemplo.vercel.app
NEXT_PUBLIC_NOMBRE_TIENDA=Cliente Ejemplo

# Store Settings
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/56912345678
NEXT_PUBLIC_LOGO=/logo-cliente-ejemplo.png

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-GENERATED-CLIENTE-EJEMPLO
```

---

## 🔍 Troubleshooting

### **Common Issues**

#### **Issue: "API returns ID not found"**
```bash
# Check if API auto-generates IDs
# Solution: Remove ID from POST request, capture from response
```

#### **Issue: "Environment variables not loading"**
```bash
# Check file location
ls -la .env.local

# Check content
head .env.local

# Solution: Ensure .env.local is in project root
```

#### **Issue: "GitHub Actions workflow not found"**
```bash
# Check workflow file exists
ls .github/workflows/onboard.yml

# Solution: Copy from scripts/automationDocs/onboard.yml
cp scripts/automationDocs/onboard.yml .github/workflows/
```

#### **Issue: "Vercel deployment fails"**
```bash
# Check token
vercel whoami

# Manual deployment
vercel --prod

# Solution: Verify VERCEL_TOKEN in GitHub secrets
```

### **Manual Recovery**

If automation fails, run individual scripts:
```bash
# Create site ID manually
# Then run individual components:
node scripts/initHomeConfig.js
node scripts/initFooterConfig.js
node scripts/initContactFormConfig.js
node scripts/initWhatsAppConfig.js
```

---

## 📋 Pre-Setup Checklist

### **Repository Setup**
- [ ] ✅ GitHub repository exists
- [ ] ✅ Automation scripts present in `scripts/` folder
- [ ] ✅ GitHub Actions workflow in `.github/workflows/`
- [ ] ✅ Package.json has automation npm scripts

### **Environment Configuration**
- [ ] ✅ GitHub Secrets configured (API_AUTH_TOKEN, VERCEL_TOKEN, etc.)
- [ ] ✅ API endpoints accessible
- [ ] ✅ Vercel account connected

### **Local Development (Optional)**
- [ ] ✅ Node.js 18+ installed
- [ ] ✅ NPM dependencies installed (`npm install`)
- [ ] ✅ Basic `.env.local` with API URLs

---

## 🚀 Quick Start Commands

### **For Immediate Use:**

```bash
# Quick setup for new client
npm run onboard mi-nuevo-cliente

# Check results
cat .env.local | grep SITEID
vercel list
```

### **For Auto-Trigger Setup (Future):**

```bash
# Clone for new client
git clone pixelup-repo nuevo-cliente
cd nuevo-cliente

# Set client name and auto-setup flag
echo "PIXELUP_CLIENT_NAME=nuevo-cliente" > .env.local
echo "PIXELUP_AUTO_SETUP=true" >> .env.local

# Deploy (triggers auto-generation)
vercel --prod
```

---

## 📞 Support

### **If You Need Help:**

1. **Check logs** in GitHub Actions or terminal
2. **Review backup files** in `scripts/automationDocs/backups/`
3. **Run individual scripts** for debugging
4. **Check API connectivity** with curl or Postman

### **Common Commands for Debugging:**

```bash
# Test API connectivity
curl -H "Authorization: Bearer $API_AUTH_TOKEN" $SITE_API_URL

# Check generated files
ls scripts/automationDocs/backups/

# View recent automation summary
cat scripts/automationDocs/backups/*-generation-summary.json | tail -1

# Manual component creation
node scripts/initHomeConfig.js
```

---

## 📊 Success Metrics

After successful automation, you should have:

- ✅ **50+ Components** generated automatically
- ✅ **Complete .env.local** with all environment variables
- ✅ **Working Vercel deployment** at `https://client-name.vercel.app`
- ✅ **Backup files** created for recovery
- ✅ **Git commit** with all changes
- ✅ **Total time** under 10 minutes

---

*🎉 Your PixelUp automation system is ready! Choose your preferred method and start onboarding clients in minutes instead of hours.*
