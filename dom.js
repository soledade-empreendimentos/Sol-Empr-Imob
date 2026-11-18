export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getRouteState() {
  const rawHash = window.location.hash || '';
  if (rawHash.startsWith('#/')) {
    const withoutHash = rawHash.slice(1);
    const qIndex = withoutHash.indexOf('?');
    const pathname = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;
    const search = qIndex >= 0 ? withoutHash.slice(qIndex) : '';
    return {
      pathname: pathname || '/',
      params: new URLSearchParams(search),
    };
  }

  const pathname = window.location.pathname || '/';
  return {
    pathname: pathname === '/index.html' ? '/' : pathname,
    params: new URLSearchParams(window.location.search),
  };
}

export function navigateTo(target, { replace = false } = {}) {
  const normalized = target.startsWith('/') ? target : `/${target}`;
  const nextHash = `#${normalized}`;
  if (replace) {
    window.history.replaceState(null, '', nextHash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = normalized;
  }
}

export function routeHref(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `#${normalized}`;
}
