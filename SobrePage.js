import { renderContactCtaBand } from '../components/ContactCtaBand.js';
import { renderOwnerCtaBand } from '../components/OwnerCtaBand.js';
import { renderSmartImage } from '../components/SmartImage.js';
import { SITE_IMAGES } from '../data/catalog.js';
import { escapeHtml } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getSiteSettings } from '../utils/store.js';

const VALUES_LIST = [
  {
    title: 'Atendimento honesto e transparente',
    text: 'Comunicar vantagens e limites de cada imóvel com clareza, desde o primeiro contato até a entrega das chaves.',
  },
  {
    title: 'Responsabilidade social, ética e jurídica',
    text: 'Conduzir cada negociação com documentação conferida, contratos claros e respeito a todas as partes.',
  },
  {
    title: 'Profissionalismo e atenção aos detalhes',
    text: 'Visitar antes de anunciar, conferir medidas, condomínio e histórico para evitar surpresas na assinatura.',
  },
  {
    title: 'Inovação e atualização constante',
    text: 'Acompanhar o mercado de Salvador, os instrumentos de financiamento e as melhores práticas de divulgação.',
  },
  {
    title: 'Compromisso contínuo com o cliente',
    text: 'Construir relações de confiança com clientes, colaboradores e fornecedores, mantendo o cuidado após cada negócio.',
  },
  {
    title: 'Responsabilidade com a comunidade',
    text: 'Incentivar a boa convivência, o respeito às regras dos condomínios e o uso consciente dos recursos.',
  },
];

export function renderSobrePage() {
  const settings = getSiteSettings();

  return `
    <div>
      <div class="border-b border-border bg-[#F3F0EA]">
        <div class="container-page py-12 sm:py-16">
          <div>
            <p class="eyebrow">Institucional</p>
            <h1 class="mt-3 max-w-3xl text-[34px] font-medium leading-tight text-[#152238] sm:text-[46px]">
              Uma imobiliária de Salvador, dedicada a decisões bem informadas.
            </h1>
          </div>
        </div>
      </div>

      <section class="container-page py-14">
        <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div class="overflow-hidden rounded-2xl">
              ${renderSmartImage({
                src: SITE_IMAGES.aboutInterior,
                alt: 'Vista de edifícios residenciais em Salvador',
                className: 'aspect-[4/3] w-full',
              })}
            </div>
          </div>

          <div>
            <h2 class="text-[28px] font-medium leading-tight text-[#152238] sm:text-[34px]">
              ${escapeHtml(settings.aboutTitle || settings.companyName)}
            </h2>
            <p class="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#B39565]">
              CRECI ${escapeHtml(settings.creci)} · Salvador, Bahia
            </p>
            <p class="mt-4 whitespace-pre-line text-[14.5px] leading-relaxed text-ink/75">
              ${escapeHtml(settings.aboutText)}
            </p>
            <p class="mt-4 text-[14.5px] leading-relaxed text-ink/75">
              Trabalhamos com imóveis próprios e com captações autorizadas por proprietários, sempre
              com documentação verificada. Atuamos na venda e na locação de imóveis residenciais e
              comerciais, tanto para quem busca moradia quanto para quem investe.
            </p>
            <p class="mt-4 text-[14.5px] leading-relaxed text-ink/75">
              Nossa equipe acompanha proposta, negociação, financiamento e contrato — e continua
              disponível depois da assinatura.
            </p>
          </div>
        </div>
      </section>

      <section class="border-b border-border bg-[#F3F0EA] py-16">
        <div class="container-page">
          <div>
            <p class="eyebrow">Quem somos por dentro</p>
            <h2 class="mt-3 max-w-2xl text-[28px] font-medium leading-tight text-[#152238] sm:text-[36px]">
              Missão, visão e valores
            </h2>
          </div>

          <div class="mt-10 grid gap-5 lg:grid-cols-2">
            <div>
              <article class="h-full rounded-2xl border border-border bg-card p-7">
                <div class="flex items-center gap-2.5">
                  ${icons.compass('h-4 w-4 text-gold', 1.7)}
                  <p class="eyebrow">Missão</p>
                </div>
                <p class="mt-4 text-[14.5px] leading-relaxed text-ink/80">
                  ${escapeHtml(settings.mission)}
                </p>
              </article>
            </div>

            <div>
              <article class="h-full rounded-2xl border border-border bg-card p-7">
                <div class="flex items-center gap-2.5">
                  ${icons.eye('h-4 w-4 text-gold', 1.7)}
                  <p class="eyebrow">Visão</p>
                </div>
                <p class="mt-4 text-[14.5px] leading-relaxed text-ink/80">
                  Ser referência de confiança na intermediação imobiliária na capital baiana,
                  reconhecida pelo rigor na curadoria dos imóveis e pelo acompanhamento próximo antes
                  e depois da assinatura.
                </p>
              </article>
            </div>
          </div>

          <div class="mt-14">
            <div>
              <p class="eyebrow">Valores</p>
              <h3 class="mt-3 max-w-2xl text-[22px] leading-tight text-primary sm:text-[26px]">
                O que sustenta cada negociação
              </h3>
            </div>

            <div class="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              ${VALUES_LIST.map(
                (item, idx) => `
                  <div class="border-t border-border pt-5">
                    <span class="text-[11px] font-medium tabular-nums tracking-[0.2em] text-gold">
                      ${String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4 class="mt-1.5 text-[15px] font-medium text-primary">${escapeHtml(item.title)}</h4>
                    <p class="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      ${escapeHtml(item.text)}
                    </p>
                  </div>
                `
              ).join('')}
            </div>
          </div>
        </div>
      </section>

      ${renderOwnerCtaBand()}
      ${renderContactCtaBand()}
    </div>
  `;
}
