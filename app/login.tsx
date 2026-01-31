"use client";
import React, { useState, CSSProperties } from 'react'; // Importamos o CSSProperties
import { useRouter } from 'next/navigation'; // Importação específica do Next.js
import { Mail, Lock, BookOpen } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook de navegação do Next.js
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // Simulação de validação
    if (email && password) {
      console.log('Login efetuado no Next.js');
      
      // router.push faz o redirecionamento para a pasta /livros
      router.push('/livros'); 
    } else {
      console.log('Preencha todos os campos');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <BookOpen size={40} color="#2563eb" />
          <h2 style={styles.title}>Biblioteca Digital</h2>
          <p style={styles.subtitle}>Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.icon} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.icon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// Aqui aplicamos o Record<string, CSSProperties> para resolver o erro de tipagem
const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif'
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center', // Agora o TS aceita pois sabe que é uma CSSProperty
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#1f2937',
    margin: '0.5rem 0'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#374151'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '0.5rem'
  },
  icon: {
    color: '#9ca3af',
    marginRight: '0.5rem'
  },
  input: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
    color: '#000',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default Login;