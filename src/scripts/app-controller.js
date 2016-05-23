class AppController {
  constructor() {
    this.numberSlides();
  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.setPageNumber(index);
    });
  }
}

window.addEventListener('load', () => {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.SlideController =
    window.GauntFace.SlideController || new AppController();
});
