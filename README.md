# Slides

[![CI](https://github.com/gauntface/slides/actions/workflows/ci.yml/badge.svg)](https://github.com/gauntface/slides/actions/workflows/ci.yml)

A simple HTML slide deck that uses custom elements.

## Usage

```html
<script
  type="module"
  src="node_modules/@gauntface/slides/build/gf-slides.js"
></script>

<gf-slides>
  <gf-slide>
    <h1>My First Slide</h1>
  </gf-slide>
</gf-slides>
```

## Building and running locally

```shell
pnpm install
pnpm run build
pnpm exec playwright install chromium firefox
pnpm test
```

To see the demo, run `pnpm exec esbuild --servedir=. --serve=8888` and open
<http://localhost:8888/demo/>.
