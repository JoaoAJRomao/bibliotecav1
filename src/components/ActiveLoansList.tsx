"use client";
import React from "react";
import { Calendar, Loader2, RefreshCw, Bookmark } from "lucide-react";

export interface ActiveLoan {
  id: number;
  userId: number;
  bookId: number;
  borrowedAt: string;
  returnedAt: string | null;
  book: {
    id: number;
    title: string;
    author: string;
    year: number;
    publisher: string;
  };
}

export interface ActiveLoansListProps {
  loans: ActiveLoan[];
  onReturn: (bookId: number) => void;
  actionLoadingId: number | null;
}

export const ActiveLoansList: React.FC<ActiveLoansListProps> = ({
  loans,
  onReturn,
  actionLoadingId,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loans.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 dark:text-neutral-400">
        <Bookmark className="mx-auto text-neutral-300 dark:text-neutral-600 mb-3" size={36} />
        <p className="font-semibold text-sm">Você não possui empréstimos ativos no momento.</p>
        <p className="text-xs text-neutral-400 mt-1">Explore o acervo abaixo para solicitar um livro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-neutral-850 dark:text-neutral-100 text-lg flex items-center gap-2">
        <Bookmark size={20} className="text-blue-600 dark:text-blue-400" />
        <span>Meus Empréstimos Ativos ({loans.length})</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h4 className="font-bold text-neutral-850 dark:text-neutral-100 line-clamp-1">
                {loan.book.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                Por {loan.book.author}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 mt-3">
                <Calendar size={14} />
                <span>Retirado em: {formatDate(loan.borrowedAt)}</span>
              </div>
            </div>

            <button
              onClick={() => onReturn(loan.bookId)}
              disabled={actionLoadingId === loan.bookId}
              className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-white font-semibold text-xs rounded-lg transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50"
            >
              {actionLoadingId === loan.bookId ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              <span>Devolver</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
