import app from '../../app';
import request from 'supertest';
import { connectMongo, disconnectMongo } from '../../lib/mongo';
import AuthService from '../../services/AuthService';

let token: string;
describe('Auth API', () => {
  beforeAll(async () => {
    await connectMongo();
    token = await AuthService.login({
      username: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
    });
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe('Test Log in /login/password', () => {
    test('should throw error user data incorrect', async () => {
      const res = await request(app)
        .post('/v1/admin/login/password')
        .send({ username: 'admin', password: 'wrongPassword' })
        .expect(400);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Invalid login or password',
        })
      );
    });

    test('Log in success', async () => {
      const res = await request(app)
        .post('/v1/admin/login/password')
        .send({ username: 'admin', password: 'admin' })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: { email: 'admin@test.com', role: 'admin', username: 'admin' },
        })
      );
    });
  });

  describe('Test Logout', () => {
    test('should log a user out', async () => {
      const response = await request(app).get('/v1/admin/logout').expect(200);

      // Ensure that the 'Authorization' cookie is cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies).toContainEqual(
        expect.stringContaining('Authorization=;')
      );
    });
  });

  describe('Test CheckAuth', () => {
    test('should validate a user session', async () => {
      const res = await request(app)
        .get('/v1/admin/login/validate')
        .set('Cookie', `Authorization=Bearer ${token}`) // Set the JWT cookie
        .expect(200);
      // Add more assertions as needed to validate the response
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: { username: 'admin', role: 'admin', email: 'admin@admin.com' },
        })
      );
    });
  });
});
