import { escapeHtml, routeHref } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getSiteSettings, whatsappUrl } from '../utils/store.js';

export function renderContactCtaBand() {
  const settings = getSiteSettings();
  const waHref = whatsappUrl();

  return `
    <section class="container-page pb-4 pt-20">
      <div class="rounded-3xl border border-border bg-[#F3F0EA] p-8 sm:p-12">
        <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p class="eyebrow">Vamos conversar</p>
            <h2 class="mt-3 max-w-lg text-[26px] leading-tight text-[#152238] sm:text-[32px]">
              Conte o que você procura e receba opções selecionadas.
            </h2>
            <p class="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
              Atendimento direto com ${escapeHtml(settings.brokerName)} (CRECI ${escapeHtml(settings.creci)}) em horário
              comercial, por WhatsApp ou e-mail, com opções que atendem ao seu perfil.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="${escapeHtml(waHref)}"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#152238] px-6 text-[13.5px] font-medium text-[#F3F0EA] transition-colors hover:bg-[#152238]/90"
            >
              ${icons.messageCircle('h-4 w-4 text-[#CDB386]', 1.7)}
              <span class="tabular-nums">${escapeHtml(settings.whatsappDisplay)}</span>
            </a>
            <a
              href="mailto:${escapeHtml(settings.email)}"
              class="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-white px-6 text-[13.5px] font-medium text-[#152238] transition-colors hover:border-[#152238]/30"
            >
              ${icons.mail('h-4 w-4 text-[#B39565]', 1.7)}
              Enviar e-mail
            </a>
            <a
              href="${routeHref('/contato')}"
              class="group inline-flex items-center justify-center gap-2 whitespace-nowrap px-2 py-1 text-[13px] font-medium text-[#152238]"
            >
              Formulário de contato
              ${icons.arrowRight('h-4 w-4 transition-transform group-hover:translate-x-0.5', 1.7)}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
