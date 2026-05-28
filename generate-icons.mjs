// Gera ícones PWA usando canvas API do Node
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fundo laranja
  ctx.fillStyle = '#FF6B1A';
  ctx.fillRect(0, 0, size, size);

  // Letra S branca centralizada
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.55}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

writeFileSync('public/icons/icon-192.png', generateIcon(192));
writeFileSync('public/icons/icon-512.png', generateIcon(512));
console.log('Ícones gerados!');
