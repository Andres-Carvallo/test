import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const clientName = process.argv[2];
if (!clientName) {
  console.error("❌ Usage: node onboard.js <client-name>");
  process.exit(1);
}

const SITE_API_URL = process.env.SITE_API_URL;
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;
const TEMPLATE_DIR = path.join("apps", "template-client");
const NEW_APP_DIR = path.join("apps", clientName);
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

// Step 1: Create Site ID
async function createSiteId() {
  const res = await fetch(SITE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ name: clientName, slug: clientName }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("❌ Failed to create site:", data);
    process.exit(1);
  }
  console.log("✅ Site created with ID:", data.id);
  return data.id;
}

// Step 2: Copy Template App
function copyTemplateApp() {
  fs.cpSync(TEMPLATE_DIR, NEW_APP_DIR, { recursive: true });
  console.log("📁 App created:", NEW_APP_DIR);
}

// Step 3: Generate Banners and Enums
async function generateBanners(siteId) {
  const BANNERS_API_URL = process.env.BANNERS_API_URL;
  const banners = [
    { title: "Banner A", config: { color: "red", size: "large" } },
    { title: "Banner B", config: { color: "blue", size: "medium" } },
    { title: "Banner C", config: { color: "green", size: "small" } },
  ];
  const ids = [];

  for (const banner of banners) {
    const res = await fetch(BANNERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ ...banner, siteId }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Error creating banner:", data);
      continue;
    }
    console.log("✅ Banner created:", data.id);
    ids.push(data.id);
  }

  const enumContent = `// Auto generated
export enum BannerIds {
${ids.map((id, i) => `  Banner${i + 1} = "${id}",`).join("\n")}
}`;
  const enumPath = path.join(NEW_APP_DIR, "src/enums/bannerIds.ts");
  fs.mkdirSync(path.dirname(enumPath), { recursive: true });
  fs.writeFileSync(enumPath, enumContent);
  console.log("📁 Enum file created:", enumPath);
}

// Step 4: Git Commit and Push
function gitPush() {
  execSync("git add .");
  execSync(`git commit -m "Add client ${clientName}"`);
  execSync("git push");
  console.log("🚀 Pushed to GitHub");
}

// Step 5: Create Vercel Project
async function createVercelProject() {
  const res = await axios.post("https://api.vercel.com/v9/projects", {
    name: clientName,
    rootDirectory: `apps/${clientName}`,
    gitRepository: {
      type: "github",
      repo: "your-org/your-repo",
    },
  }, {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  console.log("✅ Vercel project created:", res.data.id);
}

(async () => {
  const siteId = await createSiteId();
  copyTemplateApp();
  await generateBanners(siteId);
  gitPush();
  await createVercelProject();
})();