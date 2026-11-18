import { mountLeadForm, renderLeadForm } from '../components/LeadForm.js';
import { renderPropertyGrid } from '../components/PropertyGrid.js';
import { renderSectionHeader } from '../components/SectionHeader.js';
import { mountSmartImages, renderSmartImage } from '../components/SmartImage.js';
import { IMAGE_CATEGORIES } from '../data/catalog.js';
import { escapeHtml, routeHref } from '../utils/dom.js';
import {
  formatCurrency,
  formatNumberWithSuffix,
  formatPropertyPrice,
  getPropertyTypeLabel,
  inferImageCategory,
} from '../utils/formatters.js';
import { icons } from '../utils/icons.js';
import {
  buildPropertyWhatsappMessage,
  getAvailableProperties,
  getSiteSettings,
  whatsappUrl,
} from '../utils/store.js';

const MAJOR_SECTION_HEADINGS = new Set([
  'INFRAESTRUTURA DO CONDOMÍNIO',
  'SEGURANÇA E TECNOLOGIA',
  'SUSTENTABILIDADE E EFICIÊNCIA',
  'LOCALIZAÇÃO',
]);

const SUBSECTION_HEADINGS = new Set([
  'Lazer, convivência e bem-estar',
  'Trabalho e convivência',
  'Serviços e conveniências',
]);

function renderSpecRow(iconHtml, label, value) {
  if (value == null || value === '' || value === '—' || value === 0) return '';
  return `
    <div class="flex items-center gap-2.5">
      ${iconHtml}
      <span class="text-[13px] tabular-nums text-ink/75">
        ${escapeHtml(label)}: <strong class="font-medium text-primary">${escapeHtml(value)}</strong>
      </span>
    </div>
  `;
}

function renderStructuredDescription(text) {
  const lines = String(text || '').split('\n');
  const htmlParts = [];
  let bullets = [];

  const flushBullets = () => {
    if (!bullets.length) return;
    htmlParts.push(`
      <ul class="mt-2.5 grid gap-2 sm:grid-cols-2">
        ${bullets
          .map(
            (item) => `
              <li class="flex items-start gap-2 text-[13.5px] text-ink/75">
                ${icons.check('mt-0.5 h-3.5 w-3.5 shrink-0 text-gold', 2)}
                <span>${escapeHtml(item)}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    `);
    bullets = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushBullets();
      return;
    }
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2).trim());
      return;
    }
    flushBullets();
    if (MAJOR_SECTION_HEADINGS.has(line)) {
      htmlParts.push(`
        <h3 class="mt-7 border-t border-border/70 pt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-primary">
          ${escapeHtml(line)}
        </h3>
      `);
    } else if (SUBSECTION_HEADINGS.has(line)) {
      htmlParts.push(`
        <h4 class="mt-4 text-[14px] font-medium text-primary">
          ${escapeHtml(line)}
        </h4>
      `);
    } else {
      htmlParts.push(`
        <p class="mt-2.5 text-[14px] leading-relaxed text-ink/75">
          ${escapeHtml(line)}
        </p>
      `);
    }
  });

  flushBullets();
  return `<div>${htmlParts.join('')}</div>`;
}

function buildGalleryItems(images, imageCategories) {
  return (images || [])
    .map((src, idx) => ({
      src,
      category: imageCategories?.[idx] || inferImageCategory(src),
    }))
    .filter((item) => Boolean(item.src));
}

function renderGalleryHtml(items, title) {
  if (!items.length) {
    return `
      <div class="flex h-[240px] w-full max-w-[640px] items-center justify-center rounded-2xl border border-border bg-secondary text-[13px] text-muted-foreground sm:h-[320px]">
        Fotografias em breve
      </div>
    `;
  }

  const first = items[0];
  const firstLabel = IMAGE_CATEGORIES.find((c) => c.value === first.category)?.label;

  return `
    <div id="property-gallery" class="w-full max-w-[620px]">
      <div class="relative h-[230px] w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary/70 sm:h-[300px] lg:h-[350px]">
        <div id="gallery-main-stage" class="h-full w-full">
          ${renderSmartImage({
            src: first.src,
            alt: `${title} — foto 1`,
            fit: 'contain',
            className: 'h-full w-full',
          })}
        </div>

        <span
          id="gallery-category-badge"
          class="${
            firstLabel ? '' : 'hidden '
          }absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-primary shadow-sm"
        >
          ${escapeHtml(firstLabel || '')}
        </span>

        ${
          items.length > 1
            ? `
              <button
                type="button"
                id="gallery-prev-btn"
                aria-label="Foto anterior"
                class="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md transition-colors hover:bg-background"
              >
                ${icons.chevronLeft('h-5 w-5', 1.8)}
              </button>
              <button
                type="button"
                id="gallery-next-btn"
                aria-label="Próxima foto"
                class="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md transition-colors hover:bg-background"
              >
                ${icons.chevronRight('h-5 w-5', 1.8)}
              </button>
              <span
                id="gallery-counter"
                class="absolute bottom-3 right-3 rounded-md bg-primary/85 px-2.5 py-1 text-[11px] font-medium tabular-nums text-primary-foreground"
              >
                1 / ${items.length}
              </span>
            `
            : ''
        }
      </div>

      ${
        items.length > 1
          ? `
            <div id="gallery-thumbs" class="mt-2.5 flex w-full gap-2 overflow-x-auto pb-1">
              ${items
                .map(
                  (item, idx) => `
                    <button
                      type="button"
                      data-gallery-thumb="${idx}"
                      aria-label="Ver foto ${idx + 1}"
                      class="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-14 sm:w-20 ${
                        idx === 0
                          ? 'border-gold'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }"
                    >
                      ${renderSmartImage({ src: item.src, alt: '', className: 'h-full w-full' })}
                    </button>
                  `
                )
                .join('')}
            </div>
          `
          : ''
      }
    </div>
  `;
}

function buildGroupedPhotos(images, imageCategories) {
  return IMAGE_CATEGORIES.map((cat) => ({
    key: cat.value,
    label: cat.label,
    subtitle: cat.subtitle,
    photos: (images || []).filter(
      (src, idx) => (imageCategories?.[idx] || inferImageCategory(src)) === cat.value
    ),
  })).filter((group) => group.photos.length > 0);
}

function renderCategorizedSectionHtml(images, imageCategories, title) {
  const grouped = buildGroupedPhotos(images, imageCategories);
  const hasExplicit = Boolean(imageCategories && imageCategories.length > 0);
  if (grouped.length === 0 || (grouped.length < 2 && !hasExplicit)) {
    return '';
  }

  return `
    <section id="categorized-photos-section" class="mt-16 border-t border-border pt-12">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Galeria organizada</p>
          <h2 class="mt-2 text-[22px] text-primary sm:text-[26px]">Fotos por ambiente</h2>
        </div>

        <div class="flex flex-wrap gap-1.5" role="tablist" aria-label="Categorias de fotos">
          <button
            type="button"
            role="tab"
            data-cat-tab="all"
            aria-selected="true"
            class="min-h-[38px] whitespace-nowrap rounded-lg border px-3.5 text-[12px] font-medium transition-colors border-primary bg-primary text-primary-foreground"
          >
            Todas (${images.length})
          </button>
          ${grouped
            .map(
              (group) => `
                <button
                  type="button"
                  role="tab"
                  data-cat-tab="${escapeHtml(group.key)}"
                  aria-selected="false"
                  class="min-h-[38px] whitespace-nowrap rounded-lg border px-3.5 text-[12px] font-medium transition-colors border-border bg-card text-muted-foreground hover:text-primary"
                >
                  ${escapeHtml(group.label)} (${group.photos.length})
                </button>
              `
            )
            .join('')}
        </div>
      </div>

      <div id="categorized-groups-container" class="mt-8 space-y-10">
        ${renderPhotoGroupsHtml(grouped, title)}
      </div>

      <div
        id="photo-lightbox"
        class="hidden fixed inset-0 z-50 flex items-center justify-center bg-primary/90 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Visualização ampliada da fotografia"
      >
        <button
          type="button"
          id="lightbox-close-btn"
          aria-label="Fechar visualização"
          class="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/15 text-white transition-colors hover:bg-background/25"
        >
          ${icons.x('h-5 w-5', 1.8)}
        </button>

        <div class="relative flex w-full max-w-3xl flex-col items-center">
          <div class="relative h-[60dvh] w-full overflow-hidden rounded-2xl bg-black/40 sm:h-[70dvh]">
            <div id="lightbox-stage" class="h-full w-full"></div>

            <button
              type="button"
              id="lightbox-prev-btn"
              aria-label="Foto anterior"
              class="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md hover:bg-background"
            >
              ${icons.chevronLeft('h-5 w-5', 1.8)}
            </button>
            <button
              type="button"
              id="lightbox-next-btn"
              aria-label="Próxima foto"
              class="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md hover:bg-background"
            >
              ${icons.chevronRight('h-5 w-5', 1.8)}
            </button>
          </div>

          <p id="lightbox-caption" class="mt-3 text-[13px] tabular-nums text-white/85"></p>
        </div>
      </div>
    </section>
  `;
}

function renderPhotoGroupsHtml(groups, title) {
  return groups
    .map(
      (group) => `
        <div>
          <div class="mb-4 flex items-baseline justify-between gap-2">
            <div>
              <h3 class="text-[17px] font-medium text-primary">${escapeHtml(group.label)}</h3>
              <p class="text-[12.5px] text-muted-foreground">${escapeHtml(group.subtitle)}</p>
            </div>
            <span class="text-[12px] tabular-nums text-muted-foreground">
              ${group.photos.length} ${group.photos.length === 1 ? 'foto' : 'fotos'}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            ${group.photos
              .map(
                (photoSrc, idx) => `
                  <div>
                    <button
                      type="button"
                      data-lightbox-group="${escapeHtml(group.key)}"
                      data-lightbox-index="${idx}"
                      aria-label="Ampliar foto ${idx + 1} de ${escapeHtml(group.label)}"
                      class="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/70 bg-secondary text-left transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      ${renderSmartImage({
                        src: photoSrc,
                        alt: `${title} — ${group.label} ${idx + 1}`,
                        className: 'h-full w-full transition-transform duration-300 group-hover:scale-[1.04]',
                      })}
                    </button>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
    )
    .join('');
}

export function renderPropertyDetailPage(propertyId) {
  const settings = getSiteSettings();
  const properties = getAvailableProperties();
  const property = properties.find((item) => item.id === propertyId);

  if (!property) {
    return `
      <div class="container-page py-24 text-center">
        <h1 class="text-[28px] text-primary">Imóvel não encontrado</h1>
        <p class="mt-3 text-[14px] text-muted-foreground">
          O imóvel solicitado não está mais disponível ou o link foi alterado.
        </p>
        <a
          href="${routeHref('/comprar')}"
          class="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-medium text-primary-foreground"
        >
          Ver catálogo disponível
        </a>
      </div>
    `;
  }

  const galleryImages = property.images?.length
    ? property.images
    : property.cover_image
    ? [property.cover_image]
    : [];
  const galleryItems = buildGalleryItems(galleryImages, property.image_categories);
  const similar = properties
    .filter((item) => item.id !== property.id && item.purpose === property.purpose)
    .slice(0, 3);

  const mapsQuery = encodeURIComponent(
    `${property.address || property.neighborhood}, ${property.city}, ${property.state || 'Bahia'}`
  );
  const waHref = whatsappUrl(buildPropertyWhatsappMessage(property), settings.whatsapp);

  return `
    <div class="container-page py-8 sm:py-10">
      <a
        href="${routeHref(property.purpose === 'aluguel' ? '/alugar' : '/comprar')}"
        class="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ${icons.arrowLeft('h-3.5 w-3.5', 1.7)}
        Voltar para ${property.purpose === 'aluguel' ? 'aluguéis' : 'imóveis à venda'}
      </a>

      <div class="mt-5 grid gap-10 lg:grid-cols-[1.55fr_1fr]">
        <div class="min-w-0">
          ${renderGalleryHtml(galleryItems, property.title)}

          <div class="mt-7">
            <div class="flex flex-wrap items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-gold">
              <span>${property.purpose === 'aluguel' ? 'Aluguel' : 'Venda'}</span>
              <span aria-hidden="true" class="text-border">·</span>
              <span>${escapeHtml(getPropertyTypeLabel(property.property_type))}</span>
              ${
                property.code
                  ? `
                    <span aria-hidden="true" class="text-border">·</span>
                    <span class="tabular-nums text-muted-foreground">
                      Código ${escapeHtml(property.code)}
                    </span>
                  `
                  : ''
              }
            </div>

            <h1 class="mt-3 text-[26px] leading-tight text-primary sm:text-[34px]">
              ${escapeHtml(property.title)}
            </h1>

            <p class="mt-2 flex items-center gap-1.5 text-[13.5px] text-muted-foreground">
              ${icons.mapPin('h-4 w-4 text-gold', 1.6)}
              ${escapeHtml(property.neighborhood)}, ${escapeHtml(property.city)} — ${escapeHtml(property.state || 'Bahia')}
            </p>
          </div>

          <div class="mt-7 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
            ${renderSpecRow(
              icons.maximize('h-4 w-4 shrink-0 text-gold', 1.5),
              'Área construída',
              property.built_area ? formatNumberWithSuffix(property.built_area, ' m²') : null
            )}
            ${renderSpecRow(
              icons.maximize('h-4 w-4 shrink-0 text-gold', 1.5),
              'Área total',
              property.total_area ? formatNumberWithSuffix(property.total_area, ' m²') : null
            )}
            ${renderSpecRow(icons.bedDouble('h-4 w-4 shrink-0 text-gold', 1.5), 'Quartos', property.bedrooms)}
            ${renderSpecRow(icons.bedDouble('h-4 w-4 shrink-0 text-gold', 1.5), 'Suítes', property.suites)}
            ${renderSpecRow(icons.bath('h-4 w-4 shrink-0 text-gold', 1.5), 'Banheiros', property.bathrooms)}
            ${renderSpecRow(icons.car('h-4 w-4 shrink-0 text-gold', 1.5), 'Vagas', property.parking_spots)}
            ${renderSpecRow(
              icons.building2('h-4 w-4 shrink-0 text-gold', 1.5),
              'Condomínio',
              property.condo_fee ? formatCurrency(property.condo_fee) : null
            )}
            ${renderSpecRow(
              icons.building2('h-4 w-4 shrink-0 text-gold', 1.5),
              'IPTU',
              property.iptu ? formatCurrency(property.iptu) : null
            )}
            ${renderSpecRow(
              icons.building2('h-4 w-4 shrink-0 text-gold', 1.5),
              'Outras despesas',
              property.other_fees ? formatCurrency(property.other_fees) : null
            )}
          </div>

          ${
            property.description
              ? `<div class="mt-9">
                  <h2 class="text-[17px] font-medium text-primary">Sobre o imóvel</h2>
                  ${renderStructuredDescription(property.description)}
                </div>`
              : ''
          }

          ${
            property.features && property.features.length > 0
              ? `<div class="mt-9">
                  <h2 class="text-[17px] font-medium text-primary">Condomínio e diferenciais</h2>
                  <ul class="mt-4 grid gap-2.5 sm:grid-cols-2">
                    ${property.features
                      .map(
                        (feat) => `
                          <li class="flex items-start gap-2 text-[13.5px] text-ink/75">
                            ${icons.check('mt-0.5 h-4 w-4 shrink-0 text-gold', 2)}
                            ${escapeHtml(feat)}
                          </li>
                        `
                      )
                      .join('')}
                  </ul>
                </div>`
              : ''
          }

          <div class="mt-9">
            <h2 class="text-[17px] font-medium text-primary">Localização</h2>
            <p class="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              ${escapeHtml(property.neighborhood)}, ${escapeHtml(property.city)} — ${escapeHtml(property.state || 'Bahia')}.${
                property.address ? ` ${escapeHtml(property.address)}.` : ''
              } O endereço completo da unidade é confirmado pelo corretor responsável durante o atendimento.
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}"
              target="_blank"
              rel="noreferrer"
              class="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary underline underline-offset-4"
            >
              ${icons.mapPin('h-4 w-4', 1.6)}
              Ver no mapa
            </a>
          </div>
        </div>

        <aside class="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div class="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_-40px_rgba(14,42,68,0.6)]">
            <p class="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              ${property.purpose === 'aluguel' ? 'Valor do aluguel' : 'Valor de venda'}
            </p>
            <p class="mt-1 font-heading text-[27px] tabular-nums text-primary">
              ${escapeHtml(formatPropertyPrice(property))}
            </p>
            ${
              property.purpose === 'aluguel' && property.condo_fee
                ? `<p class="text-[12px] tabular-nums text-muted-foreground">
                    + condomínio ${escapeHtml(formatCurrency(property.condo_fee))}
                  </p>`
                : ''
            }

            <a
              href="${escapeHtml(waHref)}"
              target="_blank"
              rel="noreferrer"
              class="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-success text-[13.5px] font-medium text-success-foreground transition-opacity hover:opacity-90"
            >
              ${icons.messageCircle('h-4 w-4', 1.8)}
              Falar no WhatsApp
            </a>

            <div class="mt-5 border-t border-border pt-5">
              <p class="text-[13px] font-medium text-primary">Fale com um consultor</p>
              <p class="mt-1 text-[12px] text-muted-foreground">
                Receba mais fotos, valores atualizados e agende uma visita.
              </p>
              <div class="mt-4">
                ${renderLeadForm({ formId: 'property-lead-form', property })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      ${renderCategorizedSectionHtml(galleryImages, property.image_categories, property.title)}

      ${
        similar.length > 0
          ? `<section class="mt-20">
              ${renderSectionHeader({
                eyebrow: 'Veja também',
                title: 'Imóveis semelhantes',
                actionTo: property.purpose === 'aluguel' ? '/alugar' : '/comprar',
                actionLabel: 'Ver todos',
              })}
              ${renderPropertyGrid(similar)}
            </section>`
          : ''
      }
    </div>
  `;
}

export function mountPropertyDetailPage(root, propertyId) {
  const properties = getAvailableProperties();
  const property = properties.find((item) => item.id === propertyId);
  if (!property) return () => {};

  mountLeadForm(root, { formId: 'property-lead-form', property });

  const galleryImages = property.images?.length
    ? property.images
    : property.cover_image
    ? [property.cover_image]
    : [];
  const galleryItems = buildGalleryItems(galleryImages, property.image_categories);

  let activeIndex = 0;
  const stageEl = root.querySelector('#gallery-main-stage');
  const badgeEl = root.querySelector('#gallery-category-badge');
  const counterEl = root.querySelector('#gallery-counter');
  const prevBtn = root.querySelector('#gallery-prev-btn');
  const nextBtn = root.querySelector('#gallery-next-btn');
  const thumbBtns = root.querySelectorAll('[data-gallery-thumb]');

  function setGalleryIndex(idx) {
    if (!galleryItems.length) return;
    activeIndex = (idx + galleryItems.length) % galleryItems.length;
    const current = galleryItems[activeIndex];
    const catLabel = IMAGE_CATEGORIES.find((c) => c.value === current.category)?.label;

    if (stageEl) {
      stageEl.innerHTML = renderSmartImage({
        src: current.src,
        alt: `${property.title} — foto ${activeIndex + 1}`,
        fit: 'contain',
        className: 'h-full w-full',
      });
      mountSmartImages(stageEl);
    }
    if (badgeEl) {
      badgeEl.textContent = catLabel || '';
      badgeEl.classList.toggle('hidden', !catLabel);
    }
    if (counterEl) {
      counterEl.textContent = `${activeIndex + 1} / ${galleryItems.length}`;
    }
    thumbBtns.forEach((btn) => {
      const i = Number(btn.getAttribute('data-gallery-thumb'));
      btn.className = `relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-14 sm:w-20 ${
        i === activeIndex
          ? 'border-gold'
          : 'border-transparent opacity-75 hover:opacity-100'
      }`;
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => setGalleryIndex(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setGalleryIndex(activeIndex + 1));
  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setGalleryIndex(Number(btn.getAttribute('data-gallery-thumb')));
    });
  });

  // Categorized gallery + lightbox
  const grouped = buildGroupedPhotos(galleryImages, property.image_categories);
  const catSection = root.querySelector('#categorized-photos-section');
  const groupsContainer = root.querySelector('#categorized-groups-container');
  const lightboxEl = root.querySelector('#photo-lightbox');
  const lightboxStage = root.querySelector('#lightbox-stage');
  const lightboxCaption = root.querySelector('#lightbox-caption');
  const lightboxCloseBtn = root.querySelector('#lightbox-close-btn');
  const lightboxPrevBtn = root.querySelector('#lightbox-prev-btn');
  const lightboxNextBtn = root.querySelector('#lightbox-next-btn');

  let lightboxState = null;

  function renderLightbox() {
    if (!lightboxEl || !lightboxStage || !lightboxCaption) return;
    if (!lightboxState) {
      lightboxEl.classList.add('hidden');
      return;
    }
    lightboxEl.classList.remove('hidden');
    const item = lightboxState.items[lightboxState.index];
    lightboxStage.innerHTML = renderSmartImage({
      src: item.src,
      alt: `${property.title} — ${item.cat}`,
      fit: 'contain',
      className: 'h-full w-full',
    });
    mountSmartImages(lightboxStage);
    lightboxCaption.textContent = `${item.cat} · ${lightboxState.index + 1} / ${lightboxState.items.length}`;
    const multi = lightboxState.items.length > 1;
    if (lightboxPrevBtn) lightboxPrevBtn.classList.toggle('hidden', !multi);
    if (lightboxNextBtn) lightboxNextBtn.classList.toggle('hidden', !multi);
  }

  function bindLightboxTriggers() {
    if (!groupsContainer) return;
    groupsContainer.querySelectorAll('[data-lightbox-group]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-lightbox-group');
        const idx = Number(btn.getAttribute('data-lightbox-index') || 0);
        const group = grouped.find((g) => g.key === key);
        if (!group) return;
        lightboxState = {
          items: group.photos.map((src) => ({ src, cat: group.label })),
          index: idx,
        };
        renderLightbox();
      });
    });
  }

  bindLightboxTriggers();

  if (catSection && groupsContainer) {
    const tabBtns = catSection.querySelectorAll('[data-cat-tab]');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-cat-tab') || 'all';
        tabBtns.forEach((t) => {
          const isActive = t.getAttribute('data-cat-tab') === selected;
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
          t.className = `min-h-[38px] whitespace-nowrap rounded-lg border px-3.5 text-[12px] font-medium transition-colors ${
            isActive
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-muted-foreground hover:text-primary'
          }`;
        });
        const visible = selected === 'all' ? grouped : grouped.filter((g) => g.key === selected);
        groupsContainer.innerHTML = renderPhotoGroupsHtml(visible, property.title);
        mountSmartImages(groupsContainer);
        bindLightboxTriggers();
      });
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightboxState = null;
      renderLightbox();
    });
  }
  if (lightboxEl) {
    lightboxEl.addEventListener('click', (event) => {
      if (event.target === lightboxEl) {
        lightboxState = null;
        renderLightbox();
      }
    });
  }
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      if (!lightboxState) return;
      lightboxState.index =
        (lightboxState.index - 1 + lightboxState.items.length) % lightboxState.items.length;
      renderLightbox();
    });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      if (!lightboxState) return;
      lightboxState.index = (lightboxState.index + 1) % lightboxState.items.length;
      renderLightbox();
    });
  }

  const onKeyDown = (event) => {
    if (!lightboxState) return;
    if (event.key === 'Escape') {
      lightboxState = null;
      renderLightbox();
    } else if (event.key === 'ArrowRight') {
      lightboxState.index = (lightboxState.index + 1) % lightboxState.items.length;
      renderLightbox();
    } else if (event.key === 'ArrowLeft') {
      lightboxState.index =
        (lightboxState.index - 1 + lightboxState.items.length) % lightboxState.items.length;
      renderLightbox();
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}
