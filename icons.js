function svgIcon(paths, className = 'h-4 w-4', strokeWidth = 1.7) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${className}">${paths}</svg>`;
}

export const icons = {
  arrowRight: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', cls, sw),
  arrowLeft: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', cls, sw),
  bath: (cls = 'h-3.5 w-3.5', sw = 1.6) =>
    svgIcon(
      '<path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>',
      cls,
      sw
    ),
  bedDouble: (cls = 'h-3.5 w-3.5', sw = 1.6) =>
    svgIcon(
      '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
      cls,
      sw
    ),
  building2: (cls = 'h-4 w-4', sw = 1.5) =>
    svgIcon(
      '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
      cls,
      sw
    ),
  car: (cls = 'h-3.5 w-3.5', sw = 1.6) =>
    svgIcon(
      '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
      cls,
      sw
    ),
  check: (cls = 'h-4 w-4', sw = 2) => svgIcon('<path d="M20 6 9 17l-5-5"/>', cls, sw),
  chevronLeft: (cls = 'h-5 w-5', sw = 1.8) => svgIcon('<path d="m15 18-6-6 6-6"/>', cls, sw),
  chevronRight: (cls = 'h-5 w-5', sw = 1.8) => svgIcon('<path d="m9 18 6-6-6-6"/>', cls, sw),
  compass: (cls = 'h-5 w-5', sw = 1.5) =>
    svgIcon(
      '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
      cls,
      sw
    ),
  eye: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon(
      '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
      cls,
      sw
    ),
  filePenLine: (cls = 'h-5 w-5', sw = 1.5) =>
    svgIcon(
      '<path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><path d="M8 18h1"/>',
      cls,
      sw
    ),
  handshake: (cls = 'h-5 w-5', sw = 1.5) =>
    svgIcon(
      '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
      cls,
      sw
    ),
  shieldCheck: (cls = 'h-5 w-5', sw = 1.5) =>
    svgIcon(
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
      cls,
      sw
    ),
  mapPin: (cls = 'h-4 w-4', sw = 1.6) =>
    svgIcon(
      '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
      cls,
      sw
    ),
  maximize: (cls = 'h-3.5 w-3.5', sw = 1.6) =>
    svgIcon(
      '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
      cls,
      sw
    ),
  menu: (cls = 'h-5 w-5', sw = 1.8) =>
    svgIcon('<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>', cls, sw),
  x: (cls = 'h-5 w-5', sw = 1.8) =>
    svgIcon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', cls, sw),
  messageCircle: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon(
      '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
      cls,
      sw
    ),
  mail: (cls = 'h-4 w-4', sw = 1.6) =>
    svgIcon(
      '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
      cls,
      sw
    ),
  phone: (cls = 'h-4 w-4', sw = 1.6) =>
    svgIcon(
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      cls,
      sw
    ),
  search: (cls = 'h-4 w-4', sw = 1.8) =>
    svgIcon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', cls, sw),
  send: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon(
      '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
      cls,
      sw
    ),
  slidersHorizontal: (cls = 'h-3.5 w-3.5', sw = 1.7) =>
    svgIcon(
      '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
      cls,
      sw
    ),
  upload: (cls = 'h-4 w-4', sw = 1.7) =>
    svgIcon(
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
      cls,
      sw
    ),
  loader2: (cls = 'h-4 w-4 animate-spin', sw = 1.8) =>
    svgIcon('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>', cls, sw),
  award: (cls = 'h-5 w-5', sw = 1.6) =>
    svgIcon(
      '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
      cls,
      sw
    ),
  clock: (cls = 'h-5 w-5', sw = 1.6) =>
    svgIcon('<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>', cls, sw),
  instagram: (cls = 'h-5 w-5', sw = 1.6) =>
    svgIcon(
      '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
      cls,
      sw
    ),
  checkCircle2: (cls = 'h-4 w-4', sw = 1.8) =>
    svgIcon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', cls, sw),
  alertCircle: (cls = 'h-4 w-4', sw = 1.8) =>
    svgIcon(
      '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
      cls,
      sw
    ),
};
