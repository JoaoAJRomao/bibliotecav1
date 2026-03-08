"use client";
import React, { useState, CSSProperties } from "react";
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
        const trintaMinutos = 1 / 48; //30min é igual 1/48 de um dia
        Cookies.set("user_session", data.token, {
          expires: trintaMinutos,
          sameSite: "strict", // Recomendado para segurança
          secure: process.env.NODE_ENV === "production", // Apenas via HTTPS em produção
        });
        router.push("/livros");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Erro",
          `Erro ao realizar login: ${errorData.error}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <BookOpen size={40} color="#2563eb" />
          <h2 style={styles.title}>Biblioteca Digital</h2>
          <p style={styles.subtitle}>Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.icon} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.icon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <div style={styles.registerContainer}>
          <p style={styles.registerText}>Não tem uma conta?</p>
          <button
            onClick={() => router.push("/cadastro")}
            style={styles.registerButton}
          >
            Cadastre-se agora
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.5rem",
    color: "#1f2937",
    margin: "0.5rem 0",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "#374151",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "0.5rem",
  },
  icon: {
    color: "#9ca3af",
    marginRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    color: "#000",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  registerContainer: {
    marginTop: "1.5rem",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "1rem",
  },
  registerText: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  registerButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.9rem",
    textDecoration: "underline",
  },
};

export default Login;
