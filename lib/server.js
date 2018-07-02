const fetch = require('node-fetch');
const fetchAsChrome = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    ...opts.headers,
  },
});

module.exports = require('./PrefetchSvg')({
  fetch: fetchAsChrome,
  responseToBase64: async res => {
    const buf = await res.buffer();
    return buf.toString('base64');
  },
})
