const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Listar todas as metas do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const goalsResult = await db.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(goalsResult.rows);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao buscar metas.' });
  }
});

// Criar uma nova meta
router.post('/', authMiddleware, async (req, res) => {
  const { title, target_amount, saved_amount, target_months } = req.body;

  if (!title || !target_amount || !target_months) {
    return res.status(400).json({ message: 'Preencha o título, o valor total e o prazo em meses da meta.' });
  }

  try {
    const insertResult = await db.query(
      `INSERT INTO goals (user_id, title, target_amount, saved_amount, target_months) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.id, title, target_amount, saved_amount || 0, target_months]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao criar meta.' });
  }
});

// Atualizar o valor guardado ou detalhes de uma meta
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, target_amount, saved_amount, target_months } = req.body;

  try {
    // Verificar propriedade da meta
    const checkGoal = await db.query('SELECT id FROM goals WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (checkGoal.rows.length === 0) {
      return res.status(404).json({ message: 'Meta não encontrada ou acesso não autorizado.' });
    }

    const updateResult = await db.query(
      `UPDATE goals 
       SET title = COALESCE($1, title), 
           target_amount = COALESCE($2, target_amount), 
           saved_amount = COALESCE($3, saved_amount), 
           target_months = COALESCE($4, target_months)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, target_amount, saved_amount, target_months, id, req.user.id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao atualizar meta.' });
  }
});

// Excluir uma meta
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar propriedade da meta
    const checkGoal = await db.query('SELECT id FROM goals WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (checkGoal.rows.length === 0) {
      return res.status(404).json({ message: 'Meta não encontrada ou acesso não autorizado.' });
    }

    await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Meta excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao excluir meta.' });
  }
});

module.exports = router;
