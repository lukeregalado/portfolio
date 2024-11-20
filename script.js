// ================================= SEND A MESSAGE =================================
document.getElementById('contactForm')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  alert(`Thank you, ${name}! Your message has been received.`);
  this.reset();
});

// ================================= SCROLLING ANIMATIONS =================================
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1200, // Animation duration in milliseconds
        easing: 'ease-in-out', // Animation easing
        once: true, // Whether animation should happen only once
        mirror: false // Whether elements should animate out while scrolling past them
    });
});


// ================================= HEADER SCROLLING VISIBILITY =================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const heroHeight = document.getElementById('hero').offsetHeight;

    // Calculate the opacity based on scroll position
    const scrollPosition = window.scrollY;

    console.log(scrollPosition);
    const opacity = Math.min(scrollPosition / heroHeight, .8); // Fade from 0 to 1 as user scrolls

    console.log("Opacity: ", opacity);

    // Apply the calculated opacity to the header
    header.style.opacity = opacity;

    if (opacity > 0) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    }
});



// ================================= CURSOR DOTS =================================
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;

const dots = [];
const dotCount = 250;
const dotSpeed = 0.5;

// canvas resize (responsive)
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.scale(ratio, ratio);
}

function createDots() {
  for (let i = 0; i < dotCount; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      dx: Math.random() * dotSpeed - dotSpeed / 2,
      dy: Math.random() * dotSpeed - dotSpeed / 2,
    });
  }
}

function drawDots(mouseX, mouseY) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach((dot) => {
    // drawing floating dots
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#748CAB';
    ctx.fill();

    // make the dots move
    dot.x += dot.dx;
    dot.y += dot.dy;

    // if the dot/s hit an edge, bounce off
    if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;

    // draw lines from nearby dots to mouse
    const distance = Math.hypot(dot.x - mouseX, dot.y - mouseY);
    if (distance < 150) {
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(116, 140, 171, ${1 - distance / 150})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  // draw cursor dot
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2); // Radius of 5 for the cursor dot
  ctx.fillStyle = '#F0EBD8'; // Cursor dot color
  ctx.fill();
}


function animate() {
  requestAnimationFrame(animate);
  drawDots(mouse.x, mouse.y);
}

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse = {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// Initialize
resizeCanvas();
createDots();
animate();


// ================================= VIGNETTE AT BOTTOM OF PAGE =================================
// Show vignette when it user scrolls to bottom of page
const vignette = document.querySelector('.vignette');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight;
  const clientHeight = window.innerHeight;

  // Calculate the scroll position as a percentage
  const scrollPosition = scrollTop + clientHeight;
  const maxScroll = scrollHeight;

  // Fade in the vignette when near the bottom (last 20% of the page)
  if (scrollPosition > maxScroll * 0.8) {
    vignette.style.opacity = (scrollPosition - maxScroll * 0.8) / (maxScroll * 0.2);
  } else {
    vignette.style.opacity = 0;
  }
});

