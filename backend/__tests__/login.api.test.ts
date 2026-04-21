/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('API de Login (Express API)', () => {
  it('deve retornar erro 401 para utilizador inexistente', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@teste.com', password: '123' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Utilizador não encontrado.');
  });
});