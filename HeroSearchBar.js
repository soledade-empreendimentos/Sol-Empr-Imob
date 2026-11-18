import { HERO_PRICE_RANGES, PROPERTY_TYPES } from '../data/catalog.js';
import { escapeHtml, navigateTo } from '../utils/dom.js';
import { icons } from '../utils/icons.js';

export function renderHeroSearchBar() {
  return `
    <form
      id="hero-search-form"
      class="hero-search mt-9 w-full max-w-3xl rounded-2xl border border-border/80 bg-background p-3 text-left shadow-[0_18px_50px_-30px_rgba(14,42,68,0.45)] sm:p-3.5"
    >
      <div class="flex gap-1 rounded-full bg-secondary p-1" role="tablist" aria-label="Finalidade">
        <button
          type="button"
          data-hero-purpose="venda"
          aria-pressed="true"
          class="flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors bg-background text-primary shadow-sm"
        >
          Comprar
        </button>
        <button
          type="button"
          data-hero-purpose="aluguel"
          aria-pressed="false"
          class="flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors text-muted-foreground hover:text-primary"
        >
          Alugar
        </button>
      </div>

      <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <select
          id="hero-search-type"
          aria-label="Tipo de imóvel"
          class="h-11 rounded-xl border border-border bg-background px-3 text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option value="">Tipo de imóvel</option>
          ${PROPERTY_TYPES.map(
            (item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
          ).join('')}
        </select>

        <input
          id="hero-search-neighborhood"
          placeholder="Bairro"
          aria-label="Bairro"
          class="h-11 rounded-xl border border-border bg-background px-3.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
        />

        <select
          id="hero-search-price"
          aria-label="Faixa de preço"
          class="h-11 rounded-xl border border-border bg-background px-3 text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option value="">Faixa de preço</option>
          ${HERO_PRICE_RANGES.venda
            .map(
              (item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
            )
            .join('')}
        </select>

        <button
          type="submit"
          class="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          ${icons.search('h-4 w-4', 1.8)}
          Buscar imóveis
        </button>
      </div>
    </form>
  `;
}

export function mountHeroSearchBar(root) {
  const form = root.querySelector('#hero-search-form');
  if (!form) return;

  let purpose = 'venda';
  const tabs = form.querySelectorAll('[data-hero-purpose]');
  const typeSelect = form.querySelector('#hero-search-type');
  const neighborhoodInput = form.querySelector('#hero-search-neighborhood');
  const priceSelect = form.querySelector('#hero-search-price');

  function updatePriceOptions() {
    if (!priceSelect) return;
    const ranges = HERO_PRICE_RANGES[purpose] || [];
    priceSelect.innerHTML =
      `<option value="">Faixa de preço</option>` +
      ranges
        .map(
          (item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
        )
        .join('');
    priceSelect.value = '';
  }

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-hero-purpose') || 'venda';
      if (next === purpose) return;
      purpose = next;
      tabs.forEach((t) => {
        const active = t.getAttribute('data-hero-purpose') === purpose;
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
        t.className = `flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
          active
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-primary'
        }`;
      });
      updatePriceOptions();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const typeVal = typeSelect ? typeSelect.value : '';
    const neighborhoodVal = neighborhoodInput ? neighborhoodInput.value.trim() : '';
    const priceVal = priceSelect ? priceSelect.value : '';

    if (typeVal) params.set('type', typeVal);
    if (neighborhoodVal) params.set('neighborhood', neighborhoodVal);
    if (priceVal) {
      const [min, max] = priceVal.split('-');
      if (min) params.set('min', min);
      if (max && max !== '0') params.set('max', max);
    }

    const query = params.toString();
    navigateTo(`${purpose === 'aluguel' ? '/alugar' : '/comprar'}${query ? `?${query}` : ''}`);
  });
}
