import { expect } from 'chai';
import { fromRawGCC, toRawGCC } from './gcc';

describe('gcc', () => {
  describe('fromRawGCC', () => {
    it('should convert 100000000 to "1"', () => {
      expect(fromRawGCC(100000000)).to.be.equal('1');
    });

    it('should convert 0 to "0"', () => {
      expect(fromRawGCC(0)).to.be.equal('0');
    });
  });

  describe('toRawGCC', () => {
    it('should convert 1 to 100000000', () => {
      expect(toRawGCC(1)).to.be.equal(100000000);
    });

    it('should convert 0 to 0', () => {
      expect(toRawGCC(0)).to.be.equal(0);
    });
  });
});
