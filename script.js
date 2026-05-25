// ============================================================
//  PROFESSIONAL DARK JADE PORTFOLIO — script.js
// ============================================================


// ─── BACKGROUND CANVAS: dark mesh + subtle jade glow ──────────────────────────
(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, dpr;

    const ambientBlobs = [
        { rx: 0.08, ry: 0.15, rr: 0.45, alpha: 0.06, speed: 0.0005, phase: 0 },
        { rx: 0.85, ry: 0.60, rr: 0.38, alpha: 0.04, speed: 0.0007, phase: 2.1 },
        { rx: 0.45, ry: 0.90, rr: 0.30, alpha: 0.03, speed: 0.0004, phase: 4.3 },
    ];

    const PARTICLE_COUNT = 60;
    const particles = [];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr, dpr);
    }

    function makeParticle() {
        return {
            x:     Math.random() * W,
            y:     Math.random() * H,
            r:     Math.random() * 1.5 + 0.3,
            dx:    (Math.random() - 0.5) * 0.12,
            dy:    (Math.random() - 0.5) * 0.08,
            alpha: Math.random() * 0.18 + 0.04,
            phase: Math.random() * Math.PI * 2,
            speed: 0.002 + Math.random() * 0.003,
        };
    }

    function init() {
        resize();
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
    }

    let mouse = { x: W / 2, y: H / 2 };
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function drawFrame() {
        // Deep dark background
        ctx.fillStyle = '#0d1410';
        ctx.fillRect(0, 0, W, H);

        // Subtle dot grid
        ctx.fillStyle = 'rgba(0, 168, 120, 0.06)';
        const gridSpacing = 32;
        for (let x = 0; x < W; x += gridSpacing) {
            for (let y = 0; y < H; y += gridSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, 0.6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Jade glow blobs
        ambientBlobs.forEach(b => {
            b.phase += b.speed;
            const bx = (b.rx + Math.sin(b.phase * 0.7) * 0.05) * W;
            const by = (b.ry + Math.cos(b.phase * 0.5) * 0.05) * H;
            const br = b.rr * Math.min(W, H) * (1 + Math.sin(b.phase) * 0.03);
            const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
            g.addColorStop(0,   `rgba(0, 168, 120, ${b.alpha})`);
            g.addColorStop(0.4, `rgba(0, 120, 80, ${b.alpha * 0.4})`);
            g.addColorStop(1,   'rgba(13, 20, 16, 0)');
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        });

        // Floating particles
        particles.forEach(p => {
            p.phase += p.speed;
            p.x += p.dx + Math.sin(p.phase) * 0.03;
            p.y += p.dy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            const boost = d < 100 ? (1 - d / 100) * 0.25 : 0;

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
            g.addColorStop(0,   `rgba(0, 168, 120, ${p.alpha + boost})`);
            g.addColorStop(1,   'rgba(0, 168, 120, 0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        });

        requestAnimationFrame(drawFrame);
    }

    init();
    drawFrame();
    window.addEventListener('resize', () => { resize(); });
})();


// ─── RAIN CANVAS: minimal dark droplets ────────────────────────────────────────
(function () {
    const canvas = document.getElementById('rain-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, dpr;
    const drops = [];
    const DROP_COUNT = 40;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr, dpr);
    }

    function makeDrop() {
        const r = 1 + Math.random() * 3;
        return {
            x:  Math.random() * (W || window.innerWidth),
            y:  Math.random() * (H || window.innerHeight),
            r,
            ry: r * (0.9 + Math.random() * 0.5),
            dy: Math.random() < 0.25 ? 0.1 + Math.random() * 0.2 : 0,
            alpha: 0.05 + Math.random() * 0.1,
            glint: Math.random() < 0.3,
        };
    }

    function init() {
        resize();
        for (let i = 0; i < DROP_COUNT; i++) drops.push(makeDrop());
    }

    function drawDrop(d) {
        ctx.save();
        ctx.globalAlpha = d.alpha;

        const g = ctx.createRadialGradient(
            d.x - d.r * 0.3, d.y - d.ry * 0.3, 0,
            d.x, d.y, Math.max(d.r, d.ry)
        );
        g.addColorStop(0,   'rgba(0, 200, 140, 0.5)');
        g.addColorStop(0.5, 'rgba(0, 140, 100, 0.2)');
        g.addColorStop(1,   'rgba(0, 100, 70, 0.0)');

        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r, d.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 168, 120, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (d.glint) {
            ctx.globalAlpha = d.alpha * 1.8;
            ctx.beginPath();
            ctx.ellipse(d.x - d.r * 0.28, d.y - d.ry * 0.3, d.r * 0.2, d.ry * 0.15, -0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 180, 0.6)';
            ctx.fill();
        }
        ctx.restore();
    }

    function frame() {
        ctx.clearRect(0, 0, W, H);
        drops.forEach(d => {
            drawDrop(d);
            if (d.dy > 0) {
                d.y += d.dy;
                if (d.y - d.ry > H) { d.y = -d.ry; d.x = Math.random() * W; }
            }
        });
        requestAnimationFrame(frame);
    }

    init();
    frame();
    window.addEventListener('resize', resize);
})();


// ─── HEADER VISIBILITY ──────────────────────────────────────────────────────────
(function () {
    const header = document.getElementById('site-header');
    const hero   = document.getElementById('hero');
    window.addEventListener('scroll', () => {
        if (window.scrollY > hero.offsetHeight * 0.38) header.classList.add('visible');
        else header.classList.remove('visible');
    }, { passive: true });
})();


// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────────
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


// ─── HERO ENTRANCE ──────────────────────────────────────────────────────────────
(function () {
    const wrap = document.querySelector('.hero-wrap');
    if (!wrap) return;
    wrap.style.cssText = 'opacity:0;transform:translateY(20px);transition:opacity 1.2s cubic-bezier(.22,1,.36,1),transform 1.2s cubic-bezier(.22,1,.36,1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        wrap.style.opacity   = '1';
        wrap.style.transform = 'none';
    }));

    const deco = document.querySelector('.hero-deco');
    if (deco) {
        deco.style.cssText = 'opacity:0;transition:opacity 1.5s 0.6s ease';
        requestAnimationFrame(() => requestAnimationFrame(() => { deco.style.opacity = '1'; }));
    }
})();


// ─── SKILL CARDS STAGGER ────────────────────────────────────────────────────────
(function () {
    const cards = [...document.querySelectorAll('.skill-card')];
    cards.forEach((c, i) => {
        c.style.cssText = `opacity:0;transform:translateY(8px);transition:opacity .45s ${i*0.04}s ease,transform .45s ${i*0.04}s ease`;
    });
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
            obs.disconnect();
        }
    }, { threshold: 0.1 });
    const grid = document.querySelector('.skills-grid');
    if (grid) obs.observe(grid);
})();


// ─── CONTACT FORM ───────────────────────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-send');
    btn.innerHTML = `Sent ✓`;
    btn.style.background = '#00855f';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
    }, 3000);
});