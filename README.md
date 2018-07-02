# prefetch-svg

prefetch-svg is a library to prefetch `import()` and `url()`. Replacing `import()` with its content and `url()` with a data url. 

## Usage

### Node

```js
const prefetchSvg = require('prefetch-svg');
prefetchSvg('<svg>...</svg>').then(prefetchedSvg => { ... });
```

### Browser

See this example.


## Author

Jason Yu (me@ycmjason.com)
