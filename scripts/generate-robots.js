const fs = require('fs');
const path = require('path');
require('dotenv').config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const robotsTxt = `# *
User-agent: *
Allow: /

# *
User-agent: *
Disallow: /dashboard
Disallow: /tienda/mi-cuenta
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /static
Disallow: /images
Disallow: /favicon.ico
Disallow: /robots.txt
Disallow: /sitemap.xml

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
fs.writeFileSync(robotsPath, robotsTxt);
