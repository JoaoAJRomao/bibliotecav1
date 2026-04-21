import { Router } from 'express';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const router = Router();
const secret = process.env.JWT_SECRET || "esta_e_uma_chave_reserva_muito_longa_para_testes_123";
const SECRET_KEY = new TextEncoder().encode(secret);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      return res.status(401).json({ error: "Utilizador não encontrado." });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30min") // Expira em 30 minutos.
      .sign(SECRET_KEY);

    return res.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro na API de Login:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email)).limit(1);
      
    if (userExists.length > 0) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao processar cadastro." });
  }
});

export default router;
