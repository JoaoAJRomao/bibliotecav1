import { describe, it, expect } from 'vitest';

describe('Cálculos de Autenticação', () => {
  it('deve validar que 30 minutos correspondem a 1/48 de um dia', () => {
    const trintaMinutosEmDias = 1 / 48;    
    expect(trintaMinutosEmDias).toBeCloseTo(0.020833, 5);
  });
});
