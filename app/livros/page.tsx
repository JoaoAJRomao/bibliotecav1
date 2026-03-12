"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookData } from "../src/interfaces";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import {
  Search,
  Book,
  User,
  Calendar,
  Building2,
  Plus,
  X,
  LogOut,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

const BookSearch = () => {
  const [livros, setLivros] = useState<BookData[]>([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [novoLivro, setNovoLivro] = useState({
    nome: "",
    autor: "",
    ano: "",
    editora: "",
  });

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/livros");
        const data = await response.json();
        setLivros(data);
      } catch (error) {
        console.error("Falha ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarLivros();
  }, []);

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const anoParseado = parseInt(novoLivro.ano, 10);

    if (isNaN(anoParseado)) {
      Swal.fire({
        icon: "error",
        title: "Ano Inválido",
        text: "Por favor, insira um número válido para o ano.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const item = {
      ...(editandoId && { id: editandoId }),
      title: novoLivro.nome,
      author: novoLivro.autor,
      year: anoParseado,
      publisher: novoLivro.editora,
    };

    try {
      const method = editandoId ? "PUT" : "POST";
      const response = await fetch("/api/livros", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const livroProcessado = await response.json();

        if (editandoId) {
          setLivros((prev) =>
            prev.map((l) => (l.id === editandoId ? { ...l, ...livroProcessado } : l)),
          );
        } else {
          setLivros((prev) => [...prev, livroProcessado]);
        }
        fecharModal();
        Swal.fire({
          icon: "success",
          title: editandoId ? "Atualizado!" : "Salvo!",
          text: editandoId
            ? "As alterações foram gravadas."
            : "O livro foi adicionado ao acervo.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error("Erro no servidor");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleDeleteBook = async (id: number) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/livros?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setLivros((prev) => prev.filter((l) => l.id !== id));
          Swal.fire("Excluído!", "O livro foi removido.", "success");
        } else {
          Swal.fire("Erro", "Não foi possível excluir o livro.", "error");
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
        Swal.fire("Erro", "Erro ao processar a exclusão.", "error");
      }
    }
  };

  const livrosFiltrados = livros.filter((livro) =>
    livro?.title?.toLowerCase().includes(busca.toLowerCase()),
  );

  const handleLogout = () => {
    Cookies.remove('user_session');
    router.push("/");
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditandoId(null);
    setNovoLivro({ nome: "", autor: "", ano: "", editora: "" });
  };

  const handleOpenEdit = (livro: BookData) => {
    setNovoLivro({
      nome: livro.title,
      autor: livro.author,
      ano: livro.year.toString(),
      editora: livro.publisher,
    });
    setEditandoId(livro.id);
    setIsModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Consulta de Acervo</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
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
        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={48} style={styles.spinner} />
            <p style={{ color: "#4b5563", marginTop: "1rem" }}>
              Carregando acervo...
            </p>
          </div>
        ) : livrosFiltrados.length > 0 ? (
          livrosFiltrados.map((livro) => (
            <div key={livro.id} style={styles.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={styles.bookIconWrapper}>
                  <Book size={32} color="#2563eb" />
                </div>

                {/* Container para os botões de ação */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleOpenEdit(livro)}
                    style={styles.actionButton}
                    title="Editar livro"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteBook(livro.id)}
                    style={{ ...styles.actionButton, color: "#ef4444" }}
                    title="Remover livro"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 style={styles.bookTitle}>{livro.title}</h3>
              <div style={styles.infoRow}>
                <User size={16} />
                <span style={styles.infoText}>{livro.author}</span>
              </div>
              <div style={styles.infoRow}>
                <Calendar size={16} />
                <span style={styles.infoText}>{livro.year}</span>
              </div>
              <div style={styles.infoRow}>
                <Building2 size={16} />
                <span style={styles.infoText}>{livro.publisher}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#4b5563", gridColumn: "1/-1" }}>
            Nenhum livro encontrado.
          </p>
        )}
      </main>

      <button
        style={styles.fab}
        onClick={() => {
          setEditandoId(null);
          setNovoLivro({ nome: "", autor: "", ano: "", editora: "" });
          setIsModalOpen(true);
        }}
        title="Adicionar novo livro"
      >
        <Plus size={32} color="white" />
      </button>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ color: "#1f2937" }}>
                {editandoId ? "Editar Livro" : "Cadastrar Novo Livro"}
              </h3>
              <button onClick={fecharModal} style={styles.closeButton}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveBook} style={styles.modalForm}>
              <input
                placeholder="Nome do Livro"
                required
                style={styles.modalInput}
                value={novoLivro.nome}
                onChange={(e) =>
                  setNovoLivro({ ...novoLivro, nome: e.target.value })
                }
              />
              <input
                placeholder="Autor"
                required
                style={styles.modalInput}
                value={novoLivro.autor}
                onChange={(e) =>
                  setNovoLivro({ ...novoLivro, autor: e.target.value })
                }
              />
              <input
                placeholder="Ano"
                type="number"
                required
                style={styles.modalInput}
                value={novoLivro.ano}
                onChange={(e) =>
                  setNovoLivro({ ...novoLivro, ano: e.target.value })
                }
              />
              <input
                placeholder="Editora"
                required
                style={styles.modalInput}
                value={novoLivro.editora}
                onChange={(e) =>
                  setNovoLivro({ ...novoLivro, editora: e.target.value })
                }
              />
              <button type="submit" style={styles.saveButton}>
                {editandoId ? "Salvar Alterações" : "Salvar Livro"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    padding: "2rem",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    position: "relative",
  },
  header: {
    marginBottom: "2rem",
    maxWidth: "1200px",
    margin: "0 auto 2rem auto",
  },
  pageTitle: { fontSize: "1.8rem", color: "#111827", marginBottom: "1rem" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  searchIcon: { color: "#9ca3af", marginRight: "0.75rem" },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    color: "#000",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    justifyContent: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    width: "250px",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  bookIconWrapper: {
    backgroundColor: "#eff6ff",
    width: "fit-content",
    padding: "0.75rem",
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  actionButton: {
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
  },
  bookTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#1f2937",
    minHeight: "2.5rem",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4b5563",
  },
  infoText: { fontSize: "0.9rem" },
  fab: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    backgroundColor: "#2563eb",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  closeButton: {
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#6b7280",
  },
  modalForm: { display: "flex", flexDirection: "column", gap: "1rem" },
  modalInput: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    width: "100%",
    gridColumn: "1 / -1",
  },
  spinner: {
    animation: "spin 1s linear infinite",
    display: "block",
    color: "#2563eb",
  },
};

export default BookSearch;
