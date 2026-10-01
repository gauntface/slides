import {adoptStyles} from '../../styles';
import css from './gf-slides.css';

adoptStyles(css);

const OVERVIEW_SLIDE_WIDTH = 300;

const INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, label, summary, [contenteditable]:not([contenteditable="false"])';

const SLIDE_HASH = /^#(-?\d+)$/;

const EDITABLE_SELECTOR =
  'input, select, textarea, [contenteditable]:not([contenteditable="false"])';

type ViewingMode = 'overview' | 'present';

export class GFSlides extends HTMLElement {
  #currentSlide = -1;
  #mode: ViewingMode = 'overview';
  #abortController: AbortController | null = null;
  #resizeObserver = new ResizeObserver(() => {
    this.#setMode(this.#mode);
  });

  connectedCallback(): void {
    this.#abortController = new AbortController();
    const {signal} = this.#abortController;

    window.addEventListener(
      'popstate',
      () => {
        this.#handleURLChange();
      },
      {signal},
    );
    window.addEventListener(
      'keydown',
      (event) => {
        this.#handleKey(event);
      },
      {signal},
    );
    this.addEventListener(
      'click',
      (event) => {
        this.#handleClick(event);
      },
      {signal},
    );

    this.#numberSlides();
    this.#handleURLChange();
    this.#resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#abortController?.abort();
    this.#abortController = null;
  }

  #slides(): NodeListOf<HTMLElementTagNameMap['gf-slide']> {
    return this.querySelectorAll('gf-slide');
  }

  #handleURLChange(): void {
    if (window.location.hash.length === 0) {
      this.#setMode('overview');
      return;
    }
    const match = SLIDE_HASH.exec(window.location.hash);
    if (!match?.[1]) {
      this.#setMode(this.#mode);
      return;
    }
    const index = this.#goToSlide(parseInt(match[1], 10));
    if (window.location.hash !== `#${String(index)}`) {
      history.replaceState(history.state, '', `#${String(index)}`);
    }
    this.#setMode('present');
  }

  #numberSlides(): void {
    this.#slides().forEach((slide, index) => {
      slide.pageNumber = index + 1;
    });
  }

  #fitSlidesInComponent(): void {
    const rect = this.getBoundingClientRect();
    for (const slide of this.#slides()) {
      const {width, height} = slide.dimensions;
      slide.scaleFactor = Math.min(rect.width / width, rect.height / height);
    }
  }

  #setMode(mode: ViewingMode): void {
    this.#mode = mode;
    for (const element of [this, document.body]) {
      element.toggleAttribute('is-overview', false);
      element.toggleAttribute('is-presenting', false);
    }

    const slides = this.#slides();
    if (mode === 'overview') {
      this.setAttribute('is-overview', 'true');
      document.body.setAttribute('is-overview', 'true');
      for (const slide of slides) {
        slide.isVisible = true;
        slide.scaleFactor = OVERVIEW_SLIDE_WIDTH / slide.dimensions.width;
      }
      return;
    }

    this.setAttribute('is-presenting', 'true');
    document.body.setAttribute('is-presenting', 'true');
    this.#fitSlidesInComponent();
    slides.forEach((slide, index) => {
      slide.isVisible = index === this.#currentSlide;
    });
  }

  #handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      return;
    }
    const slide = event.target.closest('gf-slide');
    if (
      !slide ||
      window.getSelection()?.toString() ||
      event.target.closest(INTERACTIVE_SELECTOR)
    ) {
      return;
    }
    this.#onSlideClick(Array.from(this.#slides()).indexOf(slide));
  }

  #onSlideClick(index: number): void {
    if (this.#mode === 'overview') {
      this.#showSlide(index);
      this.#setMode('present');
    } else {
      this.#moveToNextSlide();
    }
  }

  #goToSlide(index: number): number {
    const slides = this.#slides();
    if (index < 0) {
      index = 0;
    } else if (index >= slides.length) {
      index = slides.length - 1;
    }

    const previousIndex = this.#currentSlide;
    this.#currentSlide = index;

    slides.forEach((slide, slideIndex) => {
      if (slideIndex !== index) {
        slide.isVisible = false;
        return;
      }
      if (index < previousIndex) {
        slide.showAllBuilds();
      }
      slide.isVisible = true;
    });
    return index;
  }

  #showSlide(index: number): void {
    window.location.hash = String(this.#goToSlide(index));
  }

  #moveToPrevSlide(): void {
    const slide = this.#slides()[this.#currentSlide];
    if (slide && !slide.performBuildBackwards()) {
      this.#showSlide(this.#currentSlide - 1);
    }
  }

  #moveToNextSlide(): void {
    const slide = this.#slides()[this.#currentSlide];
    if (slide && !slide.performBuildForward()) {
      this.#showSlide(this.#currentSlide + 1);
    }
  }

  #handleKey(event: KeyboardEvent): void {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      (event.target instanceof Element &&
        event.target.closest(EDITABLE_SELECTOR))
    ) {
      return;
    }

    if (event.key === 'Escape') {
      if (this.#mode === 'overview') {
        this.#onSlideClick(this.#currentSlide);
      } else {
        window.location.hash = '';
        this.#setMode('overview');
      }
      return;
    }

    if (this.#mode !== 'present') {
      return;
    }

    switch (event.key) {
      case 'PageUp':
      case 'ArrowLeft':
      case 'ArrowUp':
        this.#moveToPrevSlide();
        break;
      case 'PageDown':
      case 'ArrowRight':
      case 'ArrowDown':
        this.#moveToNextSlide();
        break;
      case ' ':
        if (event.shiftKey) {
          this.#moveToPrevSlide();
        } else {
          this.#moveToNextSlide();
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gf-slides': GFSlides;
  }
}
