import { PROPERTY_TYPES } from '../data/catalog.js';

export function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatNumberWithSuffix(value, suffix = '') {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${new Intl.NumberFormat('pt-BR').format(Number(value))}${suffix}`;
}

export function formatPropertyPrice(property) {
  if (property.purpose === 'aluguel') {
    return property.rent_price ? `${formatCurrency(property.rent_price)} / mês` : 'Sob consulta';
  }
  return property.sale_price ? formatCurrency(property.sale_price) : 'Sob consulta';
}

export function getPropertyTypeLabel(type) {
  return PROPERTY_TYPES.find((item) => item.value === type)?.label || 'Imóvel';
}

export function inferImageCategory(src) {
  const lower = (src || '').toLowerCase();
  if (lower.includes('paisagem') || lower.includes('vista') || lower.includes('praia')) {
    return 'paisagem';
  }
  if (
    lower.includes('area') ||
    lower.includes('facade') ||
    lower.includes('condo') ||
    lower.includes('fachada')
  ) {
    return 'condominio';
  }
  return 'casa';
}

export function compressImageFile(file, maxWidth = 900, quality = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo inválido ou não é imagem.'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);
        while (dataUrl.length > 180000 && q > 0.35) {
          q -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
