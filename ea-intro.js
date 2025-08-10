// === CONFIGURE YOUR BACKGROUND PNG IMAGES AND CAPTIONS ===
const slides = [
    {
        img: "KarenChallenge.png",
        caption: "Welcome to Michael Karanga Golf Foundation"
    },
    {
        img: "TopAmatuer.png",
        caption: "Championing Youth, Inspiring Kenya"
    },
    {
        img: "Kiambu win.png",
        caption: "Driving Distinction, Swinging Success"
    }
];

// === TIMINGS (ms) ===
const PUZZLE_DURATION = 2000;
const PUZZLE_GLOW = 600;
const SLIDE_DURATION = 3200; // per slide
const SLIDE_UNBLUR = 1200;
const SLIDE_FADE = 600;
const OUTRO_FADE = 1200;
const INTRO_TOTAL = PUZZLE_DURATION + PUZZLE_GLOW + slides.length * SLIDE_DURATION + OUTRO_FADE;

// === Inject HTML and CSS ===
if (!document.getElementById('ea-intro')) {
    // Puzzle pieces HTML (4 corners)
    const puzzleHTML = `
        <div class="ea-puzzle">
            <div class="ea-piece ea-piece-topleft"></div>
            <div class="ea-piece ea-piece-topright"></div>
            <div class="ea-piece ea-piece-bottomleft"></div>
            <div class="ea-piece ea-piece-bottomright"></div>
        </div>
    `;

    // Slideshow HTML (each slide overlays the animated PNG background)
    const slidesHTML = slides.map((slide, i) =>
        `<div class="ea-slide" id="ea-slide${i}">
            <div class="ea-bg-anim" style="background-image:url('${slide.img}');"></div>
            <div class="ea-slide-caption">${slide.caption}</div>
        </div>`
    ).join('');

    // Main intro overlay
    const introDiv = document.createElement('div');
    introDiv.id = 'ea-intro';
    introDiv.setAttribute('role', 'dialog');
    introDiv.setAttribute('aria-label', 'Site intro animation');
    introDiv.innerHTML = `
        <canvas id="ea-starfield" aria-hidden="true"></canvas>
        <div class="ea-puzzle-container">${puzzleHTML}</div>
        <div class="ea-slides">${slidesHTML}</div>
        <div class="ea-logo-container" style="opacity:0;">
            <img src="logo.png" alt="MK Golf Logo" class="ea-logo">
        </div>
        <button class="ea-skip" aria-label="Skip intro">Skip</button>
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
        transition: opacity ${OUTRO_FADE}ms;
        opacity: 1;
        height: auto;
        overflow: hidden;
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
        width: 320px; height: 320px;
        position: relative;
        margin: auto;
    }
    .ea-piece {
        width: 120px; height: 120px;
        background: #fff;
        border-radius: 28px 50px 28px 50px / 50px 28px 50px 28px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 0 0 6px #fff;
        position: absolute;
        opacity: 0;
        transition: all 0.9s cubic-bezier(.4,2,.6,1);
        pointer-events: none;
    }
    .ea-piece-topleft { left: -140px; top: -140px; }
    .ea-piece-topright { right: -140px; top: -140px; }
    .ea-piece-bottomleft { left: -140px; bottom: -140px; }
    .ea-piece-bottomright { right: -140px; bottom: -140px; }
    .ea-piece.in { opacity: 1; }
    .ea-piece.assembled {
        left: 0 !important; right: auto !important; top: 0 !important; bottom: auto !important;
        transform: translate(100px,100px) scale(1.1) rotate(0deg);
        box-shadow: 0 12px 40px #f9d92399, 0 0 0 10px #fff6;
    }
    .ea-piece-topleft.assembled { transform: translate(0,0) scale(1.1) rotate(-6deg);}
    .ea-piece-topright.assembled { transform: translate(200px,0) scale(1.1) rotate(6deg);}
    .ea-piece-bottomleft.assembled { transform: translate(0,200px) scale(1.1) rotate(6deg);}
    .ea-piece-bottomright.assembled { transform: translate(200px,200px) scale(1.1) rotate(-6deg);}
    .ea-piece.glow {
        box-shadow: 0 0 60px 30px #f9d923cc, 0 0 0 18px #fff;
        background: #f9d923;
        transition: box-shadow 0.6s, background 0.6s;
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
        transition: opacity 1.2s, bottom 1.2s;
        pointer-events: none;
        opacity: 0;
        animation: logo-slideup 1.2s 0.2s both;
    }
    @keyframes logo-slideup {
        from { opacity: 0; bottom: -80px; }
        to { opacity: 1; bottom: 3.5vh; }
    }
    .ea-logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: 0 0 80px 20px #f9d92388, 0 0 0 10px #fff;
        background: #fff;
        margin-bottom: 1.2rem;
        animation: logo-glow 2.5s infinite alternate;
    }
    @keyframes logo-glow {
        from { box-shadow: 0 0 80px 20px #f9d92388, 0 0 0 10px #fff; }
        to { box-shadow: 0 0 120px 30px #f9d923cc, 0 0 0 18px #fff; }
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
        transition: opacity 0.7s;
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
        filter: blur(18px) brightness(0.8) saturate(1.2);
        opacity: 0.1;
        transform: translate(-50%,-50%) scale(1.12) rotate(0deg);
        transition: filter 1.2s, opacity 1.2s, transform 2.2s;
        z-index: 1;
        will-change: filter, opacity, transform;
        pointer-events: none;
    }
    .ea-bg-anim.clear {
        filter: blur(0px) brightness(1) saturate(1.1);
        opacity: 0.7;
        transform: translate(-50%,-50%) scale(1.04) rotate(2deg);
    }
    .ea-slide-caption {
        z-index: 2;
        font-family: 'Pacifico', 'Brush Script MT', cursive, 'Segoe UI', Arial, sans-serif;
        font-size: 2.2rem;
        color: #fff;
        text-shadow: 0 2px 24px #1a4d2e, 0 0 12px #f9d923;
        background: rgba(26,77,46,0.65);
        padding: 0.7em 2em;
        border-radius: 1.5em;
        margin-top: 0.5em;
        letter-spacing: 0.07em;
        animation: caption-fadein 1.2s;
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
        padding: 0.6em 1.5em;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 8px #0002;
        opacity: 0.85;
        transition: background 0.2s, color 0.2s;
    }
    .ea-skip:hover {
        background: #1a4d2e;
        color: #fff;
    }
    @keyframes caption-fadein {
        from { opacity: 0; transform: translateY(40px);}
        to { opacity: 1; transform: translateY(0);}
    }
    #ea-intro.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity ${OUTRO_FADE}ms;
    }
    @media (max-width: 600px) {
        .ea-slide-caption { font-size: 1.2rem; padding: 0.5em 1em;}
        .ea-logo { width: 70px; height: 70px;}
        .ea-puzzle { width: 180px; height: 180px;}
        .ea-piece { width: 60px; height: 60px;}
        .ea-logo-container { bottom: 1vh; }
    }
    `;
    document.head.appendChild(style);
}

// === Starfield Animation ===
function eaStarfield() {
    const canvas = document.getElementById('ea-starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    let stars = Array.from({length: 80}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        s: Math.random() * 0.7 + 0.2
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
            ctx.shadowBlur = 8;
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
setTimeout(eaStarfield, 100);

// === Animation logic ===
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

    // 1. Animate puzzle pieces flying in from corners
    pieces.forEach((piece, i) => {
        setTimeout(() => {
            piece.classList.add('in');
            setTimeout(() => {
                piece.classList.add('assembled');
            }, 600);
        }, i * 350 + 200);
    });

    // 2. Glow assembled puzzle, then fade out puzzle and fade in logo
    setTimeout(() => {
        pieces.forEach(piece => piece.classList.add('glow'));
    }, PUZZLE_DURATION);

    setTimeout(() => {
        document.querySelector('.ea-puzzle-container').style.opacity = 0;
        logoContainer.style.opacity = 1;
        logoContainer.style.bottom = '3.5vh';
    }, PUZZLE_DURATION + PUZZLE_GLOW);

    // 3. Slideshow: show each image, unblur, then fade out for next
    let current = 0;
    function showSlide(idx) {
        slidesEls.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
        bgAnims.forEach((bg, i) => {
            bg.classList.remove('clear');
            bg.style.opacity = (i === idx) ? 0.1 : 0;
        });
        const bg = bgAnims[idx];
        setTimeout(() => {
            bg.classList.add('clear');
        }, 200);
        // Fade out after duration
        setTimeout(() => {
            bg.classList.remove('clear');
            if (idx + 1 < slidesEls.length) {
                showSlide(idx + 1);
            }
        }, SLIDE_DURATION - SLIDE_FADE);
    }
    setTimeout(() => {
        showSlide(0);
    }, PUZZLE_DURATION + PUZZLE_GLOW + 400);

    // 4. Fade out logo and intro at the end
    setTimeout(() => {
        logoContainer.style.opacity = 0;
    }, INTRO_TOTAL - OUTRO_FADE - 400);

    setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
        }, OUTRO_FADE);
    }, INTRO_TOTAL);

    // 5. Skip button
    skipBtn.onclick = () => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
        }, OUTRO_FADE);
    };
});