'use strict';

const SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080
};

class AppController {
  constructor() {
    this.MODE = {
      OVERVIEW: Symbol('MODE_OVERVIEW'),
      PRESENT: Symbol('MODE_PRESENT')
    };
    this._currentSlide = -1;

    this.numberSlides();

    if (window.location.hash.length === 0) {
      this.setMode(this.MODE.OVERVIEW);
    } else {
      this._currentSlide = parseInt(window.location.hash.replace('#', ''), 10);
      this.setMode(this.MODE.PRESENT);
    }

    this.setUpKeyListeners();
  }

  numberSlides() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.pageNumber = index + 1;
    });
  }

  getMode() {
    return this._mode;
  }

  setMode(newMode) {
    document.body.classList.remove('is-overview');
    document.body.classList.remove('is-presenting');

    const slides = document.querySelectorAll('gf-slide');

    switch (newMode) {
      case this.MODE.OVERVIEW: {
        const scaleFactor = 300 / SLIDE_DIMENSIONS.width;
        slides.forEach(slide => {
          slide.isVisible = true;
          slide.scaleFactor = scaleFactor;
        });
        document.body.classList.add('is-overview');
        break;
      }
      case this.MODE.PRESENT: {
        document.body.classList.add('is-presenting');
        this.fitSlideToWindow()
        .then(() => {
          this.goToSlide(this._currentSlide);
        });
        break;
      }
      default: {
        throw Error('setMode(): Unknown mode type.');
      }
    }

    this._mode = newMode;
  }

  onSlideClick(index) {
    switch (this._mode) {
      case this.MODE.OVERVIEW:
        this.goToSlide(index);
        this.setMode(this.MODE.PRESENT);
        break;
      case this.MODE.PRESENT:
        this.goToSlide(index + 1);
        this.setMode(this.MODE.PRESENT);
        break;
      default:
        throw Error('onSlideClick(): Unknown mode type.');
    }
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('gf-slide');
    if (isNaN(index) || index < 0) {
      index = 0;
    } else if (index >= slides.length) {
      index = slides.length - 1;
    }

    this._currentSlide = index;
    window.location.hash = this._currentSlide;

    slides.forEach((slide, index) => {
      slide.isVisible = (index === this._currentSlide);
    });
  }

  moveToPrevSlide() {
    this.goToSlide(this._currentSlide - 1);
  }

  moveToNextSlide() {
    this.goToSlide(this._currentSlide + 1);
  }

  setUpKeyListeners() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => this.onSlideClick(index));
    });

    window.addEventListener('keyup', event => {
      // Should use event.key when support is better and selenium uses it.
      switch (event.keyCode) {
        case 40:
        case 37:
          // Arrow Down
          // Arrow Left
          this.moveToPrevSlide();
          break;
        case 38:
        case 39:
          // Arrow UP
          // Arrow Right
          this.moveToNextSlide();
          break;
        case 27:
          // Escape Key
          this.setMode(this.MODE.OVERVIEW);
          break;
        default:
          // Disgusting selenium debug hack / trick.....
          document.body.style.background = 'white';
          document.body.textContent = JSON.stringify({
            charCode: event.charCode,
            keyCode: event.keyCode,
            key: event.key
          });
          break;
      }
    });
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
        slides.forEach(slide => {
          slide.scaleFactor = scaleFactor;
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
