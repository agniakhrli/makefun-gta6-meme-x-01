import * as fs from 'node:fs';
import * as path from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

try {
    const srcPath = path.join(botDir, 'POST.json');
    const destPath = path.join(outputDir, 'POST.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.copyFileSync(srcPath, destPath);

    if (!fs.existsSync(destPath)) {
        throw new Error(`Destination file missing: ${destPath}`);
    }

    const content = fs.readFileSync(destPath, 'utf8');
    let data: any;
    try {
        data = JSON.parse(content);
    } catch (parseErr) {
        throw new Error(`Failed to parse JSON in ${destPath}: ${parseErr instanceof Error ? parseErr.message : parseErr}`);
    }

    if (!data || typeof data !== 'object' || typeof data.url !== 'string') {
        throw new Error(`Invalid POST.json format in ${destPath}: missing or non-string 'url' field`);
    }

    const urlRegex = /^https:\/\/x\.com\/[a-zA-Z0-9_]+\/status\/\d+$/;
    if (!urlRegex.test(data.url)) {
        throw new Error(`Invalid X post URL format in ${destPath}: "${data.url}" does not match https://x.com/<handle>/status/<digits>`);
    }

    console.log(`Successfully validated POST.json at ${destPath} with URL: ${data.url}`);
} catch (err) {
    console.error('Validation failed for POST.json:', err instanceof Error ? err.message : err);
    process.exit(1);
}
