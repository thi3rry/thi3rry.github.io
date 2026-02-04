import sharp from 'sharp';

const sizes = [180, 192, 512];

sizes.forEach(async (size) => {
  try {
    await sharp('public/icon.svg')
      .resize(size, size)
      .png()
      .toFile(`public/icon-${size}.png`);
    console.log(`Created icon-${size}.png`);
  } catch (err) {
    console.error(`Error creating icon-${size}.png:`, err);
  }
});