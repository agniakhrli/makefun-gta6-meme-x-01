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
} catch (err) {
    console.error('Failed to copy POST.json:', err);
    process.exit(1);
}
