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

  setPageNumber(pageNumber) {
    const pageNumberElement = this.shadowRoot.querySelector('.gf-slide__page-number');
    pageNumberElement.textContent = pageNumber;
  }
}

document.registerElement('gf-slide', {
  prototype: GFSlide.prototype,
});
