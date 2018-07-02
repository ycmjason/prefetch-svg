const fetch = require('node-fetch');
const asyncReplace = require('./asyncReplace');

const fetchAsChrome = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    ...opts.headers,
  },
});

const replaceImport = async (svgString) => {
  svgString = svgString.replace(/@import url\(([^'")]*)\);/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/@import url\('([^']*)'\);/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/@import url\("([^"]*)"\);/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/@import '([^']*)';/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/@import "([^"]*)";/g, (match, url) => `<<${url}>>`);

  const importPlaceholderRe = /<<([^>]*)>>/g;
  if (importPlaceholderRe.test(svgString)) {
    svgString = await asyncReplace(
      svgString,
      importPlaceholderRe,
      (match, url) => fetchAsChrome(url).then(res => res.text()),
    );
    svgString = await replaceImport(svgString);
  }

  return svgString;
};

const replaceUrl = async (svgString) => {
  svgString = svgString.replace(/url\(([^'")]*)\)/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/url\('([^']*)'\)/g, (match, url) => `<<${url}>>`);
  svgString = svgString.replace(/url\("([^"]*)"\)/g, (match, url) => `<<${url}>>`);

  svgString = await asyncReplace(
    svgString,
    /<<([^>]*)>>/g,
    async (match, url) => {
      const res = await fetchAsChrome(url);
      const buffer = await res.buffer();
      const type = await res.headers.get('content-type');
      return `url(data:${type};base64,${buffer.toString('base64')})`;
    },
  );

  return svgString;
};

module.exports = async (svgString) => {
  svgString = await replaceImport(svgString);

  svgString = await replaceUrl(svgString);

  return svgString;
};
