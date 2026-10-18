import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
function walk(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') ? [] : e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]); }
const files = walk('.').filter(f=>f.endsWith('.html'));
for (const file of files) {
 const html=readFileSync(file,'utf8');
 assert.match(html, /<title>.+<\/title>/);
 assert.match(html, /name="viewport"/);
 for (const [,url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
  const path='.'+url;
  assert.ok(existsSync(path.endsWith('/')?path+'index.html':path), `${file} broken link ${url}`);
 }
 if(!file.endsWith('404.html')) { assert.equal((html.match(/<h1>/g)||[]).length,1); assert.match(html,/name="description"/); }
}
assert.match(readFileSync('properties/index.html','utf8'),/site=7895/);
console.log(`Verified ${files.length} HTML files, local links, assets, metadata and RealNex embed.`);
