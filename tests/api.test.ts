// tests/api.test.ts
import express from 'express';
import { router } from '../backend/api/routes.js';

const app = express();
app.use(express.json());
app.use('/api', router);

console.log("✅ API routes mounted successfully");

// Test health endpoint
const { default: request } = await import('supertest');
const response = await request(app)
  .get('/api/health')
  .expect(200);

console.log(`✅ Health endpoint: ${response.body.status}`);
console.log("✅ API ROUTES TESTS PASSED!");