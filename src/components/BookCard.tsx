"use client";
import React from "react";
import { Book, User, Calendar, Building2, Pencil, Trash2, Loader2, BookmarkCheck } from "lucide-react";
import { BookData } from "../interfaces";

export interface BookCardProps {
  book: BookData & { quantity: number; availableCopies: number };
  userRole: string;
  hasActiveLoan: boolean;
  onEdit?: (book: BookData & { quantity: number; availableCopies: number }) => void;
  onDelete?: (id: number) => void;
  onBorrow?: (id: number) => void;
  onReturn?: (id: number) => void;
  actionLoading?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  userRole,
  hasActiveLoan,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  actionLoading = false,
}) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[360px] group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl transition-transform duration-300 group-hover:scale-105">
            <Book size={28} />
          </div>

          {userRole === "admin" && (
            <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit?.(book)}
                className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
                title="Editar Livro"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete?.(book.id)}
                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
                title="Remover Livro"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          {userRole === "user" && hasActiveLoan && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
              <BookmarkCheck size={14} />
              <span>Emprestado</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-neutral-800 dark:text-neutral-100 text-lg leading-snug line-clamp-2 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {book.title}
        </h3>

        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <User size={16} className="text-neutral-400" />
            <span className="truncate">{book.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neutral-400" />
            <span>Ano: {book.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-neutral-400" />
            <span className="truncate">{book.publisher}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col gap-3">
        {/* Estoque e cópias disponíveis */}
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-neutral-500">Disponibilidade</span>
          {isAvailable ? (
            <span className="text-green-600 dark:text-green-400">
              Disponível ({book.availableCopies} de {book.quantity})
            </span>
          ) : (
            <span className="text-red-500 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded">
              Esgotado
            </span>
          )}
        </div>

        {/* Botão de ação rápida */}
        {userRole === "user" && (
          <div>
            {hasActiveLoan ? (
              <button
                onClick={() => onReturn?.(book.id)}
                disabled={actionLoading}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                <span>Devolver Livro</span>
              </button>
            ) : (
              <button
                onClick={() => onBorrow?.(book.id)}
                disabled={!isAvailable || actionLoading}
                className={`w-full py-2 font-semibold text-sm rounded-xl transition-all duration-200 flex justify-center items-center gap-2 ${
                  isAvailable
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                <span>{isAvailable ? "Solicitar Empréstimo" : "Não Disponível"}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
