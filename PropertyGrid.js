import { renderPropertyCard } from './PropertyCard.js';

export function renderPropertyGrid(properties, columns = 3) {
  if (!properties || !properties.length) {
    return `
      <div class="mt-9 rounded-2xl border border-dashed border-border bg-secondary/50 py-16 text-center">
        <p class="text-[14px] text-muted-foreground">
          Nenhum imóvel encontrado com esses critérios.
        </p>
      </div>
    `;
  }

  return `
    <div class="mt-9 grid gap-6 sm:grid-cols-2 ${
      columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
    }">
      ${properties.map((property) => renderPropertyCard(property)).join('')}
    </div>
  `;
}
