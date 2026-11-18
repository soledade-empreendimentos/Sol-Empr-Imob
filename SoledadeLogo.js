export function renderSoledadeMark(variant = 'light', className = 'h-9 w-auto') {
  const frameStroke = variant === 'dark' ? '#CDB386' : '#152238';
  const barFill = variant === 'dark' ? '#CDB386' : '#B39565';

  return `
    <svg
      viewBox="0 0 44 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      class="${className}"
    >
      <rect x="1.5" y="1.5" width="41" height="65" stroke="${frameStroke}" stroke-width="1.9" />
      <rect x="6" y="6" width="32" height="56" stroke="${frameStroke}" stroke-width="1.25" />
      <rect x="9.8" y="29" width="5.8" height="33" fill="${barFill}" />
      <rect x="19.1" y="16" width="5.8" height="46" fill="${barFill}" />
      <rect x="28.4" y="38.5" width="5.8" height="23.5" fill="${barFill}" />
    </svg>
  `;
}

export function renderSoledadeLogo({
  variant = 'light',
  showSubtitle = false,
  compact = false,
} = {}) {
  const titleColor = variant === 'dark' ? 'text-[#F3F0EA]' : 'text-[#152238]';
  const subtitleColor = variant === 'dark' ? 'text-[#CDB386]' : 'text-[#B39565]';

  return `
    <span class="inline-flex shrink-0 items-center gap-3">
      ${renderSoledadeMark(variant, compact ? 'h-8 w-auto shrink-0' : 'h-10 w-auto shrink-0')}
      <span class="flex flex-col leading-none">
        <span class="font-heading whitespace-nowrap font-medium tracking-[-0.01em] ${
          compact ? 'text-[24px]' : 'text-[28px]'
        } ${titleColor}">
          Soledade
        </span>
        ${
          showSubtitle
            ? `<span class="mt-1.5 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.28em] ${subtitleColor}">
                Corretor de Imóveis
              </span>`
            : ''
        }
      </span>
    </span>
  `;
}
