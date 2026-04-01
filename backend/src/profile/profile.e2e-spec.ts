import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, getAuthToken, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Profile Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        app = await initializeE2EApp();
        accessToken = await getAuthToken(app, TEST_CONFIG.user);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Profile Management', () => {
        it('GET /user (Current User Detail)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/user')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);

            logApi('PROFILE', 'GET-ME', '/user', null, response);
            expect(response.body.data.email).toBe(TEST_CONFIG.user.email);
        });

        it('GET /profiles/my (Investor Profile Overview)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/profiles/my')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);

            logApi('PROFILE', 'GET-INVESTOR-PROFILE', '/profiles/my', null, response);
            expect(response.body.data).toHaveProperty('id');
        });
    });
});
