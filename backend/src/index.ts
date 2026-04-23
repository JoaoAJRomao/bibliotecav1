import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import livrosRoutes from './routes/livros';
import { db } from './db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/livros', livrosRoutes);
app.get('/health', (req, res) => res.sendStatus(200));

async function setupDatabase() {
  console.log('Verificando e sincronizando tabelas...');
  try {
    await migrate(db, {
      migrationsFolder: path.join(__dirname, '../drizzle')
    });
    console.log('Tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar banco:', error);
    process.exit(1);
  }
}

setupDatabase().then(() => {
  app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
  });
}).catch(err => {
  console.error('Falha ao sincronizar banco:', err);
});
