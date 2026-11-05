import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const sourceDir = join(process.cwd(), 'source-assets');
const outputDir = join(process.cwd(), 'public', 'assets');

if (!existsSync(sourceDir)) {
  throw new Error(`Source assets folder not found: ${sourceDir}`);
}

mkdirSync(outputDir, { recursive: true });

const rasterFiles = readdirSync(sourceDir).filter((file) => /\.(png|jpe?g)$/i.test(file));

for (const file of rasterFiles) {
  const input = join(sourceDir, file);
  const output = join(outputDir, `${basename(file, extname(file))}.webp`);
  await sharp(input)
    .rotate()
    .webp({ quality: 84, effort: 6, smartSubsample: true })
    .toFile(output);
}

console.log(`Optimized ${rasterFiles.length} images to WebP.`);
