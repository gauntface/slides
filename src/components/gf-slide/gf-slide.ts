import {adoptStyles} from '../../styles';
import css from './gf-slide.css';

adoptStyles(css);

export class GFSlide extends HTMLElement {
  #wrapper = document.createElement('div');
  #pageNumberElement = document.createElement('div');
  #pageNumber = 0;

  constructor() {
    super();
    this.#wrapper.className = 'gf-slide__wrapper';
    this.#pageNumberElement.className = 'gf-slide__page-number';
  }

  connectedCallback(): void {
    if (this.#wrapper.parentNode === this) {
      return;
    }
    this.#wrapper.append(this.#pageNumberElement, ...this.childNodes);
    this.append(this.#wrapper);
  }

  get pageNumber(): number {
    return this.#pageNumber;
  }

  set pageNumber(pageNumber: number) {
    this.#pageNumber = pageNumber;
    this.#pageNumberElement.textContent = String(pageNumber);
  }

  set isVisible(isVisible: boolean) {
    this.toggleAttribute('is-visible', isVisible);
  }

  get dimensions(): {width: number; height: number} {
    const style = getComputedStyle(this);
    return {
      width: parseFloat(style.getPropertyValue('--gf__slide-width')),
      height: parseFloat(style.getPropertyValue('--gf__slide-height')),
    };
  }

  set scaleFactor(scaleFactor: number) {
    const {width, height} = this.dimensions;
    this.#wrapper.style.transform = `scale(${String(scaleFactor)})`;
    this.style.width = `${String(Math.floor(width * scaleFactor))}px`;
    this.style.height = `${String(Math.floor(height * scaleFactor))}px`;
  }

  performBuildForward(): boolean {
    const next = Array.from(this.#buildElements()).find(
      (element) => element.getAttribute('build') !== 'built',
    );
    next?.setAttribute('build', 'built');
    return next !== undefined;
  }

  performBuildBackwards(): boolean {
    const previous = Array.from(this.#buildElements()).findLast(
      (element) => element.getAttribute('build') === 'built',
    );
    previous?.setAttribute('build', '');
    return previous !== undefined;
  }

  showAllBuilds(): void {
    for (const element of this.#buildElements()) {
      element.setAttribute('build', 'built');
    }
  }

  #buildElements(): NodeListOf<Element> {
    return this.querySelectorAll('[build]');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gf-slide': GFSlide;
  }
}
