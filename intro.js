// Shorter, elegant intro for non-home pages (75%+ polish)

const introSlides = [
    {
        img: "TopAmatuer.png",
        caption: "Welcome to Michael Karanga Golf Foundation"
    },
    {
        img: "Kiambu win.png",
        caption: "Excellence. Community. Growth."
    }
];

const PUZZLE_DURATION = 900;
const PUZZLE_GLOW = 400;
const SLIDE_DURATION = 1700;
const SLIDE_FADE = 400;
const OUTRO_FADE = 800;
const INTRO_TOTAL = PUZZLE_DURATION + PUZZLE_GLOW + introSlides.length * SLIDE_DURATION + OUTRO_FADE;

if (!document.getElementById('ea-intro')) {
    introSlides.forEach(s => {
        const img = new window.Image();
        img.src = s.img;
    });

    const puzzleHTML = `
        <div class="ea-puzzle">
            <div class="ea-piece ea-piece-topleft"></div>
            <div class="ea-piece ea-piece-topright"></div>
            <div class="ea-piece ea-piece-bottomleft"></div>
            <div class="ea-piece ea-piece-bottomright"></div>
        </div>
    `;

    const slidesHTML = introSlides.map((slide, i) =>
        `<div class="ea-slide" id="ea-slide${i}" aria-hidden="true">
            <div class="ea-bg-anim" style="background-image:url('${slide.img}');"></div>
            <div class="ea-slide-caption">${slide.caption}</div>
        </div>`
    ).join('');

    const introDiv = document.createElement('div');
    introDiv.id = 'ea-intro';
    introDiv.setAttribute('role', 'dialog');
    introDiv.setAttribute('aria-modal', 'true');
    introDiv.setAttribute('aria-label', 'Page intro animation');
    introDiv.innerHTML = `
        <canvas id="ea-starfield" aria-hidden="true"></canvas>
        <div class="ea-gradient-overlay"></div>
        <div class="ea-puzzle-container">${puzzleHTML}</div>
        <div class="ea-slides">${slidesHTML}</div>
        <div class="ea-logo-container" style="opacity:0;">
            <img src="logo.png" alt="MK Golf Logo" class="ea-logo">
        </div>
        <button class="ea-skip" aria-label="Skip intro" tabindex="0">Skip</button>
    `;
    document.body.prepend(introDiv);

    // Google Fonts for Pacifico
    const fontLink = document.createElement('link');
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css?family=Pacifico:400&display=swap";
    document.head.appendChild(fontLink);

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
    #ea-intro {
        position: fixed;
        z-index: 9999;
        inset: 0;
        background: radial-gradient(ellipse at center, #0a1a2a 0%, #1a3a4a 100%);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex-direction: column;
        transition: opacity ${OUTRO_FADE}ms, filter 0.7s;
        opacity: 0;
        overflow: hidden;
        animation: intro-fadein 0.7s both;
    }
    @keyframes intro-fadein {
        from { opacity: 0; filter: blur(8px);}
        to { opacity: 1; filter: blur(0);}
    }
    #ea-starfield {
        position: absolute;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        display: block;
    }
    .ea-gradient-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background: linear-gradient(180deg, #0a1a2a88 0%, #1a3a4a00 60%, #0a1a2a99 100%);
        opacity: 0.7;
    }
    .ea-puzzle-container {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
    .ea-puzzle {
        width: 200px; height: 200px;
        position: relative;
        margin: auto;
    }
    .ea-piece {
        width: 70px; height: 70px;
        background: #fff;
        border-radius: 18px 30px 18px 30px / 30px 18px 30px 18px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 0 0 3px #fff;
        position: absolute;
        opacity: 0;
        transition: all 0.7s cubic-bezier(.4,2,.6,1);
        pointer-events: none;
    }
    .ea-piece-topleft { left: -80px; top: -80px; }
    .ea-piece-topright { right: -80px; top: -80px; }
    .ea-piece-bottomleft { left: -80px; bottom: -80px; }
    .ea-piece-bottomright { right: -80px; bottom: -80px; }
    .ea-piece.in { opacity: 1; }
    .ea-piece.assembled {
        left: 0 !important; right: auto !important; top: 0 !important; bottom: auto !important;
        transform: translate(50px,50px) scale(1.08) rotate(0deg);
        box-shadow: 0 8px 24px #f9d92399, 0 0 0 6px #fff6;
    }
    .ea-piece-topleft.assembled { transform: translate(0,0) scale(1.08) rotate(-6deg);}
    .ea-piece-topright.assembled { transform: translate(100px,0) scale(1.08) rotate(6deg);}
    .ea-piece-bottomleft.assembled { transform: translate(0,100px) scale(1.08) rotate(6deg);}
    .ea-piece-bottomright.assembled { transform: translate(100px,100px) scale(1.08) rotate(-6deg);}
    .ea-piece.glow {
        box-shadow: 0 0 30px 15px #f9d923cc, 0 0 0 9px #fff;
        background: #f9d923;
        transition: box-shadow 0.5s, background 0.5s;
    }
    .ea-logo-container {
        position: absolute;
        left: 50%;
        bottom: 3.5vh;
        transform: translateX(-50%);
        z-index: 4;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: opacity 0.7s, bottom 0.7s;
        pointer-events: none;
        opacity: 0;
        animation: logo-slideup 0.7s 0.1s both;
    }
    @keyframes logo-slideup {
        from { opacity: 0; bottom: -40px; }
        to { opacity: 1; bottom: 3.5vh; }
    }
    .ea-logo {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        box-shadow: 0 0 40px 10px #f9d92388, 0 0 0 5px #fff;
        background: #fff;
        margin-bottom: 0.7rem;
        animation: logo-glow 1.5s infinite alternate;
    }
    @keyframes logo-glow {
        from { box-shadow: 0 0 40px 10px #f9d92388, 0 0 0 5px #fff; }
        to { box-shadow: 0 0 60px 15px #f9d923cc, 0 0 0 9px #fff; }
    }
    .ea-slides {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
    .ea-slide {
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%,-50%);
        width: 100vw; height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s;
        pointer-events: none;
    }
    .ea-slide.active { opacity: 1; z-index: 2; }
    .ea-bg-anim {
        position: absolute;
        left: 50%; top: 50%;
        width: 100vw; height: 100vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        filter: blur(14px) brightness(0.8) saturate(1.2);
        opacity: 0.1;
        transform: translate(-50%,-50%) scale(1.08) rotate(0deg);
        transition: filter 0.8s, opacity 0.8s, transform 1.2s;
        z-index: 1;
        will-change: filter, opacity, transform;
        pointer-events: none;
    }
    .ea-bg-anim.clear {
        filter: blur(0px) brightness(1) saturate(1.1);
        opacity: 0.7;
        transform: translate(-50%,-50%) scale(1.01) rotate(2deg);
    }
    .ea-slide-caption {
        z-index: 2;
        font-family: 'Pacifico', 'Brush Script MT', cursive, 'Segoe UI', Arial, sans-serif;
        font-size: 1.4rem;
        color: #fff;
        text-shadow: 0 2px 14px #1a4d2e, 0 0 8px #f9d923;
        background: rgba(26,77,46,0.65);
        padding: 0.5em 1.2em;
        border-radius: 1.2em;
        margin-top: 0.5em;
        letter-spacing: 0.07em;
        animation: caption-fadein 0.7s;
        text-align: center;
        pointer-events: none;
    }
    .ea-skip {
        position: absolute;
        top: 2vw;
        right: 2vw;
        z-index: 10;
        background: #f9d923;
        color: #1a1a1a;
        border: none;
        border-radius: 1.5em;
        padding: 0.5em 1.2em;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 8px #0002;
        opacity: 0.85;
        transition: background 0.2s, color 0.2s;
    }
    .ea-skip:focus {
        outline: 2px solid #1a4d2e;
        outline-offset: 2px;
    }
    .ea-skip:hover {
        background: #1a4d2e;
        color: #fff;
    }
    @keyframes caption-fadein {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    #ea-intro.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity ${OUTRO_FADE}ms;
    }
    @media (max-width: 600px) {
        .ea-slide-caption { font-size: 1rem; padding: 0.4em 0.7em;}
        .ea-logo { width: 40px; height: 40px;}
        .ea-puzzle { width: 100px; height: 100px;}
        .ea-piece { width: 30px; height: 30px;}
        .ea-logo-container { bottom: 1vh; }
    }
    @media (prefers-reduced-motion: reduce) {
        * { transition: none !important; animation: none !important; }
    }
    `;
    document.head.appendChild(style);
}

// Starfield Animation
function eaStarfield() {
    const canvas = document.getElementById('ea-starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    let stars = Array.from({length: 50}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1 + 0.2,
        s: Math.random() * 0.5 + 0.1
    }));
    function draw() {
        ctx.clearRect(0,0,w,h);
        ctx.save();
        ctx.globalAlpha = 0.7;
        for (let star of stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#f9d923";
            ctx.shadowBlur = 6;
            ctx.fill();
            star.x += star.s;
            if (star.x > w) { star.x = 0; star.y = Math.random() * h; }
        }
        ctx.restore();
        requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => {
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w; canvas.height = h;
    });
}
setTimeout(eaStarfield, 50);

// Animation logic
window.addEventListener('DOMContentLoaded', function() {
    const intro = document.getElementById('ea-intro');
    const pieces = [
        document.querySelector('.ea-piece-topleft'),
        document.querySelector('.ea-piece-topright'),
        document.querySelector('.ea-piece-bottomleft'),
        document.querySelector('.ea-piece-bottomright')
    ];
    const logoContainer = document.querySelector('.ea-logo-container');
    const slidesEls = Array.from(document.querySelectorAll('.ea-slide'));
    const bgAnims = Array.from(document.querySelectorAll('.ea-bg-anim'));
    const skipBtn = document.querySelector('.ea-skip');

    skipBtn.focus();
    intro.addEventListener('keydown', function(e) {
        if (e.key === "Tab") {
            e.preventDefault();
            skipBtn.focus();
        }
        if (e.key === "Escape") {
            skipBtn.click();
        }
        if ((e.key === "Enter" || e.key === " ") && document.activeElement === skipBtn) {
            skipBtn.click();
        }
    });

    pieces.forEach((piece, i) => {
        setTimeout(() => {
            piece.classList.add('in');
            setTimeout(() => {
                piece.classList.add('assembled');
            }, 400);
        }, i * 180 + 100);
    });

    setTimeout(() => {
        pieces.forEach(piece => piece.classList.add('glow'));
    }, PUZZLE_DURATION);

    setTimeout(() => {
        document.querySelector('.ea-puzzle-container').style.opacity = 0;
        logoContainer.style.opacity = 1;
        logoContainer.style.bottom = '3.5vh';
    }, PUZZLE_DURATION + PUZZLE_GLOW);

    let current = 0;
    function showSlide(idx) {
        slidesEls.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
            slide.setAttribute('aria-hidden', i !== idx);
        });
        bgAnims.forEach((bg, i) => {
            bg.classList.remove('clear');
            bg.style.opacity = (i === idx) ? 0.1 : 0;
        });
        const bg = bgAnims[idx];
        setTimeout(() => {
            bg.classList.add('clear');
        }, 150);
        setTimeout(() => {
            bg.classList.remove('clear');
            if (idx + 1 < slidesEls.length) {
                showSlide(idx + 1);
            }
        }, SLIDE_DURATION - SLIDE_FADE);
    }
    setTimeout(() => {
        showSlide(0);
    }, PUZZLE_DURATION + PUZZLE_GLOW + 200);

    setTimeout(() => {
        logoContainer.style.opacity = 0;
    }, INTRO_TOTAL - OUTRO_FADE - 200);

    setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
        }, OUTRO_FADE);
    }, INTRO_TOTAL);

    skipBtn.onclick = () => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
        }, OUTRO_FADE);
    };
});