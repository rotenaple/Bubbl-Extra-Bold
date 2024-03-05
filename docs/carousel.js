function initializeCarousel(carousel) {
    let currentSlide = 0;
    const slides = carousel.querySelectorAll('.carousel-images .slide');
    const totalSlides = slides.length;

    const prevButton = document.createElement('button');
    prevButton.className = 'prev';
    prevButton.innerHTML = '&#10094;';
    carousel.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.className = 'next';
    nextButton.innerHTML = '&#10095;';
    carousel.appendChild(nextButton);

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    carousel.appendChild(dotsContainer);

    slides.forEach(() => {
        let dot = document.createElement('span');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
    });

    slides[0].classList.add('active');
    dotsContainer.children[0].classList.add('active');

    function updateSlide(newIndex) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');

        currentSlide = newIndex;

        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    prevButton.addEventListener('click', () => {
        let newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide(newIndex);
    });

    nextButton.addEventListener('click', () => {
        let newIndex = (currentSlide + 1) % totalSlides;
        updateSlide(newIndex);
    });

    dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlide(index));
    });
}

window.onload = function() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => initializeCarousel(carousel));
};
