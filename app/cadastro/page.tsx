"use client";
import React, { useState, CSSProperties } from "react";
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

  const handleCadastro = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => router.push("/")} style={styles.backButton}>
          <ArrowLeft size={18} /> Voltar
        </button>

        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserPlus size={32} color="#2563eb" />
          </div>
          <h1 style={styles.title}>Criar Conta</h1>
          <p style={styles.subtitle}>Junte-se à nossa biblioteca virtual</p>
        </div>

        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.inputGroup}>
            <User style={styles.inputIcon} size={20} />
            <input
              placeholder="Nome Completo"
              required
              style={styles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail style={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="E-mail"
              required
              style={styles.input}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Senha"
              required
              style={styles.input}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Confirmar Senha"
              required
              style={styles.input}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button type="submit" style={styles.button}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  header: { textAlign: "center", marginBottom: "2rem" },
  iconCircle: {
    backgroundColor: "#eff6ff",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1rem",
  },
  title: { fontSize: "1.5rem", color: "#111827", fontWeight: "bold" },
  subtitle: { color: "#6b7280", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  inputGroup: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", color: "#9ca3af" },
  input: {
    width: "100%",
    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
    color: "#000",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#white",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default Cadastro;
