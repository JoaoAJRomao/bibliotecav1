import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET || "esta_e_uma_chave_reserva_muito_longa_para_testes_123";
const SECRET_KEY = new TextEncoder().encode(secret);

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function getSessionUser(request?: Request): Promise<SessionUser | null> {
  try {
    let token: string | undefined;

    // 1. Tentar ler do cabeçalho Authorization (Bearer token)
    if (request) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // 2. Tentar ler do Cookie se não estiver no cabeçalho
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get("user_session")?.value;
      } catch (error) {
        // Ignora erros de chamada fora do contexto de requisição (comum em testes do Vitest)
      }
    }

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    // Validar se payload tem os dados esperados
    if (typeof payload === 'object' && payload !== null && 'id' in payload && 'role' in payload) {
      return payload as unknown as SessionUser;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return null;
  }
}
