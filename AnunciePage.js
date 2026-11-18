import { PROPERTY_TYPES } from '../data/catalog.js';
import { escapeHtml } from '../utils/dom.js';
import { compressImageFile } from '../utils/formatters.js';
import { icons } from '../utils/icons.js';
import { showToast, submitLead, whatsappUrl } from '../utils/store.js';

const LABEL_CLASS = 'mb-1.5 block text-[12px] font-medium text-ink/70';
const INPUT_CLASS =
  'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40';

const PROCESS_STEPS = [
  'Você envia as informações e fotos do imóvel.',
  'Nossa equipe confere a documentação e agenda a avaliação.',
  'Definimos o valor com base no mercado do bairro.',
  'O imóvel entra no site e na nossa rede de contatos.',
];

const NO_COST_ITEMS = [
  'Avaliação inicial sem compromisso',
  'Fotos e divulgação por nossa conta',
  'Visitas acompanhadas por corretor',
  'Comissão combinada antes da divulgação',
];

function renderAnuncieFormHtml() {
  return `
    <form id="anuncie-form" class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="${LABEL_CLASS}" for="owner-name">
            Nome completo
          </label>
          <input
            id="owner-name"
            name="name"
            class="${INPUT_CLASS}"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label class="${LABEL_CLASS}" for="owner-phone">
            Telefone / WhatsApp
          </label>
          <input
            id="owner-phone"
            name="phone"
            class="${INPUT_CLASS}"
            placeholder="(71) 9 0000-0000"
          />
        </div>

        <div>
          <label class="${LABEL_CLASS}" for="owner-email">
            E-mail
          </label>
          <input
            id="owner-email"
            name="email"
            type="email"
            class="${INPUT_CLASS}"
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div>
          <label class="${LABEL_CLASS}" for="owner-type">
            Tipo de imóvel
          </label>
          <select
            id="owner-type"
            name="property_type"
            class="${INPUT_CLASS}"
          >
            ${PROPERTY_TYPES.map(
              (item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
            ).join('')}
          </select>
        </div>

        <div>
          <label class="${LABEL_CLASS}" for="owner-neighborhood">
            Bairro
          </label>
          <input
            id="owner-neighborhood"
            name="neighborhood"
            class="${INPUT_CLASS}"
            placeholder="Bairro do imóvel"
          />
        </div>

        <div>
          <label class="${LABEL_CLASS}" for="owner-purpose">
            Finalidade
          </label>
          <select
            id="owner-purpose"
            name="purpose"
            class="${INPUT_CLASS}"
          >
            <option value="venda">Vender</option>
            <option value="aluguel">Alugar</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="${LABEL_CLASS}" for="owner-value">
            Valor pretendido (R$)
          </label>
          <input
            id="owner-value"
            name="intended_value"
            type="number"
            class="${INPUT_CLASS}"
            placeholder="Deixe em branco se preferir uma avaliação"
          />
        </div>
      </div>

      <div>
        <label class="${LABEL_CLASS}" for="owner-message">
          Descrição do imóvel
        </label>
        <textarea
          id="owner-message"
          name="message"
          rows="4"
          class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          placeholder="Área, quartos, situação do imóvel, documentação…"
        ></textarea>
      </div>

      <div>
        <p class="${LABEL_CLASS}">Fotografias (até 8)</p>
        <div id="anuncie-photos-list" class="flex flex-wrap gap-3"></div>
      </div>

      <button
        type="submit"
        id="anuncie-submit-btn"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        Enviar cadastro
      </button>

      <p class="text-[11px] leading-relaxed text-muted-foreground">
        Ao enviar, você autoriza o contato da Soledade sobre a avaliação e a divulgação do
        imóvel. Os dados são tratados conforme a LGPD e não são compartilhados com terceiros.
      </p>
    </form>
  `;
}

export function renderAnunciePage() {
  return `
    <div>
      <div class="border-b border-border bg-[#F3F0EA]">
        <div class="container-page py-12 sm:py-16">
          <div>
            <p class="eyebrow">Captação de imóveis</p>
            <h1 class="mt-3 max-w-2xl text-[34px] font-medium leading-tight text-[#152238] sm:text-[46px]">
              Venda ou alugue seu imóvel com acompanhamento completo
            </h1>
            <p class="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              Preencha os dados abaixo. O cadastro entra imediatamente na fila de avaliação do
              nosso time — sem compromisso de exclusividade.
            </p>
          </div>
        </div>
      </div>

      <div class="container-page grid gap-12 py-14 lg:grid-cols-[1.25fr_0.75fr]">
        <div id="anuncie-card" class="rounded-2xl border border-border bg-card p-6 sm:p-8">
          ${renderAnuncieFormHtml()}
        </div>

        <aside class="space-y-6">
          <div class="rounded-2xl bg-[#152238] p-6 text-[#F3F0EA]">
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CDB386]">
              Como funciona
            </p>
            <ol class="mt-4 space-y-4">
              ${PROCESS_STEPS.map(
                (step, idx) => `
                  <li class="flex gap-3 text-[13px] leading-relaxed text-[#F3F0EA]/80">
                    <span class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#CDB386]/60 text-[10.5px] font-medium tabular-nums text-[#CDB386]">
                      ${idx + 1}
                    </span>
                    ${escapeHtml(step)}
                  </li>
                `
              ).join('')}
            </ol>
          </div>

          <div class="rounded-2xl border border-border bg-[#F3F0EA] p-6">
            <p class="text-[13px] font-semibold text-[#152238]">Sem custo para cadastrar</p>
            <ul class="mt-3 space-y-2 text-[12.5px] text-ink/75">
              ${NO_COST_ITEMS.map(
                (item) => `
                  <li class="flex items-start gap-2">
                    ${icons.check('mt-0.5 h-4 w-4 shrink-0 text-[#B39565]', 2)}
                    ${escapeHtml(item)}
                  </li>
                `
              ).join('')}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `;
}

export function mountAnunciePage(root) {
  const cardEl = root.querySelector('#anuncie-card');
  if (!cardEl) return;

  let photos = [];
  let uploadingPhotos = false;
  let submitting = false;

  function renderPhotosList() {
    const photosContainer = cardEl.querySelector('#anuncie-photos-list');
    const submitBtn = cardEl.querySelector('#anuncie-submit-btn');
    if (!photosContainer) return;

    const previewsHtml = photos
      .map(
        (photoUrl, idx) => `
          <div class="relative h-20 w-28 overflow-hidden rounded-lg border border-border">
            <img src="${escapeHtml(photoUrl)}" alt="Foto enviada" class="h-full w-full object-cover" />
            <button
              type="button"
              data-remove-photo="${idx}"
              aria-label="Remover foto"
              class="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-primary"
            >
              ${icons.x('h-3.5 w-3.5', 1.8)}
            </button>
          </div>
        `
      )
      .join('');

    const uploadHtml =
      photos.length < 8
        ? `
          <label class="inline-flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
            ${uploadingPhotos ? icons.loader2('h-4 w-4 animate-spin') : icons.upload('h-4 w-4')}
            <span>${uploadingPhotos ? 'Enviando' : 'Adicionar'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              id="anuncie-photo-input"
              class="hidden"
              ${uploadingPhotos ? 'disabled' : ''}
            />
          </label>
        `
        : '';

    photosContainer.innerHTML = `${previewsHtml}${uploadHtml}`;

    photosContainer.querySelectorAll('[data-remove-photo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-remove-photo'));
        photos = photos.filter((_, i) => i !== idx);
        renderPhotosList();
      });
    });

    const fileInput = photosContainer.querySelector('#anuncie-photo-input');
    if (fileInput) {
      fileInput.addEventListener('change', async (event) => {
        const selected = Array.from(event.target.files || []).slice(0, 8 - photos.length);
        if (!selected.length) return;
        uploadingPhotos = true;
        renderPhotosList();
        if (submitBtn) submitBtn.disabled = true;

        try {
          const processed = await Promise.all(
            selected.map((file) => compressImageFile(file, 900, 0.68))
          );
          photos = [...photos, ...processed].slice(0, 8);
        } catch {
          showToast('Não foi possível processar uma das fotos.', 'error');
        } finally {
          uploadingPhotos = false;
          if (submitBtn) submitBtn.disabled = submitting;
          renderPhotosList();
        }
      });
    }
  }

  function bindForm() {
    const form = cardEl.querySelector('#anuncie-form');
    if (!form) return;

    photos = [];
    uploadingPhotos = false;
    submitting = false;
    renderPhotosList();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitting || uploadingPhotos) return;

      const name = (form.elements.namedItem('name')?.value || '').trim();
      const phone = (form.elements.namedItem('phone')?.value || '').trim();
      const email = (form.elements.namedItem('email')?.value || '').trim();
      const propertyType = form.elements.namedItem('property_type')?.value || 'apartamento';
      const neighborhood = (form.elements.namedItem('neighborhood')?.value || '').trim();
      const purpose = form.elements.namedItem('purpose')?.value || 'venda';
      const intendedRaw = form.elements.namedItem('intended_value')?.value || '';
      const message = (form.elements.namedItem('message')?.value || '').trim();
      const submitBtn = cardEl.querySelector('#anuncie-submit-btn');

      if (name.length < 2 || !phone) {
        showToast('Informe seu nome completo e telefone.', 'error');
        return;
      }

      const numericValue = intendedRaw ? Number(intendedRaw) : undefined;
      if (numericValue !== undefined && (!Number.isFinite(numericValue) || numericValue < 0)) {
        showToast('Informe um valor pretendido válido.', 'error');
        return;
      }

      submitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${icons.loader2('h-4 w-4 animate-spin')} Enviando…`;
      }

      try {
        await submitLead({
          type: 'captacao',
          name,
          phone,
          email: email || undefined,
          message: message || undefined,
          property_type: propertyType,
          neighborhood: neighborhood || undefined,
          purpose,
          intended_value: numericValue,
          photos,
        });

        const summary = `Olá! Me chamo ${name} e acabei de cadastrar meu imóvel (${propertyType} para ${purpose}${
          neighborhood ? ` em ${neighborhood}` : ''
        }) no site da Soledade para avaliação.`;
        const waHref = whatsappUrl(summary);

        showToast('Cadastro enviado. Nossa equipe entrará em contato.', 'success');

        cardEl.innerHTML = `
          <div class="rounded-2xl border border-success/25 bg-success/5 p-8 text-center">
            <p class="font-heading text-[20px] text-primary">Recebemos seu cadastro</p>
            <p class="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-ink/70">
              Um consultor da Soledade vai analisar as informações do imóvel e entrar em contato
              para agendar a avaliação.
            </p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="${escapeHtml(waHref)}"
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-10 items-center gap-2 rounded-full bg-success px-5 text-[13px] font-medium text-success-foreground transition-opacity hover:opacity-90"
              >
                ${icons.messageCircle('h-4 w-4', 1.8)}
                Enviar resumo no WhatsApp
              </a>
              <button
                type="button"
                id="anuncie-reset-btn"
                class="text-[13px] font-medium text-primary underline underline-offset-4"
              >
                Cadastrar outro imóvel
              </button>
            </div>
          </div>
        `;

        const resetBtn = cardEl.querySelector('#anuncie-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            cardEl.innerHTML = renderAnuncieFormHtml();
            bindForm();
          });
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Não foi possível enviar agora.', 'error');
        submitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar cadastro';
        }
      }
    });
  }

  bindForm();
}
