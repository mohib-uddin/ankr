import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Set global timeout for E2E tests (60 seconds for slow mail/db operations)
jest.setTimeout(60000);

export const initializeE2EApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  // Ensure same global prefix and pipes as main.ts
  app.setGlobalPrefix('api'); 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.init();
  return app;
};

/**
 * Handles Signup if not exists, then login.
 * Reuses same stable credentials from config.
 */
export const getAuthToken = async (app: INestApplication, userConfig: any): Promise<string> => {
  // 1. Try Signup (ignore errors if exists)
  await request(app.getHttpServer())
    .post('/api/auth/signup')
    .send(userConfig);

  // 2. Perform Login
  const loginRes = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: userConfig.email, password: userConfig.password })
    .expect(HttpStatus.OK);

  const accessToken = loginRes.body.data.access_token;
  const user = loginRes.body.data.user;

  // 3. Ensure Investor Profile exists (to avoid 404 in subsequent module tests)
  if (!user.profile) {
    await request(app.getHttpServer())
      .post('/api/profile/investor/onboard')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id,
        fullLegalName: `${user.firstName} ${user.lastName}`,
        primaryAddress: '123 Test St, Austin, TX',
        phone: '15550109999',
        ssn: '000000000',
        isGuarantor: false
      });
  }

  return accessToken;
};

/**
 * Enhanced Clean API Logging
 */
export const logApi = (module: string, name: string, path: string, payload?: any, response?: any) => {
    const separator = '='.repeat(100);
    const header = `[${module.toUpperCase()}] - [${name.toUpperCase()}] - [/api${path}]`;
    
    console.log(`\n${separator}\n${header}`);
    if (payload) {
        console.log(`PAYLOAD:\n${JSON.stringify(payload, null, 2)}`);
    }
    if (response) {
        console.log(`RESPONSE:\n${JSON.stringify(response.body, null, 2)}`);
    }
    console.log(`${separator}\n`);
};
