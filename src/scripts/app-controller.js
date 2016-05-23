class AppController {
  constructor() {
    this.numberSlides();
  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides[0].isVisible = true;
    
    slides.forEach((slide, index) => {
      slide.pageNumber = index;
    });
  }
}

window.addEventListener('load', () => {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.SlideController =
    window.GauntFace.SlideController || new AppController();
});
