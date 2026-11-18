import { mountLeadForm, renderLeadForm } from '../components/LeadForm.js';
import { escapeHtml } from '../utils/dom.js';
import { icons } from '../utils/icons.js';
import { getSiteSettings, whatsappUrl } from '../utils/store.js';

export function renderContatoPage() {
  const settings = getSiteSettings();
  const waHref = whatsappUrl();

  const hasCustomAddress =
    settings.address &&
    settings.address !== settings.city &&
    settings.address !== `${settings.city}, ${settings.state}`;

  return `
    <div>
      <div class="border-b border-border bg-[#F3F0EA]">
        <div class="container-page py-12 sm:py-16">
          <div>
            <p class="eyebrow">Contato</p>
            <h1 class="mt-3 text-[34px] font-medium leading-tight text-[#152238] sm:text-[46px]">
              Fale com ${escapeHtml(settings.brokerName)}
            </h1>
            <p class="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              Conte o que você procura — imóvel para morar, investimento ou avaliação do seu imóvel.
              Retornamos em horário comercial.
            </p>
          </div>
        </div>
      </div>

      <div class="container-page grid gap-12 py-14 lg:grid-cols-2">
        <div class="space-y-4">
          <div class="flex items-start gap-4 rounded-2xl border border-border bg-[#F3F0EA]/60 p-5">
            ${icons.award('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Corretor responsável
              </p>
              <p class="mt-1 font-heading text-[20px] font-semibold text-[#152238]">
                ${escapeHtml(settings.brokerName)}
              </p>
              <p class="mt-0.5 text-[12.5px] uppercase tracking-[0.16em] text-[#B39565]">
                Corretor de Imóveis · CRECI ${escapeHtml(settings.creci)}
              </p>
            </div>
          </div>

          <a
            href="${escapeHtml(waHref)}"
            target="_blank"
            rel="noreferrer"
            class="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#152238]/25"
          >
            ${icons.messageCircle('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                WhatsApp
              </p>
              <p class="mt-1 text-[15px] font-medium tabular-nums text-[#152238]">
                ${escapeHtml(settings.whatsappDisplay)}
              </p>
              <p class="mt-1 text-[12.5px] text-muted-foreground">
                Atendimento rápido pelo celular
              </p>
            </div>
          </a>

          <a
            href="mailto:${escapeHtml(settings.email)}"
            class="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#152238]/25"
          >
            ${icons.mail('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                E-mail
              </p>
              <p class="mt-1 break-all text-[15px] font-medium text-[#152238]">
                ${escapeHtml(settings.email)}
              </p>
              <p class="mt-1 text-[12.5px] text-muted-foreground">
                Documentos, propostas e informações
              </p>
            </div>
          </a>

          <a
            href="https://instagram.com/soledade.empreendimentos"
            target="_blank"
            rel="noreferrer"
            class="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#152238]/25"
          >
            ${icons.instagram('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Instagram
              </p>
              <p class="mt-1 text-[15px] font-medium text-[#152238]">${escapeHtml(settings.instagram)}</p>
              <p class="mt-1 text-[12.5px] text-muted-foreground">
                Novos imóveis e bastidores da curadoria
              </p>
            </div>
          </a>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              ${icons.mapPin('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Localização
                </p>
                <p class="mt-1 text-[15px] font-medium text-[#152238]">
                  ${escapeHtml(settings.city)}, ${escapeHtml(settings.state)}
                </p>
                <p class="mt-1 text-[12.5px] text-muted-foreground">
                  ${hasCustomAddress ? escapeHtml(settings.address) : 'Atendimento com agendamento'}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              ${icons.clock('mt-0.5 h-5 w-5 text-[#B39565]', 1.6)}
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Horário
                </p>
                <p class="mt-1 text-[15px] font-medium text-[#152238]">
                  Seg. a sex., 9h às 18h
                </p>
                <p class="mt-1 text-[12.5px] text-muted-foreground">
                  Sábado com agendamento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 self-start">
          <h2 class="text-[22px] font-medium text-[#152238]">Enviar mensagem</h2>
          <p class="mt-1.5 text-[12.5px] text-muted-foreground">
            Preencha os campos e retornaremos com as informações solicitadas.
          </p>
          <div class="mt-5">
            ${renderLeadForm({
              formId: 'contato-lead-form',
              type: 'contato',
              submitLabel: 'Enviar mensagem',
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function mountContatoPage(root) {
  mountLeadForm(root, {
    formId: 'contato-lead-form',
    type: 'contato',
    submitLabel: 'Enviar mensagem',
  });
}
