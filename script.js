/**
 * script.js — Página de Ringo
 * Autor: Diego
 *
 * Módulos:
 *  1. Navbar: cambio al hacer scroll
 *  2. Menú móvil: hamburguesa toggle
 *  3. Scroll suave en todos los links ancla
 *  4. Reveal on scroll: efecto de aparición de elementos
 *  5. Navegación activa: resalta el link según la sección visible
 */

// ── 1. NAVBAR: cambio al hacer scroll ──────────────────────
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Ejecutar al cargar por si la página empieza en medio
handleNavbarScroll();


// ── 2. MENÚ MÓVIL: hamburguesa toggle ──────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  hamburger.setAttribute('aria-expanded', String(open));
  // Bloquea el scroll del body mientras el menú está abierto
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  toggleMenu(!isOpen);
});

// Cerrar al hacer clic en un link del menú móvil
mobileLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu(false);
    hamburger.focus();
  }
});


// ── 3. SCROLL SUAVE (fallback para navegadores sin CSS smooth) ──
const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

allAnchorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ── 4. REVEAL ON SCROLL ────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Dejar de observar una vez revelado (performance)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: '0px 0px -80px 0px', // dispara un poco antes del viewport
    threshold: 0.12
  }
);

revealEls.forEach(el => revealObserver.observe(el));


// ── 5. NAV LINK ACTIVO según sección visible ───────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${activeId}`);
      });
    });
  },
  {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // activa cuando la sección está en el centro
    threshold: 0
  }
);

sections.forEach(sec => sectionObserver.observe(sec));


// ── 6. IMAGEN DE FONDO FALLBACK (cuando no hay fotos) ──────
/**
 * Si las imágenes de la carpeta fotos/ no existen,
 * muestra un color de fondo sólido sin romper el diseño.
 */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    // Ocultar imagen rota; el background-color del contenedor toma el relevo
    this.style.opacity = '0';
  });
});

// Para el hero: si la imagen del bg no carga, usar degradado
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  const testImg = new Image();
  const bgUrl   = getComputedStyle(heroBg).backgroundImage.replace(/url\(["']?|["']?\)/g, '');

  testImg.onerror = () => {
    // Degradado de respaldo que mantiene la estética
    heroBg.style.backgroundImage =
      'linear-gradient(135deg, #3D1F10 0%, #6B3520 40%, #2C1A0E 100%)';
  };

  if (bgUrl && bgUrl !== 'none') {
    testImg.src = bgUrl;
  } else {
    heroBg.style.backgroundImage =
      'linear-gradient(135deg, #3D1F10 0%, #6B3520 40%, #2C1A0E 100%)';
  }
}


// ── 7. ESTILO DE NAV LINK ACTIVO (inyectado una sola vez) ──
const style = document.createElement('style');
style.textContent = `
  .nav-link.active::after { width: 100%; }
  .nav-link.active { color: var(--amber) !important; }
`;
document.head.appendChild(style);