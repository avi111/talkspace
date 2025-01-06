import { isValidObjectId, isImageExpired } from '../../utils/imageUtils';

describe('imageUtils', () => {
  describe('isValidObjectId', () => {
    it('returns true for valid ObjectId', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    });

    it('returns false for invalid ObjectId', () => {
      expect(isValidObjectId('invalid-id')).toBe(false);
    });
  });

  describe('isImageExpired', () => {
    it('returns true for expired date', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(isImageExpired(pastDate)).toBe(true);
    });

    it('returns false for future date', () => {
      const futureDate = new Date(Date.now() + 1000);
      expect(isImageExpired(futureDate)).toBe(false);
    });
  });
});