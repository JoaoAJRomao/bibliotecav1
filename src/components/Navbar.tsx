"use client";
import React from "react";
import { LogOut, BookOpen, User } from "lucide-react";

interface NavbarProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userRole, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 dark:bg-neutral-900/75 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
          </div>
          <span className="font-bold text-lg sm:text-xl text-neutral-800 dark:text-neutral-100 tracking-tight">
            Biblioteca Digital
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">
              <User size={16} />
            </div>
            <span className="hidden sm:inline font-medium">
              Olá, <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{userName}</span>
              <span className="text-xs ml-1.5 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                {userRole === "admin" ? "Administrador" : "Leitor"}
              </span>
            </span>
            <span className="sm:hidden font-medium">
              {userName.split(" ")[0]}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200"
            title="Sair da conta"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
