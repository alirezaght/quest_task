import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody, validateQuery } from '../requestValidate';

describe('requestValidate middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('validateBody', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it('should pass validation with valid data', () => {
      mockReq.body = { name: 'John', age: 30 };
      
      validateBody(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 with invalid data', () => {
      mockReq.body = { name: 'John', age: 'invalid' };
      
      validateBody(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Object) })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should transform data according to schema', () => {
      mockReq.body = { name: 'John', age: 30, extra: 'field' };
      
      validateBody(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockReq.body).toEqual({ name: 'John', age: 30 });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing required fields', () => {
      mockReq.body = { name: 'John' };
      
      validateBody(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle empty body', () => {
      mockReq.body = {};
      
      validateBody(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateQuery', () => {
    const schema = z.object({
      id: z.string(),
      limit: z.string().optional(),
    });

    it('should pass validation with valid query', () => {
      mockReq.query = { id: '123', limit: '10' };
      
      validateQuery(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 with invalid query', () => {
      mockReq.query = {};
      
      validateQuery(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle optional query parameters', () => {
      mockReq.query = { id: '123' };
      
      validateQuery(schema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should transform query data', () => {
      const transformSchema = z.object({
        id: z.string(),
        limit: z.string().transform(Number),
      });

      mockReq.query = { id: '123', limit: '10' };
      
      validateQuery(transformSchema)(mockReq as Request, mockRes as Response, mockNext);
      
      expect(mockReq.query).toEqual({ id: '123', limit: 10 });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
