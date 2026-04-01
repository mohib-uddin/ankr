import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, getAuthToken, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Package Templates Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        app = await initializeE2EApp();
        accessToken = await getAuthToken(app, TEST_CONFIG.user);
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET-ALL Package Templates', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/package-templates')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.OK);
        
        logApi('PACKAGE-TEMPLATES', 'GET-ALL', '/package-templates', null, response);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
