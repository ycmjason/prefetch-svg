const fetch = require('node-fetch');

const fetchAsChrome = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    ...opts.headers,
  },
});

const prefetchSvg = require('./PrefetchSvg')(fetchAsChrome);

module.exports = async (svgString) => await prefetchSvg(svgString);
