document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initScrollAnimations();
    initContactForm();
    initWhatsappFloat();
});

/* ── Navbar ───────────────────────────────────────────── */
function initNav() {
    const nav       = document.querySelector('.nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    const navLinks  = document.querySelectorAll('.nav-link');

    // Scroll class
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.className = open ? 'fas fa-times' : 'fas fa-bars';
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

/* ── Scroll-reveal with stagger ──────────────────────── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Stagger siblings in the same parent
            const parent   = entry.target.closest('.servicios-grid, .testimonios-grid, .zonas-list') || entry.target.parentElement;
            const siblings = [...parent.querySelectorAll('[data-animate]')];
            const idx      = siblings.indexOf(entry.target);

            setTimeout(() => {
                entry.target.classList.add('animated');
            }, idx * 80);

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

/* ── Contact form → WhatsApp redirect ───────────────── */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn  = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Enviando…';
        submitBtn.disabled   = true;

        const data = Object.fromEntries(new FormData(form));

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Listo!';
            submitBtn.style.background = '#10b981';

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML    = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled     = false;

                const msg = encodeURIComponent(
                    `Hola Mauro, me contacto desde tu página web.\n\n` +
                    `Nombre: ${data.nombre}\n` +
                    `Teléfono: ${data.telefono}\n` +
                    `Servicio: ${getServiceName(data.servicio)}\n` +
                    `Mensaje: ${data.mensaje || 'Sin mensaje adicional'}`
                );
                window.open(`https://wa.me/543764677488?text=${msg}`, '_blank');
            }, 1600);
        }, 1400);
    });
}

function getServiceName(value) {
    return {
        'apertura-puerta':  'Apertura de puerta',
        'cambio-cerradura': 'Cambio de cerradura',
        'auto':             'Cerrajería automotriz',
        'caja-fuerte':      'Caja fuerte',
        'duplicado':        'Duplicado de llaves',
        'consorcio':        'Consorcios',
        'otro':             'Otro'
    }[value] || value;
}

/* ── Floating WhatsApp hide on scroll-down ───────────── */
function initWhatsappFloat() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;

    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        btn.style.transform = (y > lastY && y > 200) ? 'translateX(90px)' : 'translateX(0)';
        lastY = y;
    }, { passive: true });
}