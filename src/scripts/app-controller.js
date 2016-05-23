const SLIDE_DIMENSIONS = {
  width: 1080,
  height: 1080 * (9 / 16)
}

class AppController {
  constructor() {
    this.numberSlides();
    this.fitSlideToWindow();
  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides[0].isVisible = true;

    slides.forEach((slide, index) => {
      slide.pageNumber = index;
    });
  }

  fitSlideToWindow() {
    const scaleFactor = document.body.clientWidth / SLIDE_DIMENSIONS.width;
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.style.transformOrigin = '0 0';
      slide.style.transform = `scale(${scaleFactor})`;
    });
  }
}

window.addEventListener('load', () => {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.SlideController =
    window.GauntFace.SlideController || new AppController();
});
