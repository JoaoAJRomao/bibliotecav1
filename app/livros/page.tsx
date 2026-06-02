"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookData } from "../../src/interfaces";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Search, Plus, Loader2 } from "lucide-react";

import { Navbar } from "../../src/components/Navbar";
import { BookCard } from "../../src/components/BookCard";
import { BookModal } from "../../src/components/BookModal";
import { ActiveLoansList, ActiveLoan } from "../../src/components/ActiveLoansList";

interface BookWithStock extends BookData {
  quantity: number;
  availableCopies: number;
}

const BookSearch = () => {
  const [livros, setLivros] = useState<BookWithStock[]>([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  
  // Dados do usuário logado
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; id: number } | null>(null);
  // Empréstimos ativos do usuário comum
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([]);

  const router = useRouter();

  const [novoLivro, setNovoLivro] = useState({
    nome: "",
    autor: "",
    ano: "",
    editora: "",
    quantidade: "1",
  });

  // Carregar usuário e acervo
  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        setLoading(true);
        // 1. Obter informações de sessão
        const sessionResponse = await fetch("/api/auth/me");
        if (!sessionResponse.ok) {
          router.push("/");
          return;
        }
        const sessionData = await sessionResponse.json();
        setCurrentUser(sessionData.user);

        // 2. Carregar livros
        const booksResponse = await fetch("/api/livros");
        const booksData = await booksResponse.json();
        setLivros(booksData);

        // 3. Se for usuário comum, carregar empréstimos ativos
        if (sessionData.user.role === "user") {
          const loansResponse = await fetch("/api/emprestimos");
          if (loansResponse.ok) {
            const loansData = await loansResponse.json();
            setActiveLoans(loansData);
          }
        }
      } catch (error) {
        console.error("Falha ao inicializar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, [router]);

  // Atualizar acervo e empréstimos
  const refreshData = async () => {
    try {
      const booksResponse = await fetch("/api/livros");
      const booksData = await booksResponse.json();
      setLivros(booksData);

      if (currentUser?.role === "user") {
        const loansResponse = await fetch("/api/emprestimos");
        if (loansResponse.ok) {
          const loansData = await loansResponse.json();
          setActiveLoans(loansData);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar acervo:", error);
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const anoParseado = parseInt(novoLivro.ano, 10);
    const quantidadeParseada = parseInt(novoLivro.quantidade, 10);

    if (isNaN(anoParseado)) {
      Swal.fire({
        icon: "error",
        title: "Ano Inválido",
        text: "Por favor, insira um número válido para o ano.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (isNaN(quantidadeParseada) || quantidadeParseada < 1) {
      Swal.fire({
        icon: "error",
        title: "Estoque Inválido",
        text: "Por favor, insira uma quantidade de estoque válida (mínimo 1).",
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
      quantity: quantidadeParseada,
    };

    try {
      const method = editandoId ? "PUT" : "POST";
      const response = await fetch("/api/livros", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        fecharModal();
        await refreshData();
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
        const err = await response.json();
        throw new Error(err.error || "Erro no servidor");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível salvar o livro.";
      Swal.fire({
        icon: "error",
        title: "Erro de gravação",
        text: errorMessage,
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
          await refreshData();
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

  const handleBorrowBook = async (bookId: number) => {
    setActionLoadingId(bookId);
    try {
      const response = await fetch("/api/emprestimos/retirada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        await refreshData();
        Swal.fire({
          icon: "success",
          title: "Empréstimo Confirmado!",
          text: "Retirada de livro registrada com sucesso.",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        const errData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Não foi possível emprestar",
          text: errData.error || "Erro ao realizar empréstimo.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Erro ao pegar emprestado:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReturnBook = async (bookId: number) => {
    setActionLoadingId(bookId);
    try {
      const response = await fetch("/api/emprestimos/devolucao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        await refreshData();
        Swal.fire({
          icon: "success",
          title: "Devolução Confirmada!",
          text: "Obrigado por devolver o livro no prazo.",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        const errData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erro na devolução",
          text: errData.error || "Erro ao realizar devolução.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove("user_session");
    router.push("/");
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditandoId(null);
    setNovoLivro({ nome: "", autor: "", ano: "", editora: "", quantidade: "1" });
  };

  const handleOpenEdit = (livro: BookWithStock) => {
    setNovoLivro({
      nome: livro.title,
      autor: livro.author,
      ano: livro.year.toString(),
      editora: livro.publisher,
      quantidade: livro.quantity.toString(),
    });
    setEditandoId(livro.id);
    setIsModalOpen(true);
  };

  const livrosFiltrados = livros.filter((livro) =>
    livro?.title?.toLowerCase().includes(busca.toLowerCase())
  );

  const isBookBorrowed = (bookId: number) => {
    return activeLoans.some((loan) => loan.bookId === bookId);
  };

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
        <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-neutral-500 dark:text-neutral-400 mt-4 font-medium animate-pulse">
          Carregando ambiente da biblioteca...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans transition-colors duration-200">
      {currentUser && (
        <Navbar
          userName={currentUser.name}
          userRole={currentUser.role}
          onLogout={handleLogout}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Painel de Empréstimos Ativos do Leitor */}
        {currentUser?.role === "user" && (
          <section className="animate-fade-in">
            <ActiveLoansList
              loans={activeLoans}
              onReturn={handleReturnBook}
              actionLoadingId={actionLoadingId}
            />
          </section>
        )}

        {/* Seção Acervo / Busca */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-850 dark:text-neutral-100">
                Consulta de Acervo
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Explore os livros físicos disponíveis para empréstimo
              </p>
            </div>

            {/* Barra de Busca */}
            <div className="relative w-full sm:max-w-xs flex items-center">
              <Search
                size={18}
                className="absolute left-3 text-neutral-400 dark:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Buscar por nome do livro..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-xs"
              />
            </div>
          </div>

          {/* Grid de Livros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {livrosFiltrados.length > 0 ? (
              livrosFiltrados.map((livro) => (
                <BookCard
                  key={livro.id}
                  book={livro}
                  userRole={currentUser?.role || "user"}
                  hasActiveLoan={isBookBorrowed(livro.id)}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteBook}
                  onBorrow={handleBorrowBook}
                  onReturn={handleReturnBook}
                  actionLoading={actionLoadingId === livro.id}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-500 dark:text-neutral-455 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                Nenhum livro encontrado no acervo.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB - Adicionar Livro (Apenas Admin) */}
      {currentUser?.role === "admin" && (
        <button
          onClick={() => {
            setEditandoId(null);
            setNovoLivro({ nome: "", autor: "", ano: "", editora: "", quantidade: "1" });
            setIsModalOpen(true);
          }}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-blue-600 hover:bg-blue-500 text-white p-4 sm:p-5 rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 z-30"
          title="Adicionar novo livro"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Modal de Criação / Edição (Apenas Admin) */}
      {currentUser?.role === "admin" && (
        <BookModal
          isOpen={isModalOpen}
          onClose={fecharModal}
          editandoId={editandoId}
          novoLivro={novoLivro}
          setNovoLivro={setNovoLivro}
          onSave={handleSaveBook}
        />
      )}
    </div>
  );
};

export default BookSearch;
