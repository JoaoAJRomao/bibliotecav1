'use client';

import React, { useState, CSSProperties } from 'react';
import { NextResponse } from 'next/server';
import { db } from '../src/index';
import { booksTable } from '../src/db/schema';
import { useRouter } from 'next/navigation';
import { Search, Book, User, Calendar, Building2, Plus, X, LogOut } from 'lucide-react';

interface BookData {
  id: number;
  nome: string;
  autor: string;
  ano: number;
  editora: string;
}

const BookSearch = () => {
  // Agora a lista de livros está no estado para podermos adicionar novos
  const [livros, setLivros] = useState<BookData[]>([
    { id: 1, nome: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", ano: 1954, editora: "Allen & Unwin" },
    { id: 2, nome: "1984", autor: "George Orwell", ano: 1949, editora: "Secker & Warburg" },
    { id: 3, nome: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, editora: "Garnier" },
    { id: 4, nome: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, editora: "Garnier" },
    { id: 5, nome: "Grande Sertão: Veredas", autor: "Guimarães Rosa", ano: 1956, editora: "Instituto Nacional do Livro" },
    { id: 6, nome: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis", ano: 1881, editora: "Garnier" },
    { id: 7, nome: "O Auto da Compadecida", autor: "Ariano Suassuna", ano: 1955, editora: "Agir" },
    { id: 8, nome: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, editora: "Globo Editora" },
  ]);
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para o formulário do novo livro
  const [novoLivro, setNovoLivro] = useState({
    nome: '',
    autor: '',
    ano: '',
    editora: ''
  });

  const livrosFiltrados = livros.filter(livro =>
    livro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Função de Logout
  const handleLogout = () => {
    // Aqui no futuro você limparia tokens (JWT) ou cookies de sessão
    console.log('Utilizador saiu do sistema');
    router.push('/'); // Redireciona para a página de login (raiz)
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const anoParseado = parseInt(novoLivro.ano, 10);

    if (isNaN(anoParseado)) {
      alert('Por favor, insira um ano válido');
      return;
    }

    const item: BookData = {
      id: Date.now(), // Gera um ID único simples
      nome: novoLivro.nome,
      autor: novoLivro.autor,
      ano: anoParseado,
      editora: novoLivro.editora
    };

    setLivros([...livros, item]); // Adiciona o novo livro à lista existente
    setIsModalOpen(false); // Fecha o modal
    setNovoLivro({ nome: '', autor: '', ano: '', editora: '' }); // Limpa o formulário
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Consulta de Acervo</h1>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            title="Sair do sistema"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>

        <div style={styles.searchBar}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome do livro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.grid}>
        {livrosFiltrados.map((livro) => (
          <div key={livro.id} style={styles.card}>
            <div style={styles.bookIconWrapper}>
              <Book size={32} color="#2563eb" />
            </div>
            <h3 style={styles.bookTitle}>{livro.nome}</h3>
            <div style={styles.infoRow}><User size={16} /><span style={styles.infoText}>{livro.autor}</span></div>
            <div style={styles.infoRow}><Calendar size={16} /><span style={styles.infoText}>{livro.ano}</span></div>
            <div style={styles.infoRow}><Building2 size={16} /><span style={styles.infoText}>{livro.editora}</span></div>
          </div>
        ))}
      </main>

      {/* Botão Flutuante (FAB) */}
      <button
        style={styles.fab}
        onClick={() => setIsModalOpen(true)}
        title="Adicionar novo livro"
      >
        <Plus size={32} color="white" />
      </button>

      {/* Modal / Popup */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ color: '#1f2937' }}>Cadastrar Novo Livro</h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddBook} style={styles.modalForm}>
              <input
                placeholder="Nome do Livro"
                required
                style={styles.modalInput}
                value={novoLivro.nome}
                onChange={e => setNovoLivro({ ...novoLivro, nome: e.target.value })}
              />
              <input
                placeholder="Autor"
                required
                style={styles.modalInput}
                value={novoLivro.autor}
                onChange={e => setNovoLivro({ ...novoLivro, autor: e.target.value })}
              />
              <input
                placeholder="Ano"
                type="number"
                required
                style={styles.modalInput}
                value={novoLivro.ano}
                onChange={e => setNovoLivro({ ...novoLivro, ano: e.target.value })}
              />
              <input
                placeholder="Editora"
                required
                style={styles.modalInput}
                value={novoLivro.editora}
                onChange={e => setNovoLivro({ ...novoLivro, editora: e.target.value })}
              />
              <button type="submit" style={styles.saveButton}>Salvar Livro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  // ... (manter estilos anteriores do container, header, card, etc.)
  container: { padding: '2rem', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' },
  header: { marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem auto' },
  pageTitle: { fontSize: '1.8rem', color: '#111827', marginBottom: '1rem' },
  searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db' },
  searchIcon: { color: '#9ca3af', marginRight: '0.75rem' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#000' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#fff', width: '250px', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  bookIconWrapper: { backgroundColor: '#eff6ff', width: 'fit-content', padding: '0.75rem', borderRadius: '50%', marginBottom: '1rem' },
  bookTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', minHeight: '2.5rem' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' },
  infoText: { fontSize: '0.9rem' },

  // Estilos novos para FAB e Modal
  fab: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    backgroundColor: '#2563eb',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  closeButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#6b7280'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  modalInput: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    color: '#000'
  },
  saveButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#fee2e2', // Vermelho muito claro
    color: '#dc2626', // Vermelho
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  },
};

export default BookSearch;