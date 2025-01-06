import { Request, Response } from 'express';
import { Image } from '../../models/Image';
import { uploadImage, getImage } from '../../controllers/imageController';
import { Readable } from 'node:stream';
import {MESSAGES} from "../../consts";

jest.mock('../../models/Image');

describe('imageController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
      setHeader: jest.fn(),
      sendFile: jest.fn(),
    };
  });

  describe('uploadImage', () => {
    beforeEach(() => {
      mockRequest = {
        file: {
          filename: 'test.jpg',
          originalname: 'original.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          fieldname: '',
          encoding: '',
          stream: new Readable(),
          destination: '',
          path: '',
          buffer: Buffer.from(''),
        },
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
        body: {
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };
    });

    it('successfully uploads an image', async () => {
      const mockSave = jest.fn();
      (Image as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        _id: '507f1f77bcf86cd799439011',
      }));

      await uploadImage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            message: MESSAGES.success.imageUploaded, // Use constant
            url: expect.stringContaining('/api/v1/images/'),
          })
      );
    });

    it('handles missing file', async () => {
      mockRequest.file = undefined;

      await uploadImage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: MESSAGES.errors.noImageUploaded }); // Use constant
    });
  });

  describe('getImage', () => {
    beforeEach(() => {
      mockRequest = {
        params: { imageId: '507f1f77bcf86cd799439011' },
      };
    });

    it('serves an existing non-expired image', async () => {
      const mockImage = {
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        expiryDate: new Date(Date.now() + 1000),
      };

      (Image.findById as jest.Mock).mockResolvedValue(mockImage);

      await getImage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'image/jpeg');
      expect(mockResponse.sendFile).toHaveBeenCalled();
    });

    it('returns 404 for non-existent image', async () => {
      (Image.findById as jest.Mock).mockResolvedValue(null);

      await getImage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: MESSAGES.errors.imageNotFound }); // Use constant
    });

    it('returns 410 for expired image', async () => {
      const mockImage = {
        expiryDate: new Date(Date.now() - 1000),
      };

      (Image.findById as jest.Mock).mockResolvedValue(mockImage);

      await getImage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(410);
      expect(jsonMock).toHaveBeenCalledWith({ error: MESSAGES.errors.imageExpired }); // Use constant
    });
  });
});