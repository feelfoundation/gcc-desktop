import {
  getUnixTimestampFromValue,
  convertUnixSecondsToFeelEpochSeconds,
} from './datetime';


describe('Datetime', () => {
  describe('getUnixTimestampFromValue', () => {
    it('should return valid unix timestamp', () => {
      expect(getUnixTimestampFromValue(131302820)).toEqual(1595412020000);
    });
  });

  describe('convertUnixSecondsToFeelEpochSeconds', () => {
    it('should return valid unix timestamp', () => {
      expect(convertUnixSecondsToFeelEpochSeconds(1595584910)).toEqual(131475710);
    });
  });
});
