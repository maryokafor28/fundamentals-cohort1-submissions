
import { errorHandler } from '../../src/Middlewares/error';
import { Request, Response, NextFunction } from 'express';

// Mock Express request, response, and next function
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

describe('Error Handler Middleware', () => {
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should handle a generic Error and respond with a 500 status code', () => {
    const error = new Error('Something went wrong!');
    
    errorHandler(error, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Something went wrong!',
    });
  });

  it('should handle a custom error with a specific status code and message', () => {
    const customError = new Error('Not Found') as any;
    customError.statusCode = 404;
    
    errorHandler(customError, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Not Found',
    });
  });

  it('should handle Mongoose duplicate key error (E11000)', () => {
    const mongooseError = {
      name: 'MongoError',
      code: 11000,
      message: 'Duplicate key error',
    } as any;
    
    errorHandler(mongooseError, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Duplicate key error',
    });
  });
  
  it('should handle Mongoose validation errors', () => {
    const mongooseError = {
      name: 'ValidationError',
      message: 'User validation failed: name: Path `name` is required.',
      errors: {
        name: { message: 'Path `name` is required.' }
      }
    } as any;
    
    errorHandler(mongooseError, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User validation failed: name: Path `name` is required.',
    });
  });

});
