import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, getAuthToken, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Documents Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let folderId: string;

    beforeAll(async () => {
        app = await initializeE2EApp();
        accessToken = await getAuthToken(app, TEST_CONFIG.user);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Folders CRUD', () => {
        it('POST /documents/folders', async () => {
            const payload = { name: 'Tax Returns 2026' };
            const response = await request(app.getHttpServer())
                .post('/api/documents/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(payload)
                .expect(HttpStatus.OK);

            logApi('DOCUMENTS', 'CREATE-FOLDER', '/documents/folders', payload, response);
            folderId = response.body.data.id;
        });

        it('GET /documents/folders', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/documents/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);
            
            logApi('DOCUMENTS', 'GET-FOLDERS', '/documents/folders', null, response);
            expect(response.body.data.some(f => f.id === folderId)).toBe(true);
        });
    });

    describe('Documents List', () => {
        it('GET /api/documents', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/documents')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);
            
            logApi('DOCUMENTS', 'GET-ALL', '/documents', null, response);
        });

        it('GET /api/documents/counts', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/documents/counts')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);
            
            logApi('DOCUMENTS', 'GET-COUNTS', '/documents/counts', null, response);
            expect(response.body.data).toHaveProperty('categories');
            expect(response.body.data).toHaveProperty('folders');
        });
    });
});
