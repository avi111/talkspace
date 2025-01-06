import { Request, Response, NextFunction } from 'express';
import { validateImageId } from '../../middleware/validateImageId';

describe('validateImageId middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
    nextFunction = jest.fn();
  });

  it('calls next for valid ObjectId', () => {
    mockRequest = {
      params: { imageId: '507f1f77bcf86cd799439011' },
    };

    validateImageId(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid ObjectId', () => {
    mockRequest = {
      params: { imageId: 'invalid-id' },
    };

    validateImageId(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid image ID format' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});