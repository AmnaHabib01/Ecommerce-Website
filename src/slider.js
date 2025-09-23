const track = document.querySelector('.slider-track');
const slides = Array.from(track.children); // now .slide divs
const prevBtn = document.querySelector('.arrow.left');
const nextBtn = document.querySelector('.arrow.right');

let slideWidth;
let index;
let visibleSlides;

// Set up slider with proper width, clones, and starting index
function setupSlider() {
  slideWidth = slides[0].offsetWidth + 20;
  visibleSlides = window.innerWidth <= 768 ? 1 : 4;

  // Remove previous clones if any
  document.querySelectorAll('.clone').forEach(el => el.remove());

  // Clone last few slides at beginning
  const clonesBefore = slides.slice(-visibleSlides).map(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
    return clone;
  });

  // Clone first few slides at end
  const clonesAfter = slides.slice(0, visibleSlides).map(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    track.appendChild(clone);
    return clone;
  });

  index = visibleSlides;
  moveToIndex(false);
}

// Move to current index
function moveToIndex(animate = true) {
  track.style.transition = animate ? 'transform 0.4s ease-in-out' : 'none';
  const offset = index * slideWidth;
  track.style.transform = `translateX(-${offset}px)`;
}

// Go to next slide
function nextSlide() {
  index++;
  moveToIndex(true);

  track.addEventListener('transitionend', () => {
    const totalSlides = track.children.length;
    if (index >= totalSlides - visibleSlides) {
      index = visibleSlides;
      moveToIndex(false);
    }
  }, { once: true });
}

// Go to previous slide
function prevSlide() {
  index--;
  moveToIndex(true);

  track.addEventListener('transitionend', () => {
    if (index < 1) {
      index = track.children.length - visibleSlides * 2;
      moveToIndex(false);
    }
  }, { once: true });
}

// Event Listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Recalculate on resize
window.addEventListener('resize', setupSlider);

// Init on load
window.addEventListener('load', setupSlider);




