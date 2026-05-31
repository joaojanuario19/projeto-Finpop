const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Salvar uma nova tentativa de quiz
router.post('/attempt', authMiddleware, async (req, res) => {
  const { score, total_questions } = req.body;

  if (score === undefined || !total_questions) {
    return res.status(400).json({ message: 'Dados incompletos. Forneça o score e total_questions.' });
  }

  try {
    const insertResult = await db.query(
      'INSERT INTO quiz_attempts (user_id, score, total_questions) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, score, total_questions]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar tentativa de quiz:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao salvar resultado do quiz.' });
  }
});

// Listar histórico de quiz do usuário logado
router.get('/attempts', authMiddleware, async (req, res) => {
  try {
    const results = await db.query(
      'SELECT * FROM quiz_attempts WHERE user_id = $1 ORDER BY completed_at DESC',
      [req.user.id]
    );
    res.json(results.rows);
  } catch (error) {
    console.error('Erro ao buscar tentativas de quiz:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao buscar histórico do quiz.' });
  }
});

module.exports = router;
