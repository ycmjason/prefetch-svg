var asyncReplace = async (str, regex, aReplacer) => {
  regex = new RegExp(regex, 'g');
  const replacedParts = [];
  let match;
  let i = 0;
  while ((match = regex.exec(str)) !== null) {
    // put non matching string
    replacedParts.push(str.slice(i, match.index));
    // call the async replacer function with the matched array spreaded
    replacedParts.push(aReplacer(...match));
    i = regex.lastIndex;
  }

  // put the rest of str
  replacedParts.push(str.slice(i));

  // wait for aReplacer calls to finish and join them back into string
  return (await Promise.all(replacedParts)).join('');
};

var PrefetchSvg = ({
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

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

var browser = PrefetchSvg({
  fetch,
  responseToBase64: async res => {
    const arrayBuffer = await res.arrayBuffer();
    return arrayBufferToBase64(arrayBuffer);
  },
});

export default browser;
