"use client";
import React from "react";
import { X, Save } from "lucide-react";

export interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  editandoId: number | null;
  novoLivro: {
    nome: string;
    autor: string;
    ano: string;
    editora: string;
    quantidade: string;
    isbn: string;
  };
  setNovoLivro: React.Dispatch<
    React.SetStateAction<{
      nome: string;
      autor: string;
      ano: string;
      editora: string;
      quantidade: string;
      isbn: string;
    }>
  >;
  onSave: (e: React.FormEvent) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  editandoId,
  novoLivro,
  setNovoLivro,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay with fade-in effect */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 z-10 transform transition-all duration-300 border border-neutral-200 dark:border-neutral-850">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {editandoId ? "Editar Livro" : "Cadastrar Novo Livro"}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Nome do Livro
            </label>
            <input
              type="text"
              placeholder="Ex: Dom Casmurro"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={novoLivro.nome}
              onChange={(e) => setNovoLivro({ ...novoLivro, nome: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Autor
            </label>
            <input
              type="text"
              placeholder="Ex: Machado de Assis"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={novoLivro.autor}
              onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Ano de Lançamento
              </label>
              <input
                type="number"
                placeholder="Ex: 1899"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                value={novoLivro.ano}
                onChange={(e) => setNovoLivro({ ...novoLivro, ano: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Estoque (Cópias)
              </label>
              <input
                type="number"
                placeholder="Ex: 5"
                min="1"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                value={novoLivro.quantidade}
                onChange={(e) => setNovoLivro({ ...novoLivro, quantidade: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              ISBN (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: 9788535914849"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={novoLivro.isbn}
              onChange={(e) => setNovoLivro({ ...novoLivro, isbn: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Editora
            </label>
            <input
              type="text"
              placeholder="Ex: Livraria Garnier"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={novoLivro.editora}
              onChange={(e) => setNovoLivro({ ...novoLivro, editora: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            <span>{editandoId ? "Salvar Alterações" : "Adicionar ao Acervo"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
