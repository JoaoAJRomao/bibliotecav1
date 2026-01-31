"use client";   
import React, { useState, CSSProperties } from 'react';
import { Search, Book, User, Calendar, Building2 } from 'lucide-react';

// Definindo a interface para o objeto Livro
interface BookData {
  id: number;
  nome: string;
  autor: string;
  ano: number;
  editora: string;
}

const BookSearch = () => {
  // Lista de exemplo (Mock)
  const [livros] = useState<BookData[]>([
    { id: 1, nome: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", ano: 1954, editora: "Allen & Unwin" },
    { id: 2, nome: "1984", autor: "George Orwell", ano: 1949, editora: "Secker & Warburg" },
    { id: 3, nome: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, editora: "Garnier" },
    { id: 4, nome: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", ano: 1943, editora: "Reynal & Hitchcock" },
    { id: 5, nome: "Harry Potter", autor: "J.K. Rowling", ano: 1997, editora: "Bloomsbury" },
    { id: 6, nome: "O Alquimista", autor: "Paulo Coelho", ano: 1988, editora: "Rocco" },
  ]);

  const [busca, setBusca] = useState('');

  // Lógica para filtrar os livros conforme o usuário digita
  const livrosFiltrados = livros.filter(livro => 
    livro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>Consulta de Acervo</h1>
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
            
            <div style={styles.infoRow}>
              <User size={16} style={styles.infoIcon} />
              <span style={styles.infoText}>{livro.autor}</span>
            </div>

            <div style={styles.infoRow}>
              <Calendar size={16} style={styles.infoIcon} />
              <span style={styles.infoText}>{livro.ano}</span>
            </div>

            <div style={styles.infoRow}>
              <Building2 size={16} style={styles.infoIcon} />
              <span style={styles.infoText}>{livro.editora}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    padding: '2rem',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  header: {
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem auto'
  },
  pageTitle: {
    fontSize: '1.8rem',
    color: '#111827',
    marginBottom: '1rem'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #d1d5db'
  },
  searchIcon: {
    color: '#9ca3af',
    marginRight: '0.75rem'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
    color: '#000'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap', // Faz os itens descerem para a próxima linha
    gap: '1.5rem',
    justifyContent: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    width: '250px', // Largura fixa do "quadrado"
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  bookIconWrapper: {
    backgroundColor: '#eff6ff',
    width: 'fit-content',
    padding: '0.75rem',
    borderRadius: '50%',
    marginBottom: '1rem'
  },
  bookTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
    minHeight: '2.5rem' // Garante alinhamento mesmo com títulos curtos
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4b5563'
  },
  infoIcon: {
    flexShrink: 0
  },
  infoText: {
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis' // Coloca "..." se o texto for muito longo
  }
};

export default BookSearch;