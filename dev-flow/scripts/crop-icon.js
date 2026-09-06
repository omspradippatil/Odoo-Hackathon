const sharp = require('sharp');
const path = require('path');

const srcPath = 'C:\\Users\\Neel Patil\\.gemini\\antigravity-ide\\brain\\dfee2f5c-5aa4-4ceb-baf0-1a81c53ab5ef\\.user_uploaded\\media_1788665972987.png';

async function main() {
  console.log('Generating ultra-clean Aakalan360 brand assets...');

  // Exact crop of the stylized "A" badge:
  // left: 215, top: 88, width: 152, height: 152
  const badgeBuffer = await sharp(srcPath)
    .extract({ left: 215, top: 88, width: 152, height: 152 })
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const maskSvg = '<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="0" y="0" width="512" height="512" rx="116" ry="116" fill="white" />' +
    '</svg>';

  // 1. App-icon badge (squircle with clean transparent outer edges)
  await sharp(badgeBuffer)
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png({ quality: 100 })
    .toFile(path.resolve('public/brand/aakalan-icon.png'));

  console.log('Saved public/brand/aakalan-icon.png');

  // Favicons
  await sharp(path.resolve('public/brand/aakalan-icon.png'))
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon.ico'));

  await sharp(path.resolve('public/brand/aakalan-icon.png'))
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/icon-192.png'));

  await sharp(path.resolve('public/brand/aakalan-icon.png'))
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/icon-512.png'));

  console.log('Saved favicons and PWA icons');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
