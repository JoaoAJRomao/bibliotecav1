import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import livrosRoutes from './routes/livros';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/livros', livrosRoutes);

app.get('/', (req, res) => {
  res.send('Biblioteca API running');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
