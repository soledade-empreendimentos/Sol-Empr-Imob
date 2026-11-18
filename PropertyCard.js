import { escapeHtml, routeHref } from '../utils/dom.js';
import {
  formatCurrency,
  formatNumberWithSuffix,
  formatPropertyPrice,
  getPropertyTypeLabel,
} from '../utils/formatters.js';
import { icons } from '../utils/icons.js';
import { renderSmartImage } from './SmartImage.js';

export function renderPropertyCard(property) {
  const coverImage =
    property.cover_image || (Array.isArray(property.images) ? property.images[0] : '') || '';

  let roomsHtml = '';
  if (property.bedrooms != null && property.bedrooms > 0) {
    roomsHtml = `
      <span class="inline-flex items-center gap-1.5">
        ${icons.bedDouble('h-3.5 w-3.5 text-[#8C9AAE]', 1.6)}
        ${property.bedrooms}
      </span>
    `;
  } else if (property.suites != null && property.suites > 0) {
    roomsHtml = `
      <span class="inline-flex items-center gap-1.5">
        ${icons.bedDouble('h-3.5 w-3.5 text-[#8C9AAE]', 1.6)}
        ${property.suites} ${property.suites === 1 ? 'suíte' : 'suítes'}
      </span>
    `;
  }

  return `
    <div class="h-full">
      <a
        href="${routeHref(`/imovel/${property.id}`)}"
        class="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-[#152238]/25 hover:shadow-[0_24px_60px_-40px_rgba(21,34,56,0.45)]"
      >
        <div class="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F0EA]">
          <div class="h-full w-full">
            ${renderSmartImage({
              src: coverImage,
              alt: property.title,
              className: 'transition-transform duration-500 ease-out group-hover:scale-[1.03]',
            })}
          </div>

          <div class="absolute left-3 top-3 flex gap-2">
            <span class="rounded-md bg-[#F3F0EA]/95 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#152238] shadow-sm">
              ${property.purpose === 'aluguel' ? 'Aluguel' : 'Venda'}
            </span>
            ${
              property.featured
                ? `<span class="rounded-md bg-[#152238] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#CDB386] shadow-sm">
                    Destaque
                  </span>`
                : ''
            }
          </div>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B39565]">
            ${escapeHtml(getPropertyTypeLabel(property.property_type))}${
              property.code ? ` · ${escapeHtml(property.code)}` : ''
            }
          </p>

          <h3 class="mt-2 line-clamp-2 text-[19px] font-medium leading-snug text-[#152238] transition-colors group-hover:text-[#152238]/80">
            ${escapeHtml(property.title)}
          </h3>

          <p class="mt-2 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            ${icons.mapPin('h-3.5 w-3.5 shrink-0 text-[#B39565]', 1.7)}
            <span class="truncate">
              ${escapeHtml(property.neighborhood)}, ${escapeHtml(property.city)}
            </span>
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/70 pt-3.5 text-[12px] tabular-nums text-ink/75">
            ${roomsHtml}
            ${
              property.bathrooms != null && property.bathrooms > 0
                ? `<span class="inline-flex items-center gap-1.5">
                    ${icons.bath('h-3.5 w-3.5 text-[#8C9AAE]', 1.6)}
                    ${property.bathrooms}
                  </span>`
                : ''
            }
            ${
              property.parking_spots != null && property.parking_spots > 0
                ? `<span class="inline-flex items-center gap-1.5">
                    ${icons.car('h-3.5 w-3.5 text-[#8C9AAE]', 1.6)}
                    ${property.parking_spots}
                  </span>`
                : ''
            }
            ${
              property.built_area || property.total_area
                ? `<span class="inline-flex items-center gap-1.5">
                    ${icons.maximize('h-3.5 w-3.5 text-[#8C9AAE]', 1.6)}
                    ${escapeHtml(formatNumberWithSuffix(property.built_area || property.total_area, ' m²'))}
                  </span>`
                : ''
            }
          </div>

          <div class="mt-auto pt-4">
            <p class="font-heading text-[22px] font-semibold tabular-nums text-[#152238]">
              ${escapeHtml(formatPropertyPrice(property))}
            </p>
            ${
              property.purpose === 'aluguel' && property.condo_fee
                ? `<p class="mt-0.5 text-[11.5px] tabular-nums text-muted-foreground">
                    Condomínio ${escapeHtml(formatCurrency(property.condo_fee))}
                  </p>`
                : ''
            }
          </div>
        </div>
      </a>
    </div>
  `;
}
