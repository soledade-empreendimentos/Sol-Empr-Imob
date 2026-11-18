import { escapeHtml, routeHref } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getSiteSettings, whatsappUrl } from '../utils/store.js';

const OWNER_STEPS = [
  { value: 'Avaliação', label: 'Preço definido com base em dados reais do bairro' },
  { value: 'Divulgação', label: 'Fotos profissionais e anúncio no site e parceiros' },
  { value: 'Visitas', label: 'Agendamento e acompanhamento feitos pela nossa equipe' },
  { value: 'Negociação', label: 'Propostas filtradas e contrato acompanhado de perto' },
];

export function renderOwnerCtaBand() {
  const settings = getSiteSettings();
  const waHref = whatsappUrl(
    'Olá! Gostaria de avaliar meu imóvel com a Soledade.',
    settings.whatsapp
  );

  return `
    <section class="bg-[#152238]">
      <div class="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CDB386]">
            Para proprietários
          </p>
          <h2 class="mt-4 max-w-xl text-[28px] leading-tight text-[#F3F0EA] sm:text-[36px]">
            Quer vender ou alugar seu imóvel em Salvador?
          </h2>
          <p class="mt-4 max-w-lg text-[14px] leading-relaxed text-[#F3F0EA]/75">
            Avaliamos o imóvel, definimos o preço com base no mercado do bairro, fotografamos,
            divulgamos e conduzimos as visitas. Você acompanha cada etapa com ${escapeHtml(settings.brokerName)}.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              href="${routeHref('/anuncie')}"
              class="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#CDB386] px-6 text-[13.5px] font-medium text-[#152238] transition-colors hover:bg-[#CDB386]/90"
            >
              Cadastrar meu imóvel
              ${icons.arrowRight('h-4 w-4', 1.8)}
            </a>
            <a
              href="${escapeHtml(waHref)}"
              target="_blank"
              rel="noreferrer"
              class="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-[#8C9AAE]/40 px-6 text-[13.5px] font-medium text-[#F3F0EA] transition-colors hover:border-[#CDB386] hover:text-[#CDB386]"
            >
              ${icons.messageCircle('h-4 w-4', 1.7)}
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          ${OWNER_STEPS.map(
            (item) => `
              <div>
                <div class="h-full rounded-2xl border border-[#8C9AAE]/25 p-5">
                  <p class="text-[13px] font-medium text-[#CDB386]">${escapeHtml(item.value)}</p>
                  <p class="mt-2 text-[12.5px] leading-relaxed text-[#F3F0EA]/75">
                    ${escapeHtml(item.label)}
                  </p>
                </div>
              </div>
            `
          ).join('')}
        </div>
      </div>
    </section>
  `;
}
