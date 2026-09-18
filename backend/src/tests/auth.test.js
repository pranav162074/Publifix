import request from 'supertest';
import express from 'express';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import authRoutes from '../routes/authRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Auth Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  test('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('should reject registration with a duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test('should login successfully with correct credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });
});