const asyncReplace = require('./asyncReplace');

module.exports = ({
  fetch,
  responseToBase64,
}) => {
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
        (match, url) => fetch(url).then(res => res.text()),
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
        const res = await fetch(url);
        const base64 = await responseToBase64(res);

        const type = await res.headers.get('content-type');
        return `url(data:${type};base64,${base64})`;
      },
    );

    return svgString;
  };

  return svgString => Promise.resolve(svgString).then(replaceImport).then(replaceUrl);
};
