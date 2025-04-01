// This file manages the stylized dots that indicate the current slide in the carousel.

class Indicators {
    constructor(totalSlides) {
        this.totalSlides = totalSlides;
        this.currentSlide = 0;
        this.indicatorContainer = document.createElement('div');
        this.indicatorContainer.className = 'indicator-container';
        this.renderIndicators();
    }

    renderIndicators() {
        this.indicatorContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicatorContainer.appendChild(dot);
        }
        this.updateIndicators();
    }

    updateIndicators() {
        const dots = this.indicatorContainer.children;
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === this.currentSlide);
        }
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateIndicators();
        // Trigger the carousel to change to the selected slide
        const event = new CustomEvent('slideChange', { detail: { slideIndex } });
        document.dispatchEvent(event);
    }

    getIndicatorContainer() {
        return this.indicatorContainer;
    }

    setCurrentSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateIndicators();
    }
}

export default Indicators;