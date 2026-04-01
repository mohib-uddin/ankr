import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { initializeE2EApp, getAuthToken, logApi } from '../../test/test-utils';
import { TEST_CONFIG } from '../../test/test-config';

describe('Properties Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let testPropertyId: string;

    beforeAll(async () => {
        app = await initializeE2EApp();
        accessToken = await getAuthToken(app, TEST_CONFIG.user);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Properties CRUD', () => {
        it('POST /properties (Create)', async () => {
            const payload = {
                name: 'Laguna Beach Villa',
                address: '456 Shoreline Dr, CA',
                propertyType: 'Single Family',
                estimatedValue: 2500000,
                loanBalance: 1200000,
                monthlyRent: 8500,
                yearBuilt: 2020
            };

            const response = await request(app.getHttpServer())
                .post('/api/properties')
                .set('Authorization', `Bearer ${accessToken}`)
                .field('name', payload.name)
                .field('address', payload.address)
                .field('propertyType', payload.propertyType)
                .field('estimatedValue', payload.estimatedValue)
                .field('loanBalance', payload.loanBalance)
                .field('monthlyRent', payload.monthlyRent)
                .field('yearBuilt', payload.yearBuilt)
                .expect(HttpStatus.OK);

            logApi('PROPERTIES', 'CREATE', '/properties', payload, response);
            
            expect(response.body.data.name).toBe(payload.name);
            testPropertyId = response.body.data.id;
        });

        it('GET /properties (List)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/properties')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK);
            
            logApi('PROPERTIES', 'GET-ALL', '/properties', null, response);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
