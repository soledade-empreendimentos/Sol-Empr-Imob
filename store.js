import { DEFAULT_SITE_SETTINGS, PROPERTIES_CATALOG } from '../data/catalog.js';
import { escapeHtml } from './dom.js';
import { icons } from './icons.js';

const INQUIRIES_STORAGE_KEY = 'soledade_end_user_inquiries';

export function getSiteSettings() {
  return DEFAULT_SITE_SETTINGS;
}

export function getAvailableProperties() {
  return PROPERTIES_CATALOG.filter((item) => item.status === 'disponivel');
}

export function whatsappUrl(customMessage, customNumber) {
  const settings = getSiteSettings();
  const cleanNumber = (customNumber || settings.whatsapp || '5571993619565').replace(/\D/g, '');
  const text = customMessage || 'Olá! Gostaria de falar com a Soledade sobre um imóvel.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function buildPropertyWhatsappMessage(property) {
  if (!property) {
    return 'Olá! Gostaria de falar com a Soledade sobre um imóvel.';
  }
  const codePart = property.code ? ` (código ${property.code})` : '';
  return `Olá! Tenho interesse no imóvel "${property.title}"${codePart}. Poderia me enviar mais informações?`;
}

export async function submitLead(payload) {
  const entry = {
    ...payload,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
  try {
    const raw = window.localStorage.getItem(INQUIRIES_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const storable = {
      ...entry,
      photos: entry.photos ? entry.photos.slice(0, 2) : undefined,
    };
    window.localStorage.setItem(
      INQUIRIES_STORAGE_KEY,
      JSON.stringify([storable, ...existing].slice(0, 20))
    );
  } catch {
    // Ignore storage quota errors
  }
  return entry;
}

function getToastContainer() {
  let container = document.getElementById('soledade-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'soledade-toast-container';
    container.setAttribute('aria-live', 'polite');
    container.className =
      'pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, tone = 'success') {
  const container = getToastContainer();
  const toastEl = document.createElement('div');
  toastEl.setAttribute('role', 'status');
  toastEl.className = `pointer-events-auto flex items-start gap-3 rounded-xl border bg-background p-4 shadow-lg transition-all ${
    tone === 'error'
      ? 'border-destructive/30 text-destructive'
      : 'border-success/30 text-primary'
  }`;

  const iconHtml =
    tone === 'error'
      ? `<span class="mt-0.5 shrink-0 text-destructive">${icons.alertCircle('h-4 w-4', 1.8)}</span>`
      : `<span class="mt-0.5 shrink-0 text-success">${icons.checkCircle2('h-4 w-4', 1.8)}</span>`;

  toastEl.innerHTML = `
    ${iconHtml}
    <p class="flex-1 text-[13px] font-medium leading-snug text-ink">${escapeHtml(message)}</p>
    <button
      type="button"
      aria-label="Fechar aviso"
      class="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
    >
      ${icons.x('h-3.5 w-3.5', 1.8)}
    </button>
  `;

  const closeBtn = toastEl.querySelector('button');
  const remove = () => {
    if (toastEl.parentNode) {
      toastEl.parentNode.removeChild(toastEl);
    }
  };
  if (closeBtn) closeBtn.addEventListener('click', remove);
  container.appendChild(toastEl);
  window.setTimeout(remove, 4500);
}
