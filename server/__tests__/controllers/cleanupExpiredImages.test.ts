import * as fs from "node:fs";
import {Image} from "../../models/Image";
import {cleanupExpiredImages} from "../../controllers/imageController";

jest.mock('node:fs');
jest.mock('mongoose');
jest.mock('../../models/Image', () => ({
    Image: {
        find: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
}));

describe('cleanupExpiredImages', () => {
    const mockImages = [
        {
            _id: '507f1f77bcf86cd799439011',
            filename: 'test.jpg',
            originalName: 'original.jpg',
            mimeType: 'image/jpeg',
            size: 1024,
            uploadDate: new Date(),
            expiryDate: new Date(),
        },
        {
            _id: '507f1f77bcf86cd799439012',
            filename: 'test2.jpg',
            originalName: 'original2.jpg',
            mimeType: 'image/jpeg',
            size: 2048,
            uploadDate: new Date(),
            expiryDate: new Date(),
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (Image.find as jest.Mock).mockResolvedValue(mockImages);
        (Image.findByIdAndDelete as jest.Mock).mockResolvedValue(true);
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.unlinkSync as jest.Mock).mockImplementation(() => {});
    });

    it('should delete expired Images and their database records', async () => {
        await cleanupExpiredImages();

        expect(Image.find).toHaveBeenCalledWith({
            expiryDate: expect.any(Object),
        });

        // 2 Images, 2 times
        expect(fs.existsSync).toHaveBeenCalledTimes(2);
        expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
        expect(Image.findByIdAndDelete).toHaveBeenCalledTimes(2);
    });

    it('should handle no expired Images gracefully', async () => {
        // Mock `Image.find` to return an empty array
        (Image.find as jest.Mock).mockResolvedValue([]);

        await cleanupExpiredImages();

        expect(Image.find).toHaveBeenCalledWith({
            expiryDate: { $lt: expect.any(Date) },
        });
        expect(Image.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should handle Image system errors gracefully', async () => {
        (fs.unlinkSync as jest.Mock).mockImplementation(() => {
            throw new Error('Image system error');
        });

        await cleanupExpiredImages();

        // because it throws an error, it should not call `Image.findByIdAndDelete`
        expect(Image.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
        (Image.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

        await cleanupExpiredImages();

        // because the error was in DB, it didn't delete the DB record but it deleted the Image
        // fs.unlinkSync is being called before Image.findByIdAndDelete
        expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    });

    it('should skip deletion if Image does not exist', async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        await cleanupExpiredImages();

        expect(fs.unlinkSync).not.toHaveBeenCalled();
        expect(Image.findByIdAndDelete).toHaveBeenCalledTimes(2);
    });
});