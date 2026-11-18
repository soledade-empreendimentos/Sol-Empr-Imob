import { mountSmartImages } from '../components/SmartImage.js';
import { renderPropertyGrid } from '../components/PropertyGrid.js';
import { PROPERTY_TYPES } from '../data/catalog.js';
import { escapeHtml } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getAvailableProperties } from '../utils/store.js';

const ROOM_OPTIONS = [1, 2, 3, 4, 5];

function readFiltersFromParams(params) {
  return {
    type: params.get('type') || undefined,
    neighborhood: params.get('neighborhood') || undefined,
    min: params.get('min') ? Number(params.get('min')) : undefined,
    max: params.get('max') ? Number(params.get('max')) : undefined,
    bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
    suites: params.get('suites') ? Number(params.get('suites')) : undefined,
    parking: params.get('parking') ? Number(params.get('parking')) : undefined,
    condoMax: params.get('condoMax') ? Number(params.get('condoMax')) : undefined,
    minArea: params.get('minArea') ? Number(params.get('minArea')) : undefined,
    code: params.get('code') || undefined,
    sort: params.get('sort') || undefined,
  };
}

function filterProperties(properties, purpose, filters) {
  const isRent = purpose === 'aluguel';
  const items = properties.filter((item) => {
    if (item.purpose !== purpose) return false;
    if (filters.type && item.property_type !== filters.type) return false;
    if (
      filters.neighborhood &&
      !`${item.neighborhood} ${item.city}`.toLowerCase().includes(filters.neighborhood.toLowerCase())
    ) {
      return false;
    }
    if (filters.code && !(item.code || '').toLowerCase().includes(filters.code.toLowerCase())) {
      return false;
    }

    const price = isRent ? item.rent_price : item.sale_price;
    if (filters.min != null && (price == null || price < filters.min)) return false;
    if (filters.max != null && (price == null || price > filters.max)) return false;
    if (filters.bedrooms != null && (item.bedrooms ?? 0) < filters.bedrooms) return false;
    if (filters.suites != null && (item.suites ?? 0) < filters.suites) return false;
    if (filters.parking != null && (item.parking_spots ?? 0) < filters.parking) return false;
    if (filters.condoMax != null && (item.condo_fee ?? 0) > filters.condoMax) return false;
    const area = item.built_area || item.total_area;
    if (filters.minArea != null && (area == null || area < filters.minArea)) return false;
    return true;
  });

  const getPrice = (p) => (isRent ? p.rent_price : p.sale_price) ?? Number.MAX_SAFE_INTEGER;
  if (filters.sort === 'menor_preco') return [...items].sort((a, b) => getPrice(a) - getPrice(b));
  if (filters.sort === 'maior_preco') return [...items].sort((a, b) => getPrice(b) - getPrice(a));
  if (filters.sort === 'area') {
    return [...items].sort(
      (a, b) => (b.built_area || b.total_area || 0) - (a.built_area || a.total_area || 0)
    );
  }
  return items;
}

export function renderCatalogPage({ purpose = 'venda', params = new URLSearchParams() }) {
  const isRent = purpose === 'aluguel';
  const filters = readFiltersFromParams(params);
  const properties = getAvailableProperties();
  const filtered = filterProperties(properties, purpose, filters);

  const selectClass =
    'h-11 w-full rounded-xl border border-input bg-background px-3 text-[13px] text-ink outline-none focus:ring-2 focus:ring-ring/40';
  const inputClass =
    'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-[13px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40';

  const countLabel =
    filtered.length === 1 ? '1 imóvel encontrado' : `${filtered.length} imóveis encontrados`;
  const availLabel =
    filtered.length === 1 ? '1 imóvel disponível' : `${filtered.length} imóveis disponíveis`;

  return `
    <div>
      <div class="border-b border-border bg-[#F3F0EA]">
        <div class="container-page py-12 sm:py-16">
          <div>
            <p class="eyebrow">${isRent ? 'Locação' : 'Compra e venda'}</p>
            <h1 class="mt-3 text-[34px] font-medium leading-tight text-[#152238] sm:text-[44px]">
              ${isRent ? 'Imóveis para alugar em Salvador' : 'Imóveis à venda em Salvador'}
            </h1>
            <p class="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
              ${
                isRent
                  ? 'Opções residenciais e comerciais com análise de crédito acompanhada, contrato revisado e suporte durante toda a locação.'
                  : 'Cada imóvel é visitado e tem a documentação conferida antes de entrar no catálogo. Selecione o bairro e o perfil que procura — ou fale com a nossa equipe para uma seleção personalizada.'
              }
            </p>
          </div>
        </div>
      </div>

      <div class="container-page py-10">
        <div id="catalog-filter-bar" class="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div class="mb-4 flex items-center justify-between">
            <p class="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              ${icons.slidersHorizontal('h-3.5 w-3.5', 1.7)}
              Filtros
            </p>
            <button
              type="button"
              id="catalog-clear-filters"
              class="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              ${icons.x('h-3.5 w-3.5', 1.8)}
              Limpar
            </button>
          </div>

          <div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <select aria-label="Tipo de imóvel" data-filter="type" class="${selectClass}">
              <option value="any" ${!filters.type ? 'selected' : ''}>Todos os tipos</option>
              ${PROPERTY_TYPES.map(
                (item) =>
                  `<option value="${escapeHtml(item.value)}" ${
                    filters.type === item.value ? 'selected' : ''
                  }>${escapeHtml(item.label)}</option>`
              ).join('')}
            </select>

            <input
              type="text"
              aria-label="Bairro"
              data-filter="neighborhood"
              value="${escapeHtml(filters.neighborhood || '')}"
              placeholder="Bairro"
              class="${inputClass}"
            />

            <input
              type="number"
              aria-label="Valor mínimo"
              data-filter="min"
              value="${filters.min ?? ''}"
              placeholder="${isRent ? 'Aluguel mínimo (R$)' : 'Valor mínimo (R$)'}"
              class="${inputClass}"
            />

            <input
              type="number"
              aria-label="Valor máximo"
              data-filter="max"
              value="${filters.max ?? ''}"
              placeholder="${isRent ? 'Aluguel máximo (R$)' : 'Valor máximo (R$)'}"
              class="${inputClass}"
            />

            <select aria-label="Quartos" data-filter="bedrooms" class="${selectClass}">
              <option value="any" ${!filters.bedrooms ? 'selected' : ''}>Quartos: qualquer</option>
              ${ROOM_OPTIONS.map(
                (n) =>
                  `<option value="${n}" ${filters.bedrooms === n ? 'selected' : ''}>Quartos: ${n}+</option>`
              ).join('')}
            </select>

            <select aria-label="Suítes" data-filter="suites" class="${selectClass}">
              <option value="any" ${!filters.suites ? 'selected' : ''}>Suítes: qualquer</option>
              ${ROOM_OPTIONS.map(
                (n) =>
                  `<option value="${n}" ${filters.suites === n ? 'selected' : ''}>Suítes: ${n}+</option>`
              ).join('')}
            </select>

            <select aria-label="Vagas" data-filter="parking" class="${selectClass}">
              <option value="any" ${!filters.parking ? 'selected' : ''}>Vagas: qualquer</option>
              ${ROOM_OPTIONS.map(
                (n) =>
                  `<option value="${n}" ${filters.parking === n ? 'selected' : ''}>Vagas: ${n}+</option>`
              ).join('')}
            </select>

            ${
              isRent
                ? `<input
                    type="number"
                    aria-label="Condomínio até"
                    data-filter="condoMax"
                    value="${filters.condoMax ?? ''}"
                    placeholder="Condomínio até (R$)"
                    class="${inputClass}"
                  />`
                : `<input
                    type="number"
                    aria-label="Área mínima"
                    data-filter="minArea"
                    value="${filters.minArea ?? ''}"
                    placeholder="Área mínima (m²)"
                    class="${inputClass}"
                  />`
            }

            <input
              type="text"
              aria-label="Código do imóvel"
              data-filter="code"
              value="${escapeHtml(filters.code || '')}"
              placeholder="Código (ex.: SOL-1042)"
              class="${inputClass}"
            />

            ${
              isRent
                ? `<input
                    type="number"
                    aria-label="Área mínima"
                    data-filter="minArea"
                    value="${filters.minArea ?? ''}"
                    placeholder="Área mínima (m²)"
                    class="${inputClass}"
                  />`
                : ''
            }
          </div>

          <p id="catalog-filter-count" class="mt-4 text-[12px] tabular-nums text-muted-foreground">
            ${countLabel}
          </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h2 id="catalog-heading-count" class="text-[17px] font-medium tabular-nums text-primary">
            ${availLabel}
          </h2>

          <select
            aria-label="Ordenar imóveis"
            id="catalog-sort-select"
            class="h-10 w-[190px] rounded-xl border border-input bg-background px-3 text-[13px] text-ink outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="recentes" ${!filters.sort ? 'selected' : ''}>Mais recentes</option>
            <option value="menor_preco" ${filters.sort === 'menor_preco' ? 'selected' : ''}>
              ${isRent ? 'Menor aluguel' : 'Menor preço'}
            </option>
            <option value="maior_preco" ${filters.sort === 'maior_preco' ? 'selected' : ''}>
              ${isRent ? 'Maior aluguel' : 'Maior preço'}
            </option>
            <option value="area" ${filters.sort === 'area' ? 'selected' : ''}>Maior área</option>
          </select>
        </div>

        <div id="catalog-grid-container">
          ${renderPropertyGrid(filtered)}
        </div>
      </div>
    </div>
  `;
}

export function mountCatalogPage(root, { purpose = 'venda', params = new URLSearchParams() }) {
  const filterBar = root.querySelector('#catalog-filter-bar');
  const clearBtn = root.querySelector('#catalog-clear-filters');
  const sortSelect = root.querySelector('#catalog-sort-select');
  const filterCountEl = root.querySelector('#catalog-filter-count');
  const headingCountEl = root.querySelector('#catalog-heading-count');
  const gridContainer = root.querySelector('#catalog-grid-container');
  if (!filterBar || !gridContainer) return;

  const filters = readFiltersFromParams(params);
  const properties = getAvailableProperties();
  const basePath = purpose === 'aluguel' ? '/alugar' : '/comprar';

  function syncUrlAndRender() {
    const nextParams = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') {
        nextParams.set(k, String(v));
      }
    });
    const qs = nextParams.toString();
    const targetHash = `#${basePath}${qs ? `?${qs}` : ''}`;
    window.history.replaceState(null, '', targetHash);

    const filtered = filterProperties(properties, purpose, filters);
    if (filterCountEl) {
      filterCountEl.textContent =
        filtered.length === 1 ? '1 imóvel encontrado' : `${filtered.length} imóveis encontrados`;
    }
    if (headingCountEl) {
      headingCountEl.textContent =
        filtered.length === 1 ? '1 imóvel disponível' : `${filtered.length} imóveis disponíveis`;
    }
    gridContainer.innerHTML = renderPropertyGrid(filtered);
    mountSmartImages(gridContainer);
  }

  filterBar.querySelectorAll('[data-filter]').forEach((el) => {
    const key = el.getAttribute('data-filter');
    const isSelect = el.tagName === 'SELECT';
    const isNumeric = ['min', 'max', 'bedrooms', 'suites', 'parking', 'condoMax', 'minArea'].includes(
      key
    );

    const handler = () => {
      const raw = el.value;
      if (isSelect && raw === 'any') {
        filters[key] = undefined;
      } else if (isNumeric) {
        filters[key] = raw ? Number(raw) : undefined;
      } else {
        filters[key] = raw || undefined;
      }
      syncUrlAndRender();
    };

    el.addEventListener(isSelect ? 'change' : 'input', handler);
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      filters.sort = sortSelect.value === 'recentes' ? undefined : sortSelect.value;
      syncUrlAndRender();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Object.keys(filters).forEach((k) => {
        filters[k] = undefined;
      });
      filterBar.querySelectorAll('[data-filter]').forEach((el) => {
        el.value = el.tagName === 'SELECT' ? 'any' : '';
      });
      if (sortSelect) sortSelect.value = 'recentes';
      syncUrlAndRender();
    });
  }
}
