import {GFSlide} from './components/gf-slide/gf-slide';
import {GFSlides} from './components/gf-slides/gf-slides';

// gf-slide must upgrade before gf-slides, because gf-slides sets slide
// properties when it connects.
customElements.define('gf-slide', GFSlide);
customElements.define('gf-slides', GFSlides);

export {GFSlide, GFSlides};
