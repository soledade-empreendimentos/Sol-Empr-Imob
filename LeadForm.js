import { escapeHtml } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { showToast, submitLead, whatsappUrl } from '../utils/store.js';

const INPUT_CLASS =
  'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40';

export function renderLeadForm({
  formId = 'soledade-lead-form',
  property = null,
  type = 'interesse',
  submitLabel = 'Enviar interesse',
} = {}) {
  const placeholderMsg = property
    ? 'Quero saber mais sobre este imóvel…'
    : 'Como podemos ajudar?';

  return `
    <div id="${escapeHtml(formId)}-wrapper" data-lead-type="${escapeHtml(type)}" data-submit-label="${escapeHtml(submitLabel)}">
      <form id="${escapeHtml(formId)}" class="space-y-2.5">
        <input
          name="name"
          placeholder="Seu nome"
          aria-label="Seu nome"
          class="${INPUT_CLASS}"
        />

        <div class="grid gap-2.5 sm:grid-cols-2">
          <input
            name="phone"
            placeholder="Telefone / WhatsApp"
            aria-label="Telefone"
            class="${INPUT_CLASS}"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            aria-label="E-mail"
            class="${INPUT_CLASS}"
          />
        </div>

        <textarea
          name="message"
          placeholder="${escapeHtml(placeholderMsg)}"
          aria-label="Mensagem"
          rows="3"
          class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
        ></textarea>

        <button
          type="submit"
          class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          ${icons.send('h-4 w-4', 1.7)}
          <span>${escapeHtml(submitLabel)}</span>
        </button>

        <p class="text-[11px] leading-relaxed text-muted-foreground">
          Ao enviar, você autoriza o contato da Soledade sobre este imóvel. Seus dados não são
          compartilhados com terceiros.
        </p>
      </form>
    </div>
  `;
}

export function mountLeadForm(
  root,
  { formId = 'soledade-lead-form', property = null, type = 'interesse', submitLabel = 'Enviar interesse' } = {}
) {
  const wrapper = root.querySelector(`#${formId}-wrapper`);
  if (!wrapper) return;

  function bindForm() {
    const form = wrapper.querySelector('form');
    if (!form) return;

    let submitting = false;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitting) return;

      const nameEl = form.elements.namedItem('name');
      const phoneEl = form.elements.namedItem('phone');
      const emailEl = form.elements.namedItem('email');
      const messageEl = form.elements.namedItem('message');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = (nameEl?.value || '').trim();
      const phone = (phoneEl?.value || '').trim();
      const email = (emailEl?.value || '').trim();
      const message = (messageEl?.value || '').trim();

      if (name.length < 2 || (!phone && !email)) {
        showToast('Informe seu nome completo e um telefone ou e-mail.', 'error');
        return;
      }

      submitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `${icons.loader2('h-4 w-4 animate-spin')}<span>Enviando…</span>`;
      }

      try {
        await submitLead({
          type,
          name,
          phone: phone || undefined,
          email: email || undefined,
          message: message || undefined,
          property_id: property?.id,
          property_code: property?.code,
          property_title: property?.title,
          property_type: property?.property_type,
          neighborhood: property?.neighborhood,
          purpose: property?.purpose,
        });

        const intro = property
          ? `Olá! Me chamo ${name} e tenho interesse no imóvel "${property.title}" (${property.code}).`
          : `Olá! Me chamo ${name} e enviei uma mensagem pelo site da Soledade.`;
        const extra = message ? ` Mensagem: ${message}` : '';
        const waLink = whatsappUrl(`${intro}${extra}`);

        showToast('Recebemos seus dados. Nossa equipe entrará em contato.', 'success');

        wrapper.innerHTML = `
          <div class="rounded-2xl border border-success/20 bg-success/5 p-5">
            <p class="text-[13.5px] font-medium text-success">Mensagem enviada</p>
            <p class="mt-1.5 text-[12.5px] leading-relaxed text-ink/70">
              Obrigado pelo contato. Um consultor da Soledade vai responder pelo telefone ou e-mail
              informado.
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="${escapeHtml(waLink)}"
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success px-3.5 text-[12px] font-medium text-success-foreground transition-opacity hover:opacity-90"
              >
                ${icons.messageCircle('h-3.5 w-3.5', 1.8)}
                Agilizar pelo WhatsApp
              </a>
              <button
                type="button"
                data-reset-lead-form="true"
                class="text-[12.5px] font-medium text-primary underline underline-offset-4"
              >
                Enviar outra mensagem
              </button>
            </div>
          </div>
        `;

        const resetBtn = wrapper.querySelector('[data-reset-lead-form]');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            const temp = document.createElement('div');
            temp.innerHTML = renderLeadForm({ formId, property, type, submitLabel });
            const nextWrapper = temp.firstElementChild;
            if (nextWrapper) {
              wrapper.innerHTML = nextWrapper.innerHTML;
              bindForm();
            }
          });
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Não foi possível enviar agora.', 'error');
        submitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `${icons.send('h-4 w-4', 1.7)}<span>${escapeHtml(submitLabel)}</span>`;
        }
      }
    });
  }

  bindForm();
}
