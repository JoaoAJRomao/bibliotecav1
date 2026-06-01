"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, BookOpen } from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login efetuado:", data.user.name);
        const trintaMinutos = 1 / 48; // 30min é igual a 1/48 de um dia
        Cookies.set("user_session", data.token, {
          expires: trintaMinutos,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        router.push("/livros");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Erro",
          `Erro ao realizar login: ${errorData.error}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 px-4 py-8 font-sans">
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg w-full max-w-md transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-3">
            <BookOpen size={40} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-850 dark:text-neutral-100 tracking-tight">
            Biblioteca Digital
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
            >
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail
                size={20}
                className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
              />
              <input
                type="email"
                id="email-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
            >
              Senha
            </label>
            <div className="relative flex items-center">
              <Lock
                size={20}
                className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
              />
              <input
                type="password"
                id="password-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <button
            id="login-button"
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow-sm hover:shadow active:shadow-none transition-all duration-200 text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-150 dark:border-neutral-800 text-center">
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Não tem uma conta?
          </p>
          <button
            onClick={() => router.push("/cadastro")}
            className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline bg-transparent border-none cursor-pointer"
          >
            Cadastre-se agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
