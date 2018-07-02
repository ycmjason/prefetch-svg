import PrefetchSvg from './PrefetchSvg.js';

const prefetchSvg = PrefetchSvg(fetch);

export default async (svgString) => await prefetchSvg(svgString);
