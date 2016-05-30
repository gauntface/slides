const SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080
}

class AppController {
  constructor() {
    this.MODE = {
      OVERVIEW: Symbol('MODE_OVERVIEW'),
      PRESENT: Symbol('MODE_PRESENT')
    };

    this.numberSlides();

    if (window.location.hash.length === 0) {
      this.setMode(this.MODE.OVERVIEW);
    } else {
      this.setMode(this.MODE.PRESENT);
    }
  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.pageNumber = index + 1;
    });
  }

  setMode(newMode) {
    document.body.classList.remove('is-overview');
    document.body.classList.remove('is-presenting');

    const slides = document.querySelectorAll('gf-slide');

    switch(newMode) {
      case this.MODE.OVERVIEW:
        const scaleFactor = 300 / SLIDE_DIMENSIONS.width;
        slides.forEach((slide, index) => {
          slide.isVisible = true;
          slide.scaleFactor = scaleFactor;
          slide.addEventListener('click', () => this.onSlideClick(index));
        });
        document.body.classList.add('is-overview');
        break;
      case this.MODE.PRESENT:
        let indexNumber = parseInt(window.location.hash.replace('#', ''), 10);
        if (isNaN(indexNumber)) {
          indexNumber = 0;
        }

        document.body.classList.add('is-presenting');
        slides.forEach((slide, index) => {
          slide.isVisible = false;
        });
        this.fitSlideToWindow()
        .then(() => {
          slides.forEach((slide, index) => {
            slide.isVisible = (index === indexNumber);
          });
        });
        break;
      default:
        throw Error('setMode(): Unknown mode type.');
    };

    this._mode = newMode;
  }

  onSlideClick(index) {
    console.log('On Click', index);
    switch(this._mode) {
      case this.MODE.OVERVIEW:
        window.location.hash = index;
        this.setMode(this.MODE.PRESENT);
        break;
      default:
        throw Error('onSlideClick(): Unknown mode type.');
    }
  }

  fitSlideToWindow() {
    return new Promise(resolve => {
      // Wait for body of document to be updated with new width and height
      window.requestAnimationFrame(() => {
        const bodyRect = document.body.getBoundingClientRect();

        const wScaleFactor = bodyRect.width / SLIDE_DIMENSIONS.width;
        const hScaleFactor = bodyRect.height / SLIDE_DIMENSIONS.height;

        const scaleFactor = Math.min(wScaleFactor, hScaleFactor);
        const slides = document.querySelectorAll('gf-slide');
        slides.forEach((slide, index) => {
          slide.scaleFactor = scaleFactor;
          // slide.style.transform = `scale(${scaleFactor})`;
        });

        resolve();
      });
    });
  }

  handleResize() {
    this.setMode(this._mode);
  }
}

window.addEventListener('load', () => {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.SlideController =
    window.GauntFace.SlideController || new AppController();
});

window.addEventListener('resize', () => {
  window.GauntFace.SlideController.handleResize();
});
