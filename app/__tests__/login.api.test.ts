import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../app/api/auth/login/route';

describe('API de Login', () => {
  it('deve retornar erro 401 para utilizador inexistente', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'naoexiste@teste.com', password: '123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Utilizador não encontrado.');
  });
});