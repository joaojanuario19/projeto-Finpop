const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const budgetRoutes = require('./routes/budget');
const goalsRoutes = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Testar Conexão com o Banco de Dados na Inicialização
db.query('SELECT NOW()')
  .then(res => {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso:', res.rows[0].now);
  })
  .catch(err => {
    console.error('ERRO ao se conectar ao PostgreSQL:', err.message);
    console.log('Certifique-se de configurar a variável DATABASE_URL no arquivo backend/.env');
  });

// Rota de Teste de Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'API Finpop ativa e operando.', timestamp: new Date() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/goals', goalsRoutes);

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
