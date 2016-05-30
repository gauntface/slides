'use strict';

const componentDoc = document.currentScript.ownerDocument;

class GFSlide extends HTMLElement {
  attachedCallback() {
    console.log('[gf-slide.js] attached()');
  }

  createdCallback() {
    const root = this.createShadowRoot();

    const template = componentDoc.querySelector('#template');
    const clone = document.importNode(template.content, true);

    root.appendChild(clone);

    this._slideWrapper = this.shadowRoot.querySelector('.gf-slide__wrapper');
  }

  get isVisible() {
    return this.classList.contains('is-visible');
  }

  set isVisible(isVisible) {
    if (isVisible){
        this.classList.add('is-visible');
    } else {
      this.classList.remove('is-visible');
    }
  }

  get pageNumber() {
    return this._pageNumber;
  }

  set pageNumber(pageNumber) {
    this._pageNumber = pageNumber;
    const pageNumberElement = this.shadowRoot.querySelector('.gf-slide__page-number');
    if (!pageNumberElement) {
      return;
    }
    pageNumberElement.textContent = pageNumber;
  }

  set scaleFactor(scaleFactor) {
    this._slideWrapper.style.transform = `scale(${scaleFactor})`;
    this.style.width = (SLIDE_DIMENSIONS.width * scaleFactor) +'px';
    this.style.height = (SLIDE_DIMENSIONS.height * scaleFactor) +'px';
  }
}

document.registerElement('gf-slide', {
  prototype: GFSlide.prototype,
});
