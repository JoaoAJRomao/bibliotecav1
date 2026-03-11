import { describe, it, expect } from 'vitest';
import { jwtVerify, SignJWT } from 'jose';

describe('Validação de JWT Payload', () => {
  const secret = process.env.JWT_SECRET || "esta_e_uma_chave_reserva_muito_longa_para_testes_123";
  const SECRET_KEY = Uint8Array.from(Buffer.from(secret));

  it('deve validar se o payload do token contém os dados do utilizador', async () => {
    console.log('Chave formatada (Uint8Array):', SECRET_KEY instanceof Uint8Array);

    const userPayload = { 
      id: 1, 
      name: 'Arthur', 
      email: 'arthur@teste.com' 
    };

    const token = await new SignJWT({...userPayload})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30min')
      .sign(SECRET_KEY);

    const { payload } = await jwtVerify(token, SECRET_KEY);

    expect(payload.name).toBe(userPayload.name);
    expect(payload.email).toBe(userPayload.email);
    expect(payload.id).toBe(userPayload.id);
  });
});