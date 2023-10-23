import app from '../../app';
import request from 'supertest';
import { connectMongo, disconnectMongo } from '../../lib/mongo';
import AuthService from '../../services/AuthService';
import UserService from '../../services/UserService';

let token: string;

describe('Users API', () => {
  beforeAll(async () => {
    await connectMongo();
    token = await AuthService.login({ username: 'admin', password: 'admin' });
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe('Test create user', () => {
    test('should create new user', async () => {
      const res = await request(app)
        .post('/v1/users/createUser')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .send({
          username: 'test',
          password: 'test',
          role: 'admin',
          email: 'test@test.com',
        })
        .expect(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: {
            username: 'test',
            role: 'admin',
            email: 'test@test.com',
          },
        })
      );
    });

    test('should throw error user already exists', async () => {
      const res = await request(app)
        .post('/v1/users/createUser')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .send({
          username: 'test',
          password: 'test',
          role: 'admin',
          email: 'test@test.com',
        })
        .expect(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Username already used',
        })
      );
    });

    test('should throw error email already used', async () => {
      const res = await request(app)
        .post('/v1/users/createUser')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .send({
          username: 'new',
          password: 'test',
          role: 'admin',
          email: 'admin@admin.com',
        })
        .expect(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'Email already used',
        })
      );
    });

    test('should throw error user data invalid', async () => {
      const res = await request(app)
        .post('/v1/users/createUser')
        .set('Cookie', `Authorization=Bearer ${token}`)

        .send({
          username: 'test',
          password: 'test',
          role: 'admin',
          email: 'test',
        })
        .expect(400);
    });

    test('should throw error user data not complete', async () => {
      const res = await request(app)
        .post('/v1/users/createUser')
        .set('Cookie', `Authorization=Bearer ${token}`)

        .send({
          username: 'notComplete',
          password: 'test',
          role: 'admin',
          //    email: 'admin',
        })
        .expect(400);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'User validation failed: email: Path `email` is required.',
        })
      );
    });
  });

  describe('Test updating user', () => {
    test('should update user', async () => {
      const res = await request(app)
        .put('/v1/users/test')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .send({ password: '1234asasa' })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: 'User test updated',
        })
      );
    });

    test('shouldn`t update user in not exist', async () => {
      const res = await request(app)
        .put('/v1/users/test1')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .send({ password: '1234asasa' })
        .expect(400);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'User is not exists',
        })
      );
    });

    // test('should update user', async () => {
    //   const res = await request(app)
    //     .put('/v1/users/test')
    //     .set('Cookie', `Authorization=Bearer ${token}`)
    //     .send({ password: '1234asasa' })
    //     .expect(200);

    //   expect(res.body).toEqual(
    //     expect.objectContaining({
    //       success: true,
    //       user: 'User test updated',
    //     })
    //   );
    // });
  });

  describe('Test deleting user', () => {
    test('should delete user', async () => {
      const res = await request(app)
        .delete('/v1/users/test')
        .set('Cookie', `Authorization=Bearer ${token}`)

        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: 'User test deleted',
        })
      );
    });

    test('should throw error user does`t exist', async () => {
      const res = await request(app)
        .delete('/v1/users/doesntexist')
        .set('Cookie', `Authorization=Bearer ${token}`)

        .expect(400);

      expect(res.body).toEqual({
        success: false,
        message: 'Username does`nt exists',
      });
    });
  });

  describe('Test GET routes', () => {
    test('should return list of users', async () => {
      const users = await UserService.getAll();
      const res = await request(app)
        .get('/v1/users')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          users: [
            {
              email: 'admin@admin.com',
              role: 'admin',
              username: 'first',
            },
            {
              email: 'admin@test.com',
              role: 'admin',
              username: 'admin',
            },
          ],
        })
      );
    });

    test('shouldn`t return list of users', async () => {
      const spy = jest.spyOn(UserService, 'getAll');
      spy.mockResolvedValue(null!);

      const res = await request(app)
        .get('/v1/users')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .expect(404);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'No users data found',
        })
      );
      spy.mockRestore();
    });

    test('should return user', async () => {
      const res = await request(app)
        .get('/v1/users/admin')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          user: {
            email: 'admin@test.com',
            role: 'admin',
            username: 'admin',
          },
        })
      );
    });
    test('shouldn`t return user', async () => {
      const res = await request(app)
        .get('/v1/users/test1')
        .set('Cookie', `Authorization=Bearer ${token}`)
        .expect(404);

      expect(res.body).toEqual(
        expect.objectContaining({
          success: false,
          message: 'No user data found',
        })
      );
    });
  });
});
