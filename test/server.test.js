const { readFileSync } = require('fs');
const svgOffline = require('..');

describe('svgOffline (server side)', () => {
  it('should replace @import() with the link content', async () => {
    const input = readFileSync(require.resolve('./svg1.input.svg'), 'utf8');
    const output = readFileSync(require.resolve('./svg1.output.svg'), 'utf8');
    expect((await svgOffline(input))).toEqual(output);
  });
});
