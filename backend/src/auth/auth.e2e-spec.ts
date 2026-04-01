import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Authentication Module (e2e)', () => {
    let app: INestApplication;

    const signupUser = {
        firstName: 'Auth',
        lastName: 'Tester',
        email: `auth_test_${Date.now()}@yopmail.com`,
        password: 'Password123!'
    };

    beforeAll(async () => {
        app = await initializeE2EApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Auth Flow', () => {
        it('POST /auth/signup', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/signup')
                .send(signupUser)
                .expect(HttpStatus.CREATED);

            logApi('AUTH', 'SIGNUP', '/auth/signup', signupUser, response);
            expect(response.body.data.email).toBe(signupUser.email);
        });

        it('POST /auth/login', async () => {
            const payload = { 
                email: signupUser.email, 
                password: signupUser.password 
            };
            
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send(payload)
                .expect(HttpStatus.OK);

            logApi('AUTH', 'LOGIN', '/auth/login', payload, response);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('POST /auth/login (Invalid Credentials)', async () => {
            const payload = { 
                email: signupUser.email, 
                password: 'WrongPassword!' 
            };
            
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send(payload)
                .expect(HttpStatus.UNAUTHORIZED);

            logApi('AUTH', 'LOGIN-FAIL', '/auth/login', payload, response);
        });
    });
});
