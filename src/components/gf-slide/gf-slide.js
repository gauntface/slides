'use strict';

/* global SLIDE_DIMENSIONS */

class GFSlide extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      @import "/src/components/gf-slide/gf-slide.css";
    </style>
    <main class="gf-slide__wrapper">
      <div class="gf-slide__page-number">
      </div>
    </main>`;
    const wrapper = template.content.querySelector('.gf-slide__wrapper');
    while (this.childNodes.length > 0) {
      wrapper.appendChild(this.childNodes[0]);
    }
    this.appendChild(template);

    this._slideWrapper = template.content.querySelector('.gf-slide__wrapper');
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set pageNumber(pageNumber) {
    this._pageNumber = pageNumber;
    const pageNumberElement = this.querySelector(
      '.gf-slide__page-number');
    if (!pageNumberElement) {
      return;
    }
    pageNumberElement.textContent = pageNumber;
  }

  set isVisible(isVisible) {
    if (isVisible) {
      this.setAttribute('is-visible', true);
    } else {
      this.removeAttribute('is-visible');
    }
  }

  set scaleFactor(scaleFactor) {
    this._slideWrapper.style.transform = `scale(${scaleFactor})`;
    this.style.width = (Math.floor(SLIDE_DIMENSIONS.width * scaleFactor))
      + 'px';
    this.style.height = (Math.floor(SLIDE_DIMENSIONS.height * scaleFactor))
      + 'px';
  }

  performBuildForward() {
    const buildElements = this.querySelectorAll('[build]');
    for (let i = 0; i < buildElements.length; i++) {
      const buildElement = buildElements[i];
      if (buildElement.getAttribute('build') !== 'built') {
        buildElement.setAttribute('build', 'built');
        return true;
      }
    }
    return false;
  }

  performBuildBackwards() {
    const buildElements = this.querySelectorAll('[build]');
    for (let i = buildElements.length - 1; i >= 0; i--) {
      const buildElement = buildElements[i];
      if (buildElement.getAttribute('build') === 'built') {
        buildElement.setAttribute('build', '');
        return true;
      }
    }
    return false;
  }

  showAllBuilds() {
    const buildElements = this.querySelectorAll('[build]');
    for (let i = buildElements.length - 1; i >= 0; i--) {
      const buildElement = buildElements[i];
      buildElement.setAttribute('build', 'built');
    }
  }
}

/** if (window.customElements) {
  window.customElements.define('gf-slide', GFSlide);
} else {
  window.addEventListener('WebComponentsReady', function() {
    window.customElements.define('gf-slide', GFSlide);
  });
}**/
window.addEventListener('WebComponentsReady', function() {
  window.customElements.define('gf-slide', GFSlide);
});
