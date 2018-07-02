# prefetch-svg

prefetch-svg is a library to prefetch `import()` and `url()`. Replacing `import()` with its content and `url()` with a data url. 

## Usage

### Node

```js
const prefetchSvg = require('prefetch-svg');
prefetchSvg('<svg>...</svg>').then(prefetchedSvg => { ... });
```

### Browser

You can use a CDN to use this package. (see [example](https://repl.it/@ycmjason/prefetch-svg))

```html
<script src="https://unpkg.com/prefetch-svg/dist/prefetchSvg.umd.js"></script>
<script>
prefetchSvg('<svg>...</svg>').then(prefetchedSvg => { ... });
</script>
```

Or you can use module bundler. (see [example](


## Author

Jason Yu (me@ycmjason.com)
