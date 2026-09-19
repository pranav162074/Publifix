import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

jest.unstable_mockModule('../utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(undefined),
}));

const { default: complaintRoutes } = await import('../routes/complaintRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/complaints', complaintRoutes);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

// Helper: create a user directly in the test DB and return their auth token
const createUserAndToken = async (overrides = {}) => {
  const user = await User.create({
    name: 'Test User',
    email: `user${Date.now()}${Math.random()}@example.com`,
    password: 'password123',
    ...overrides,
  });
  const token = generateToken(user._id);
  return { user, token };
};

describe('Complaint Routes', () => {
  test('should reject creating a complaint without a token', async () => {
    const res = await request(app).post('/api/complaints').send({
      title: 'Broken streetlight',
      description: 'It has been dark for a week',
      category: 'streetlight',
    });

    expect(res.statusCode).toBe(401);
  });

  test('should create a complaint successfully when logged in', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Broken streetlight')
      .field('description', 'It has been dark for a week')
      .field('category', 'streetlight');

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Broken streetlight');
    expect(res.body.status).toBe('pending');
  });

  test('should only return complaints belonging to the logged-in user', async () => {
    const { token: tokenA } = await createUserAndToken();
    const { token: tokenB } = await createUserAndToken();

    await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${tokenA}`)
      .field('title', 'User A complaint')
      .field('description', 'Reported by A')
      .field('category', 'pothole');

    await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${tokenB}`)
      .field('title', 'User B complaint')
      .field('description', 'Reported by B')
      .field('category', 'garbage');

    const res = await request(app)
      .get('/api/complaints/mine')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('User A complaint');
  });

  test('should block a regular citizen from viewing all complaints', async () => {
    const { token } = await createUserAndToken({ role: 'citizen' });

    const res = await request(app)
      .get('/api/complaints')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  test('should allow an admin to view all complaints', async () => {
    const { token } = await createUserAndToken({ role: 'admin' });

    const res = await request(app)
      .get('/api/complaints')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test('should block a regular citizen from updating complaint status', async () => {
    const { token: citizenToken } = await createUserAndToken({ role: 'citizen' });

    const createRes = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .field('title', 'Broken streetlight')
      .field('description', 'Dark for a week')
      .field('category', 'streetlight');

    const res = await request(app)
      .patch(`/api/complaints/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ status: 'resolved' });

    expect(res.statusCode).toBe(403);
  });

  test('should allow an admin to update complaint status', async () => {
    const { token: citizenToken } = await createUserAndToken({ role: 'citizen' });
    const { token: adminToken } = await createUserAndToken({ role: 'admin' });

    const createRes = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .field('title', 'Broken streetlight')
      .field('description', 'Dark for a week')
      .field('category', 'streetlight');

    const res = await request(app)
      .patch(`/api/complaints/${createRes.body._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'resolved' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('resolved');
  });
});