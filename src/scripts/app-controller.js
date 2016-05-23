const SLIDE_DIMENSIONS = {
  width: 1080,
  height: 1080 * (9 / 16)
}

class AppController {
  constructor() {
    this.MODE = {
      OVERVIEW: Symbol('MODE_OVERVIEW'),
      PRESENT: Symbol('MODE_PRESENT')
    };

    this.numberSlides();

    this.setMode(this.MODE.OVERVIEW)

  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.pageNumber = index;
    });
  }

  setMode(newMode) {

    document.body.classList.remove('is-overview');
    document.body.classList.remove('is-presenting');

    switch(newMode) {
      case this.MODE.OVERVIEW:
        const scaleFactor = 300 / SLIDE_DIMENSIONS.width;
        const slides = document.querySelectorAll('gf-slide');
        slides.forEach((slide, index) => {
          slide.isVisible = true;
          slide.scaleFactor = scaleFactor;
        });
        document.body.classList.add('is-overview');
        break;
      case this.MODE.PRESENT:
        document.body.classList.add('is-presenting');
        break;
      default:
        throw Error('setMode(): Unknown mode type.');
    };

    this._mode = newMode;
  }

  fitSlideToWindow() {
    const wScaleFactor = document.body.clientWidth / SLIDE_DIMENSIONS.width;
    const hScaleFactor = document.body.clientHeight / SLIDE_DIMENSIONS.height;
    const scaleFactor = Math.min(wScaleFactor, hScaleFactor);
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.style.transform = `scale(${scaleFactor})`;
    });
  }
}

window.addEventListener('load', () => {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.SlideController =
    window.GauntFace.SlideController || new AppController();
});

window.addEventListener('resize', () => {

});
