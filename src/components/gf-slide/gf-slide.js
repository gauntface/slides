'use strict';

/* global SLIDE_DIMENSIONS */

const gfSlideDoc = document.currentScript.ownerDocument;

class GFSlide extends HTMLElement {

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    const template = gfSlideDoc.querySelector('#template');
    root.appendChild(template.content.cloneNode(true));

    this._slideWrapper = this.shadowRoot.querySelector('.gf-slide__wrapper');
  }

  connectedCallback() {
    console.log('[gf-slide.js] connectedCallback()');
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set pageNumber(pageNumber) {
    this._pageNumber = pageNumber;
    const pageNumberElement = this.shadowRoot.querySelector(
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
    this.style.width = (SLIDE_DIMENSIONS.width * scaleFactor) + 'px';
    this.style.height = (SLIDE_DIMENSIONS.height * scaleFactor) + 'px';
  }
}

window.customElements.define('gf-slide', GFSlide);
