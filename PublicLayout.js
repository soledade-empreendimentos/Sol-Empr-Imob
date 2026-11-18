import { escapeHtml, routeHref } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getSiteSettings, whatsappUrl } from '../utils/store.js';
import { renderSoledadeLogo } from './SoledadeLogo.js';

const NAV_LINKS = [
  { label: 'Início', to: '/' },
  { label: 'Comprar', to: '/comprar' },
  { label: 'Alugar', to: '/alugar' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
];

export function renderPublicLayout({ currentPath = '/', contentHtml = '' }) {
  const settings = getSiteSettings();
  const waHref = whatsappUrl();
  const year = new Date().getFullYear();

  const isNavActive = (to) => (to === '/' ? currentPath === '/' : currentPath.startsWith(to));

  return `
    <div class="flex min-h-screen flex-col bg-background">
      <header class="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div class="container-page flex h-[76px] items-center justify-between gap-8">
          <a
            href="${routeHref('/')}"
            class="shrink-0"
            aria-label="Soledade — Página inicial"
            data-close-mobile-menu="true"
          >
            ${renderSoledadeLogo({ variant: 'light', compact: true })}
          </a>

          <nav class="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            ${NAV_LINKS.map((item) => {
              const active = isNavActive(item.to);
              return `
                <a
                  href="${routeHref(item.to)}"
                  class="shrink-0 whitespace-nowrap text-[13.5px] font-medium transition-colors hover:text-[#152238] hover:underline hover:underline-offset-4 ${
                    active ? 'text-[#152238]' : 'text-[#152238]/70'
                  }"
                >
                  ${escapeHtml(item.label)}
                </a>
              `;
            }).join('')}
          </nav>

          <div class="hidden shrink-0 items-center lg:flex">
            <a
              href="${routeHref('/anuncie')}"
              class="shrink-0 whitespace-nowrap rounded-full bg-[#152238] px-5 py-2.5 text-[13px] font-medium text-[#F3F0EA] transition-colors hover:bg-[#152238]/90"
            >
              Anuncie seu imóvel
            </a>
          </div>

          <button
            type="button"
            id="mobile-menu-toggle"
            aria-label="Abrir menu"
            aria-expanded="false"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-[#152238] transition-colors hover:bg-[#F3F0EA] lg:hidden"
          >
            ${icons.menu('h-5 w-5', 1.8)}
          </button>
        </div>

        <div
          id="mobile-menu-drawer"
          class="hidden animate-page-enter border-t border-border bg-background px-5 pb-6 pt-3 lg:hidden"
        >
          <nav class="flex flex-col" aria-label="Menu mobile">
            ${NAV_LINKS.map((item) => {
              const active = isNavActive(item.to);
              return `
                <a
                  href="${routeHref(item.to)}"
                  data-close-mobile-menu="true"
                  class="border-b border-border/60 py-3.5 text-[15px] font-medium transition-colors ${
                    active ? 'text-[#152238]' : 'text-[#152238]/75'
                  }"
                >
                  ${escapeHtml(item.label)}
                </a>
              `;
            }).join('')}
          </nav>

          <div class="mt-5 flex flex-col gap-3">
            <a
              href="${routeHref('/anuncie')}"
              data-close-mobile-menu="true"
              class="flex min-h-[44px] items-center justify-center rounded-full bg-[#152238] px-5 py-3 text-center text-[14px] font-medium text-[#F3F0EA]"
            >
              Anuncie seu imóvel
            </a>
            <a
              href="${escapeHtml(waHref)}"
              target="_blank"
              rel="noreferrer"
              class="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13.5px] font-medium text-[#152238]"
            >
              ${icons.messageCircle('h-4 w-4 text-success', 1.8)}
              <span class="tabular-nums">${escapeHtml(settings.whatsappDisplay)}</span>
            </a>
          </div>
        </div>
      </header>

      <main class="animate-page-enter flex-1">
        ${contentHtml}
      </main>

      <footer class="mt-20 bg-[#152238] text-[#F3F0EA]">
        <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            ${renderSoledadeLogo({ variant: 'dark', showSubtitle: true })}
            <p class="mt-5 text-[13px] leading-relaxed text-[#F3F0EA]/70">
              ${escapeHtml(settings.footerText)}
            </p>
            <p class="mt-3 text-[12px] text-[#8C9AAE]">
              ${escapeHtml(settings.brokerName)} · CRECI ${escapeHtml(settings.creci)}
            </p>
          </div>

          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CDB386]">
              Navegação
            </p>
            <ul class="mt-5 space-y-3">
              ${NAV_LINKS.map(
                (item) => `
                  <li>
                    <a
                      href="${routeHref(item.to)}"
                      class="text-[13.5px] text-[#F3F0EA]/75 transition-colors hover:text-[#CDB386]"
                    >
                      ${escapeHtml(item.label)}
                    </a>
                  </li>
                `
              ).join('')}
              <li>
                <a
                  href="${routeHref('/anuncie')}"
                  class="text-[13.5px] text-[#F3F0EA]/75 transition-colors hover:text-[#CDB386]"
                >
                  Anuncie seu imóvel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CDB386]">
              Contato
            </p>
            <ul class="mt-5 space-y-4 text-[13.5px] text-[#F3F0EA]/75">
              <li class="flex items-start gap-3">
                ${icons.mail('mt-0.5 h-4 w-4 shrink-0 text-[#CDB386]', 1.6)}
                <a
                  href="mailto:${escapeHtml(settings.email)}"
                  class="break-all transition-colors hover:text-[#F3F0EA]"
                >
                  ${escapeHtml(settings.email)}
                </a>
              </li>
              <li class="flex items-start gap-3">
                ${icons.phone('mt-0.5 h-4 w-4 shrink-0 text-[#CDB386]', 1.6)}
                <a
                  href="${escapeHtml(waHref)}"
                  target="_blank"
                  rel="noreferrer"
                  class="tabular-nums transition-colors hover:text-[#F3F0EA]"
                >
                  ${escapeHtml(settings.whatsappDisplay)}
                </a>
              </li>
              <li class="flex items-start gap-3">
                ${icons.mapPin('mt-0.5 h-4 w-4 shrink-0 text-[#CDB386]', 1.6)}
                <span>
                  ${escapeHtml(settings.city)}, ${escapeHtml(settings.state)}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CDB386]">
              Para o proprietário
            </p>
            <p class="mt-5 text-[13.5px] leading-relaxed text-[#F3F0EA]/75">
              Avaliamos seu imóvel e conduzimos toda a negociação, da divulgação à documentação.
            </p>
            <a
              href="${routeHref('/anuncie')}"
              class="mt-5 inline-flex items-center whitespace-nowrap rounded-full border border-[#CDB386]/60 px-5 py-2.5 text-[13px] font-medium text-[#CDB386] transition-colors hover:bg-[#CDB386] hover:text-[#152238]"
            >
              Solicitar avaliação
            </a>
          </div>
        </div>

        <div class="border-t border-[#8C9AAE]/20">
          <div class="container-page flex flex-col items-start justify-between gap-3 py-6 text-[11.5px] text-[#8C9AAE] sm:flex-row sm:items-center">
            <p>
              © ${year} ${escapeHtml(settings.brokerName)} · ${escapeHtml(settings.companyName)}. Todos os
              direitos reservados.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <span>${escapeHtml(settings.instagram)}</span>
              <span aria-hidden="true">·</span>
              <span>CRECI ${escapeHtml(settings.creci)} · Salvador/BA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function mountPublicLayout(root) {
  const toggleBtn = root.querySelector('#mobile-menu-toggle');
  const drawer = root.querySelector('#mobile-menu-drawer');
  if (!toggleBtn || !drawer) return;

  let isOpen = false;
  function setOpen(next) {
    isOpen = next;
    drawer.classList.toggle('hidden', !isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    toggleBtn.innerHTML = isOpen ? icons.x('h-5 w-5', 1.8) : icons.menu('h-5 w-5', 1.8);
  }

  toggleBtn.addEventListener('click', () => setOpen(!isOpen));
  root.querySelectorAll('[data-close-mobile-menu]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
}
