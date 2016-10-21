'use strict';

const gfSlideContainerDoc = document.currentScript.ownerDocument;

const SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080
};

const VIEWING_MODE = {
  OVERVIEW: Symbol('MODE_OVERVIEW'),
  PRESENT: Symbol('MODE_PRESENT')
};
class GFSlideContainer extends HTMLElement {

  constructor() {
    super();

    const template = gfSlideContainerDoc.querySelector('#template');
    this.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // TODO: Is this the right way to handle it? (i.e. no component resize)
    // TODO: How to remove this handle when component is removed
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    this._currentSlide = -1;

    this.numberSlides();
    this.handleURLChange();

    this.setUpKeyListeners();
  }

  handleURLChange() {
    if (window.location.hash.length === 0) {
      this.setMode(VIEWING_MODE.OVERVIEW);
    } else {
      const slideNumber = parseInt(window.location.hash.slice(1), 10);
      this.goToSlide(slideNumber);
      this.setMode(VIEWING_MODE.PRESENT);
    }
  }

  numberSlides() {
    const slides = this.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.pageNumber = index + 1;
    });
  }

  handleResize() {
    this.setMode(this._mode);
  }

  fitSlideInComponent() {
    return new Promise((resolve) => {
      // Wait for body of document to be updated with new width and height
      window.requestAnimationFrame(() => {
        const bodyRect = this.getBoundingClientRect();

        const wScaleFactor = bodyRect.width / SLIDE_DIMENSIONS.width;
        const hScaleFactor = bodyRect.height / SLIDE_DIMENSIONS.height;

        const scaleFactor = Math.min(wScaleFactor, hScaleFactor);
        const slides = this.querySelectorAll('gf-slide');
        slides.forEach((slide) => {
          slide.scaleFactor = scaleFactor;
        });

        resolve();
      });
    });
  }

  setMode(newMode) {
    this.removeAttribute('is-overview');
    this.removeAttribute('is-presenting');
    document.body.removeAttribute('is-overview');
    document.body.removeAttribute('is-presenting');

    const slides = this.querySelectorAll('gf-slide');

    switch (newMode) {
      case VIEWING_MODE.OVERVIEW: {
        // Set this first so styles are applied to gf-slide-container first.
        this.setAttribute('is-overview', true);
        document.body.setAttribute('is-overview', true);

        const scaleFactor = 300 / SLIDE_DIMENSIONS.width;

        slides.forEach((slide) => {
          slide.isVisible = true;
          slide.scaleFactor = scaleFactor;
        });
        break;
      }
      case VIEWING_MODE.PRESENT: {
        // Set this first so styles are applied to gf-slide-container first.
        this.setAttribute('is-presenting', true);
        document.body.setAttribute('is-presenting', true);
        this.fitSlideInComponent()
        .then(() => {
          slides.forEach((slide, index) => {
            slide.isVisible = (index === this._currentSlide);
          });
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
      case VIEWING_MODE.OVERVIEW:
        this.goToSlide(index);
        this.setMode(VIEWING_MODE.PRESENT);
        break;
      case VIEWING_MODE.PRESENT:
        this.moveToNextSlide();
        break;
      default:
        throw Error('onSlideClick(): Unknown mode type.');
    }
  }

  manageSlideTransition(previousIndex, newIndex) {
    const slides = this.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      if (index === newIndex) {
        if (newIndex < previousIndex) {
          slide.showAllBuilds();
        }

        slide.isVisible = true;
      } else {
        slide.isVisible = false;
      }
    });
  }

  goToSlide(index) {
    const slides = this.querySelectorAll('gf-slide');
    if (isNaN(index) || index < 0) {
      index = 0;
    } else if (index >= slides.length) {
      index = slides.length - 1;
    }

    const previousSlideIndex = this._currentSlide;

    this._currentSlide = index;
    window.location.hash = this._currentSlide;

    this.manageSlideTransition(previousSlideIndex, this._currentSlide);
  }

  moveToPrevSlide() {
    const slides = this.querySelectorAll('gf-slide');
    const currentSlide = slides[this._currentSlide];
    const buildPerformed = currentSlide.performBuildBackwards();
    if (!buildPerformed) {
      this.goToSlide(this._currentSlide - 1);
    }
  }

  moveToNextSlide() {
    const slides = this.querySelectorAll('gf-slide');
    const currentSlide = slides[this._currentSlide];
    const buildPerformed = currentSlide.performBuildForward();
    if (!buildPerformed) {
      this.goToSlide(this._currentSlide + 1);
    }
  }

  setUpKeyListeners() {
    const slides = document.querySelectorAll('gf-slide');
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => this.onSlideClick(index));
    });

    window.addEventListener('keyup', (event) => {
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
          location.hash = '';
          this.setMode(VIEWING_MODE.OVERVIEW);
          break;
        default:
          // Disgusting selenium debug hack / trick.....
          /** document.body.style.background = 'white';
          document.body.textContent = JSON.stringify({
            charCode: event.charCode,
            keyCode: event.keyCode,
            key: event.key
          });**/
          break;
      }
    });
  }
}

window.customElements.define('gf-slide-container', GFSlideContainer);
