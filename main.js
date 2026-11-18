import { mountPublicLayout, renderPublicLayout } from './components/PublicLayout.js';
import { mountSmartImages } from './components/SmartImage.js';
import { mountAnunciePage, renderAnunciePage } from './pages/AnunciePage.js';
import { mountCatalogPage, renderCatalogPage } from './pages/CatalogPage.js';
import { mountContatoPage, renderContatoPage } from './pages/ContatoPage.js';
import { mountHomePage, renderHomePage } from './pages/HomePage.js';
import { mountPropertyDetailPage, renderPropertyDetailPage } from './pages/PropertyDetailPage.js';
import { renderSobrePage } from './pages/SobrePage.js';
import { getRouteState, navigateTo } from './utils/dom.js';

let activeCleanup = null;

function resolveRoute() {
  const { pathname, params } = getRouteState();
  const cleanPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';

  if (cleanPath === '/') {
    return {
      path: '/',
      html: renderHomePage(),
      mount: (root) => mountHomePage(root),
    };
  }

  if (cleanPath === '/comprar') {
    return {
      path: '/comprar',
      html: renderCatalogPage({ purpose: 'venda', params }),
      mount: (root) => mountCatalogPage(root, { purpose: 'venda', params }),
    };
  }

  if (cleanPath === '/alugar') {
    return {
      path: '/alugar',
      html: renderCatalogPage({ purpose: 'aluguel', params }),
      mount: (root) => mountCatalogPage(root, { purpose: 'aluguel', params }),
    };
  }

  if (cleanPath.startsWith('/imovel/')) {
    const propertyId = decodeURIComponent(cleanPath.slice('/imovel/'.length));
    return {
      path: cleanPath,
      html: renderPropertyDetailPage(propertyId),
      mount: (root) => mountPropertyDetailPage(root, propertyId),
    };
  }

  if (cleanPath === '/anuncie') {
    return {
      path: '/anuncie',
      html: renderAnunciePage(),
      mount: (root) => mountAnunciePage(root),
    };
  }

  if (cleanPath === '/sobre') {
    return {
      path: '/sobre',
      html: renderSobrePage(),
      mount: null,
    };
  }

  if (cleanPath === '/contato') {
    return {
      path: '/contato',
      html: renderContatoPage(),
      mount: (root) => mountContatoPage(root),
    };
  }

  navigateTo('/', { replace: true });
  return {
    path: '/',
    html: renderHomePage(),
    mount: (root) => mountHomePage(root),
  };
}

function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;

  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }

  const route = resolveRoute();
  root.innerHTML = renderPublicLayout({
    currentPath: route.path,
    contentHtml: route.html,
  });

  mountPublicLayout(root);
  mountSmartImages(root);
  if (typeof route.mount === 'function') {
    const cleanup = route.mount(root);
    if (typeof cleanup === 'function') {
      activeCleanup = cleanup;
    }
  }

  window.scrollTo({ top: 0, behavior: 'auto' });
}

window.addEventListener('hashchange', renderApp);
window.addEventListener('popstate', renderApp);
renderApp();
