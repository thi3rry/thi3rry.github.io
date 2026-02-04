import { createCanvas } from 'canvas';

const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/4.8, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  
  const smallRadius = size/12.8;
  const colors = ['#22c55e', '#ef4444', '#eab308', '#f97316'];
  const positions = [
    [size/2, size/6],
    [size/2, size*5/6],
    [size/6, size/2],
    [size*5/6, size/2]
  ];
  
  colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(positions[i][0], positions[i][1], smallRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  
  const buffer = canvas.toBuffer('image/png');
  import fs from 'fs';
  fs.writeFileSync(`icon-${size}.png`, buffer);
  console.log(`Created icon-${size}.png`);
});

