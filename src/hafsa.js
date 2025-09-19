function toggleMenu() {
    document.querySelector("nav ul").classList.toggle("active");
  }

let currentSlide = 0;
    const slides = document.getElementById('slides');
    const totalSlides = slides.children.length;
    const slideWidth = slides.children[0].clientWidth;

    function updateSlidePosition() {
      slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlidePosition();
    }
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlidePosition();
    }
    setInterval(nextSlide, 8000); // Auto-slide every 5 seconds
    window.addEventListener('resize', () => {
      updateSlidePosition();
    });
    updateSlidePosition();