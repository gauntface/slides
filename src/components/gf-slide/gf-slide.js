'use strict';

/* global SLIDE_DIMENSIONS */

const gfSlideDoc = document.currentScript.ownerDocument;

class GFSlide extends HTMLElement {

  constructor() {
    super();

    // const shadowRoot = this.attachShadow({mode: 'open'});
    const template = gfSlideDoc.querySelector('#template');
    const templateClone = template.content.cloneNode(true);
    const wrapper = templateClone.querySelector('.gf-slide__wrapper');
    while (this.childNodes.length > 0) {
      wrapper.appendChild(this.childNodes[0]);
    }
    this.appendChild(templateClone);

    this._slideWrapper = this.querySelector('.gf-slide__wrapper');
  }

  connectedCallback() {
    // NOOP
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

window.customElements.define('gf-slide', GFSlide);
