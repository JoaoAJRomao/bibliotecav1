import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../login';
import { useRouter } from 'next/navigation';

// Mock do useRouter do Next.js para evitar erros durante o teste
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Interface da Tela de Login', () => {
  it('deve renderizar o título e os campos de entrada corretamente', () => {
    render(<Login />);

    // Verifica se o título principal aparece
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();

    // Verifica se os campos de texto estão presentes pelos placeholders
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();

    // Verifica se o botão de entrar está na tela
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve exibir as etiquetas (labels) de E-mail e Senha', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });
  
  it('deve redirecionar para a página de cadastro ao clicar no botão de cadastre-se', () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);

    render(<Login />);

    // Localiza o botão pelo texto
    const registerButton = screen.getByText(/cadastre-se agora/i);
    
    // Simula o clique
    fireEvent.click(registerButton);

    // Verifica se a função push foi chamada com a rota correta
    expect(pushMock).toHaveBeenCalledWith('/cadastro');
  });
});