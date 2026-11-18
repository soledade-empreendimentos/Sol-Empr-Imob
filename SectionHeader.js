import { escapeHtml, routeHref } from '../utils/dom.js';
import { icons } from '../utils/icons.js';

export function renderSectionHeader({
  eyebrow,
  title,
  description,
  actionTo,
  actionLabel,
  align = 'left',
}) {
  return `
    <div class="flex flex-col gap-5 ${
      align === 'center'
        ? 'items-center text-center'
        : 'sm:flex-row sm:items-end sm:justify-between'
    }">
      <div class="${align === 'center' ? 'max-w-2xl' : 'max-w-xl'}">
        ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}
        <h2 class="mt-3 text-[28px] font-medium leading-tight text-[#152238] sm:text-[36px]">
          ${escapeHtml(title)}
        </h2>
        ${
          description
            ? `<p class="mt-3 text-[14px] leading-relaxed text-muted-foreground">${escapeHtml(description)}</p>`
            : ''
        }
      </div>

      ${
        actionTo && actionLabel
          ? `<div>
              <a
                href="${routeHref(actionTo)}"
                class="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[13px] font-medium text-[#152238]"
              >
                ${escapeHtml(actionLabel)}
                ${icons.arrowRight('h-4 w-4 text-[#B39565] transition-transform duration-200 group-hover:translate-x-0.5', 1.7)}
              </a>
            </div>`
          : ''
      }
    </div>
  `;
}
