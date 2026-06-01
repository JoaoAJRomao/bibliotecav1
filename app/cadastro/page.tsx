"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const Cadastro = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Senhas diferentes",
        text: "As senhas inseridas não coincidem.",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Conta criada com sucesso. Faça login agora!",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/");
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erro no cadastro",
          text: data.error,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 px-4 py-8 font-sans">
      <div className="relative bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg w-full max-w-md transition-all duration-300">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-5 left-5 flex items-center gap-1 text-xs sm:text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-3">
            <UserPlus size={36} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-850 dark:text-neutral-100 tracking-tight">
            Criar Conta
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Junte-se à nossa biblioteca virtual
          </p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          <div className="relative flex items-center">
            <User
              size={18}
              className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="text"
              placeholder="Nome Completo"
              required
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="relative flex items-center">
            <Mail
              size={18}
              className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="relative flex items-center">
            <Lock
              size={18}
              className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="password"
              placeholder="Senha"
              required
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="relative flex items-center">
            <Lock
              size={18}
              className="absolute left-3.5 text-neutral-400 dark:text-neutral-500"
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              required
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 text-sm"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
