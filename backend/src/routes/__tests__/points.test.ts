import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { Hex } from 'viem';
import pointsRouter from '../points';
import { recoverAddress } from '../../services/signatureService';
import { addJob } from '../../services/queueService';
import { readPoints } from '../../services/contractService';
import { ValidateFactory } from '../../validators/validateFactory';

// Mock all external services
jest.mock('../../services/signatureService');
jest.mock('../../services/queueService');
jest.mock('../../services/contractService');
jest.mock('../../validators/validateFactory');

const app = express();
app.use(bodyParser.json());
app.use('/points', pointsRouter);

describe('Points Routes', () => {
  const mockRecoverAddress = recoverAddress as jest.MockedFunction<typeof recoverAddress>;
  const mockAddJob = addJob as jest.MockedFunction<typeof addJob>;
  const mockReadPoints = readPoints as jest.MockedFunction<typeof readPoints>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /points', () => {
    const validPayload = {
      signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      message: {
        wallet: '0x1234567890123456789012345678901234567890',
        quest_id: 'quest-1',
        quest_type: 'daily',
        timestamp: Date.now(),        
      },
    };

    it('should accept valid point request and queue job', async () => {
      mockRecoverAddress.mockResolvedValue(validPayload.message.wallet as Hex);
      (ValidateFactory.getValidator as jest.Mock).mockReturnValue({
        validate: jest.fn().mockResolvedValue(true),
        getPoint: jest.fn().mockResolvedValue(100),
      });

      const response = await request(app)
        .post('/points')
        .send(validPayload)
        .expect(200);

      expect(response.body).toEqual({ queued: true });
      expect(mockRecoverAddress).toHaveBeenCalledWith(
        validPayload.message,
        validPayload.signature
      );
      expect(mockAddJob).toHaveBeenCalledWith(validPayload.message, 100);
    });

    it('should reject request with invalid signature', async () => {
      mockRecoverAddress.mockResolvedValue('0x9999999999999999999999999999999999999999' as Hex);

      const response = await request(app)
        .post('/points')
        .send(validPayload)
        .expect(400);

      expect(response.body).toEqual({ error: 'invalid signature' });
      expect(mockAddJob).not.toHaveBeenCalled();
    });

    it('should reject request with expired timestamp', async () => {
      const expiredPayload = {
        ...validPayload,
        message: {
          ...validPayload.message,
          timestamp: Date.now() - 60000, // 60 seconds ago
        },
      };

      mockRecoverAddress.mockResolvedValue(expiredPayload.message.wallet as Hex);

      const response = await request(app)
        .post('/points')
        .send(expiredPayload)
        .expect(400);

      expect(response.body).toEqual({ error: 'expired signature' });
      expect(mockAddJob).not.toHaveBeenCalled();
    });

    it('should reject request with invalid quest', async () => {
      mockRecoverAddress.mockResolvedValue(validPayload.message.wallet as Hex);
      (ValidateFactory.getValidator as jest.Mock).mockReturnValue({
        validate: jest.fn().mockResolvedValue(false),
      });

      const response = await request(app)
        .post('/points')
        .send(validPayload)
        .expect(400);

      expect(response.body).toEqual({ error: 'invalid quest' });
      expect(mockAddJob).not.toHaveBeenCalled();
    });

    it('should reject payload with invalid wallet address format', async () => {
      const invalidPayload = {
        ...validPayload,
        message: {
          ...validPayload.message,
          wallet: 'invalid-address',
        },
      };

      const response = await request(app)
        .post('/points')
        .send(invalidPayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /points', () => {
    const validWallet = '0x1234567890123456789012345678901234567890';

    it('should read points with valid wallet address', async () => {
      mockReadPoints.mockResolvedValue(250n);

      const response = await request(app)
        .get('/points')
        .query({ wallet: validWallet })
        .expect(200);

      expect(response.body).toEqual({
        wallet: validWallet,
        points: '250',
      });
      expect(mockReadPoints).toHaveBeenCalledWith(validWallet);
    });

    it('should reject request with invalid wallet format', async () => {
      const response = await request(app)
        .get('/points')
        .query({ wallet: 'invalid-address' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(mockReadPoints).not.toHaveBeenCalled();
    });

    it('should reject request with missing wallet parameter', async () => {
      const response = await request(app)
        .get('/points')
        .query({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(mockReadPoints).not.toHaveBeenCalled();
    });
  });
});
