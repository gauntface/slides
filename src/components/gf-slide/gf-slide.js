'use strict';

const componentDoc = document.currentScript.ownerDocument;

class GFSlide extends HTMLElement {
  attachedCallback() {
    console.log('[gf-slide.js] attached()');
  }

  createdCallback() {
    const template = componentDoc.querySelector('#template');
    const root = this.createShadowRoot();

    const clone = document.importNode(template.content, true);
    root.appendChild(clone);
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
    pageNumberElement.textContent = pageNumber;
  }
}

document.registerElement('gf-slide', {
  prototype: GFSlide.prototype,
});
