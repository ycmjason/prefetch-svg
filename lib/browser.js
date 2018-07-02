import PrefetchSvg from './PrefetchSvg.js';

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export default PrefetchSvg({
  fetch,
  responseToBase64: async res => {
    const arrayBuffer = await res.arrayBuffer();
    return arrayBufferToBase64(arrayBuffer);
  },
});
