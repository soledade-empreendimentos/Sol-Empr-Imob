import { renderContactCtaBand } from '../components/ContactCtaBand.js';
import { mountHeroSearchBar, renderHeroSearchBar } from '../components/HeroSearchBar.js';
import { renderOwnerCtaBand } from '../components/OwnerCtaBand.js';
import { renderPropertyGrid } from '../components/PropertyGrid.js';
import { renderSectionHeader } from '../components/SectionHeader.js';
import { renderSmartImage } from '../components/SmartImage.js';
import { SITE_IMAGES } from '../data/catalog.js';
import { escapeHtml, routeHref } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getAvailableProperties, getSiteSettings } from '../utils/store.js';

const HERO_PHOTOS = [
  {
    src: SITE_IMAGES.heroFacade,
    alt: 'Fachada de edifício residencial contemporâneo em Salvador',
  },
  {
    src: SITE_IMAGES.heroLiving,
    alt: 'Sala de estar ampla com janelas do piso ao teto e luz natural',
  },
  {
    src: SITE_IMAGES.heroPoolHouse,
    alt: 'Casa com piscina e jardim tropical',
  },
];

const DIFFERENTIATORS = [
  {
    icon: () => icons.compass('h-5 w-5 text-[#B39565]', 1.5),
    title: 'Curadoria de imóveis',
    text: 'Visitamos e analisamos cada imóvel antes de publicá-lo. Você vê apenas opções que fazem sentido.',
  },
  {
    icon: () => icons.shieldCheck('h-5 w-5 text-[#B39565]', 1.5),
    title: 'Documentação verificada',
    text: 'Conferimos matrícula, certidões e regularidade antes de qualquer proposta ser levada adiante.',
  },
  {
    icon: () => icons.handshake('h-5 w-5 text-[#B39565]', 1.5),
    title: 'Negociação transparente',
    text: 'Valores, condições e comissões claros desde o início, com o proprietário e o comprador alinhados.',
  },
  {
    icon: () => icons.filePenLine('h-5 w-5 text-[#B39565]', 1.5),
    title: 'Acompanhamento até a chave',
    text: 'Suporte na proposta, contrato, financiamento e entrega — sem etapas soltas pelo caminho.',
  },
];

function renderHeroTitleLetters(text) {
  let letterIndex = 0;
  return text
    .split('')
    .map((char) => {
      if (char === ' ') return '<span> </span>';
      const html = `<span class="hero-letter" style="--hero-i: ${letterIndex}">${escapeHtml(char)}</span>`;
      letterIndex += 1;
      return html;
    })
    .join('');
}

const HERO_TITLES = [
  'Imóveis selecionados para quem valoriza cada detalhe.',
  'Encontre o lugar certo para viver seus novos planos.',
  'Atendimento direto para morar ou investir em Salvador.',
];

export function renderHomePage() {
  const settings = getSiteSettings();
  const properties = getAvailableProperties();
  const heroTitle = settings.heroTitle || HERO_TITLES[0];

  const featured = properties.filter((p) => p.featured);
  const highlighted = (featured.length ? featured : properties).slice(0, 3);
  const forSale = properties.filter((p) => p.purpose === 'venda').slice(0, 3);
  const forRent = properties.filter((p) => p.purpose === 'aluguel').slice(0, 3);

  return `
    <section class="hero-section" aria-label="Apresentação Soledade">
      <div class="hero-inner">
        <div class="flex flex-col items-center text-center">
          <div>
            <p class="eyebrow mb-5">Venda · Aluguel · Gestão</p>
            <h1 id="hero-rotating-title" class="hero-title" aria-live="polite">
              ${renderHeroTitleLetters(heroTitle)}
            </h1>
          </div>

          <div>
            <p class="hero-sub mt-5 max-w-[460px] text-[15px] leading-relaxed text-[#152238]/75">
              ${escapeHtml(settings.heroSubtitle)}
            </p>
          </div>

          <div>
            <a
              href="${routeHref('/comprar')}"
              class="hero-cta mt-7 inline-flex h-11 items-stretch overflow-hidden rounded-md border border-[#152238] bg-[#152238] text-[#F3F0EA] transition-colors duration-300 hover:bg-[#152238]/90"
            >
              <span class="inline-flex items-center px-5 text-[13.5px] font-medium tracking-wide">
                Ver imóveis disponíveis
              </span>
              <span aria-hidden="true" class="w-px self-stretch bg-[#CDB386]/35"></span>
              <span
                aria-hidden="true"
                class="inline-flex w-11 items-center justify-center text-[#CDB386]"
              >
                ${icons.arrowRight('h-[17px] w-[17px]', 1.6)}
              </span>
            </a>
          </div>

          <div class="w-full max-w-3xl">
            ${renderHeroSearchBar()}
          </div>
        </div>

        <div class="hero-gallery">
          ${HERO_PHOTOS.map(
            (photo, idx) => `
              <div class="hero-photo hero-photo--${idx + 1}">
                <figure class="hero-photo-frame">
                  ${renderSmartImage({ src: photo.src, alt: photo.alt })}
                </figure>
              </div>
            `
          ).join('')}
        </div>
      </div>
    </section>

    <section class="container-page py-20 sm:py-24">
      <div class="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <div class="order-2 lg:order-1">
          <p class="eyebrow">Sobre a Soledade</p>
          <h2 class="mt-4 max-w-lg text-[30px] font-medium leading-tight text-[#152238] sm:text-[38px]">
            Atendimento próximo em Salvador, feito para acompanhar cada decisão de perto.
          </h2>
          <p class="mt-5 max-w-lg text-[14.5px] leading-relaxed text-ink/75">
            Atuamos na compra, venda e locação de imóveis residenciais e comerciais na capital
            baiana. Trabalhamos com uma seleção criteriosa de imóveis para conhecer cada detalhe
            do que apresentamos.
          </p>
          <p class="mt-4 max-w-lg text-[14.5px] leading-relaxed text-ink/75">
            Seja para morar ou para investir, você conversa diretamente com ${escapeHtml(settings.brokerName)}
            (CRECI ${escapeHtml(settings.creci)}), que visitou o imóvel, conhece a região e acompanha o
            processo até o registro.
          </p>

          <div class="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <p class="text-[13px] font-semibold text-[#152238]">Venda</p>
              <p class="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                Negociação de imóveis residenciais e comerciais
              </p>
            </div>
            <div>
              <p class="text-[13px] font-semibold text-[#152238]">Aluguel</p>
              <p class="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                Seleção de inquilinos e contratos acompanhados
              </p>
            </div>
            <div>
              <p class="text-[13px] font-semibold text-[#152238]">Gestão</p>
              <p class="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                Documentação, financiamento e pós-venda
              </p>
            </div>
          </div>

          <a
            href="${routeHref('/sobre')}"
            class="group mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-[#152238]"
          >
            Conhecer a atuação
            ${icons.arrowRight('h-4 w-4 text-[#B39565] transition-transform group-hover:translate-x-0.5', 1.7)}
          </a>
        </div>

        <div class="order-1 lg:order-2">
          <div class="relative">
            <div class="overflow-hidden rounded-2xl">
              ${renderSmartImage({
                src: SITE_IMAGES.aboutInterior,
                alt: 'Interior de apartamento com sala ampla e iluminação natural',
                className: 'aspect-[4/3] w-full',
              })}
            </div>

            <div class="mt-4 sm:absolute sm:-bottom-6 sm:left-6 sm:mt-0 sm:w-64">
              <div class="rounded-xl border border-border bg-white p-5 shadow-[0_20px_50px_-32px_rgba(21,34,56,0.45)]">
                <p class="font-heading text-[18px] font-semibold text-[#152238]">
                  Atendimento direto
                </p>
                <p class="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  Você fala diretamente com o corretor responsável pelo imóvel, sem intermediação
                  impessoal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container-page pb-6">
      ${renderSectionHeader({
        eyebrow: 'Seleção da semana',
        title: 'Imóveis em destaque',
        description:
          'Unidades selecionadas no Beach Class Jaguaribe — frente mar em Salvador, para moradia ou investimento.',
        actionTo: '/comprar',
        actionLabel: 'Ver catálogo de venda',
      })}
      ${renderPropertyGrid(highlighted)}
    </section>

    ${
      forSale.length > highlighted.length
        ? `<section class="container-page py-20">
            ${renderSectionHeader({
              eyebrow: 'Compra e venda',
              title: 'Imóveis à venda',
              description:
                'Apartamentos, casas e coberturas com documentação conferida antes do anúncio.',
              actionTo: '/comprar',
              actionLabel: 'Ver catálogo de venda',
            })}
            ${renderPropertyGrid(forSale)}
          </section>`
        : ''
    }

    ${
      forRent.length > 0
        ? `<section class="bg-[#F3F0EA] py-20">
            <div class="container-page">
              ${renderSectionHeader({
                eyebrow: 'Locação',
                title: 'Imóveis para alugar',
                description:
                  'Opções prontas para morar em bairros consolidados, com análise de crédito acompanhada.',
                actionTo: '/alugar',
                actionLabel: 'Ver catálogo de aluguel',
              })}
              ${renderPropertyGrid(forRent)}
            </div>
          </section>`
        : ''
    }

    <section class="container-page py-20">
      ${renderSectionHeader({
        eyebrow: 'Por que a Soledade',
        title: 'O cuidado que faz diferença na hora de fechar',
        description:
          'Não somos um portal de anúncios. Acompanhamos pessoas e imóveis com critério, do começo ao fim.',
      })}

      <div class="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        ${DIFFERENTIATORS.map(
          (item) => `
            <div class="border-t border-border pt-6">
              ${item.icon()}
              <h3 class="mt-4 text-[18px] font-medium text-[#152238]">${escapeHtml(item.title)}</h3>
              <p class="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                ${escapeHtml(item.text)}
              </p>
            </div>
          `
        ).join('')}
      </div>
    </section>

    ${renderOwnerCtaBand()}
    ${renderContactCtaBand()}
  `;
}

export function mountHomePage(root) {
  mountHeroSearchBar(root);

  const titleEl = root.querySelector('#hero-rotating-title');
  if (!titleEl || HERO_TITLES.length < 2) return () => {};

  let currentIdx = 0;
  let swapTimeoutId = null;
  let rafId = null;
  const intervalMs = 7500;
  const exitMs = 850;

  const intervalId = window.setInterval(() => {
    currentIdx = (currentIdx + 1) % HERO_TITLES.length;
    titleEl.classList.add('is-exiting');

    swapTimeoutId = window.setTimeout(() => {
      if (!titleEl.isConnected) return;
      titleEl.classList.remove('is-exiting');
      titleEl.classList.add('is-entering');
      titleEl.innerHTML = renderHeroTitleLetters(HERO_TITLES[currentIdx]);
      // Force layout before smoothly gliding into place
      void titleEl.offsetWidth;
      rafId = window.requestAnimationFrame(() => {
        if (!titleEl.isConnected) return;
        titleEl.classList.remove('is-entering');
      });
    }, exitMs);
  }, intervalMs);

  return () => {
    window.clearInterval(intervalId);
    if (swapTimeoutId !== null) {
      window.clearTimeout(swapTimeoutId);
    }
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
    }
  };
}
