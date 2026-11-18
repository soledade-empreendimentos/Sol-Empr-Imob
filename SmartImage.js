import { escapeHtml } from '../utils/dom.js';
import { icons } from '../utils/icons.js';

export function renderImageFallback(alt, className = '') {
  return `
    <div class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary via-muted to-secondary/70 px-4 text-center text-muted-foreground ${className}">
      ${icons.building2('h-7 w-7 text-gold/70', 1.4)}
      <span class="line-clamp-2 text-[11.5px] font-medium text-primary/70">${escapeHtml(alt || 'Soledade')}</span>
    </div>
  `;
}

export function renderSmartImage({ src, alt = '', className = '', fit = 'cover' }) {
  if (!src) {
    return renderImageFallback(alt, className);
  }
  const objectClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  return `
    <img
      src="${escapeHtml(src)}"
      alt="${escapeHtml(alt)}"
      referrerpolicy="no-referrer"
      data-smart-img="true"
      data-fallback-class="${escapeHtml(className)}"
      class="h-full w-full ${objectClass} ${className}"
    />
  `;
}

export function mountSmartImages(root) {
  if (!root) return;
  const imgs = root.querySelectorAll('img[data-smart-img]');
  imgs.forEach((img) => {
    const onError = () => {
      const alt = img.getAttribute('alt') || 'Soledade';
      const cls = img.getAttribute('data-fallback-class') || '';
      const wrapper = document.createElement('div');
      wrapper.className = 'h-full w-full';
      wrapper.innerHTML = renderImageFallback(alt, cls);
      if (img.parentNode) {
        img.parentNode.replaceChild(wrapper.firstElementChild, img);
      }
    };
    img.addEventListener('error', onError, { once: true });
    if (img.complete && img.naturalWidth === 0) {
      onError();
    }
  });
}
