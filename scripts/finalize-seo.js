import { readFileSync, writeFileSync } from 'node:fs';
const site = new URL(process.env.SITE_URL || '');
if (site.protocol !== 'https:' || site.pathname !== '/' || site.search || site.hash) throw new Error('SITE_URL must be an approved HTTPS origin');
const routes=['','sell-your-property/','properties/','services/','about/','contact/','privacy/'];
for (const route of routes) {
 const file=(route||'')+'index.html';
 let html=readFileSync(file,'utf8').replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:(url|image)"[^>]*>/g,'');
 const url=new URL(route,site).href;
 html=html.replace('</head>',`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><meta property="og:image" content="${new URL('assets/las-vegas.jpg',site).href}"></head>`);
 writeFileSync(file,html);
}
writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${new URL(r,site).href}</loc></url>`).join('')}</urlset>`);
writeFileSync('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',site).href}\n`);
console.log('Production canonical URLs, social metadata and sitemap generated.');
