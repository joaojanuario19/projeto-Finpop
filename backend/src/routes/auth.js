const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'finpop_chave_secreta_super_segura_123';

// Registro de Usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  try {
    // Verificar se o usuário já existe
    const userExistResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExistResult.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir no banco
    const insertResult = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    // Gerar JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Erro no registro de usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao cadastrar.' });
  }
});

// Login de Usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha o e-mail e a senha.' });
  }

  try {
    // Buscar usuário
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
    }

    const user = userResult.rows[0];

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Gerar JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login de usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao fazer login.' });
  }
});

// Obter Usuário Logado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;
