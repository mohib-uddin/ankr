import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, getAuthToken, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Document Packages Flow (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let templateId: string;
    let templateItemId: string;

    beforeAll(async () => {
        app = await initializeE2EApp();
        accessToken = await getAuthToken(app, TEST_CONFIG.user);

        // Fetch a template for testing packages
        const templates = await request(app.getHttpServer())
            .get('/api/package-templates')
            .set('Authorization', `Bearer ${accessToken}`);
        
        templateId = templates.body.data[0].id;
        templateItemId = templates.body.data[0].items[0].id;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('User Packages Module', () => {
      it('CREATE Draft Package', async () => {
          const payload = {
              name: 'Modular Test Pack',
              templateId: templateId,
              documents: []
          };

          const response = await request(app.getHttpServer())
              .post('/api/user-packages')
              .set('Authorization', `Bearer ${accessToken}`)
              .send(payload)
              .expect(HttpStatus.CREATED);
          
          logApi('USER-PACKAGES', 'CREATE-DRAFT', '/user-packages', payload, response);
      });

      it('FINALIZE Fail (Invalid IDs)', async () => {
          const payload = {
              name: 'Should Fail',
              templateId: templateId,
              documents: [{ templateItemId: templateItemId, documentId: 'invalid-id' }],
          };

          const response = await request(app.getHttpServer())
              .post('/api/user-packages')
              .set('Authorization', `Bearer ${accessToken}`)
              .send(payload)
              .expect(HttpStatus.BAD_REQUEST);

          logApi('USER-PACKAGES', 'FINALIZE-FAIL', '/user-packages', payload, response);
      });
    });
});
