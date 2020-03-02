const postcss = require('postcss');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const plugin = require('../');

describe('plugin', function() {
  it('does not modify strict shorthand rules.', async () => {
    let input = 'div{flex: 1 2 0%;}';
    const result = await postcss([plugin()]).process(input);
    expect(result.css).to.equal(input);
  });

  it('requires all shorthand flex values to be specified.', async () => {
    await expect(postcss([plugin()]).process('div{flex: 1;}')).to.eventually.be.rejected;
    await expect(postcss([plugin()]).process('div{flex: 1 1;}')).to.eventually.be.rejected;
  });

  it('does not allow ambiguous or erroneous flex-basis values.', async () => {
    await expect(postcss([plugin()]).process('div{flex: 1 1 0;}')).to.eventually.be.rejected;
    await expect(postcss([plugin()]).process('div{flex: 1 1 0px;}')).to.eventually.be.rejected;
    await expect(postcss([plugin()]).process('div{flex-basis: 0px;}')).to.eventually.be.rejected;
  });
});
