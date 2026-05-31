const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

// Obter orçamento atual do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgetResult = await db.query('SELECT * FROM budgets WHERE user_id = $1', [req.user.id]);
    
    if (budgetResult.rows.length === 0) {
      // Retornar um orçamento vazio padrão para o frontend se não houver um salvo
      return res.json({
        monthly_income: "0.00",
        needs_spent: "0.00",
        wants_spent: "0.00",
        savings_spent: "0.00"
      });
    }
    
    res.json(budgetResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao buscar dados do orçamento.' });
  }
});

// Salvar / Atualizar orçamento (UPSERT)
router.post('/', authMiddleware, async (req, res) => {
  const { monthly_income, needs_spent, wants_spent, savings_spent } = req.body;

  if (monthly_income === undefined) {
    return res.status(400).json({ message: 'A receita mensal (monthly_income) é obrigatória.' });
  }

  try {
    // Verificar se já existe orçamento para este usuário
    const checkExist = await db.query('SELECT id FROM budgets WHERE user_id = $1', [req.user.id]);
    
    let result;
    if (checkExist.rows.length > 0) {
      // Atualiza existente
      result = await db.query(
        `UPDATE budgets 
         SET monthly_income = $1, needs_spent = $2, wants_spent = $3, savings_spent = $4, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $5 
         RETURNING *`,
        [monthly_income, needs_spent || 0, wants_spent || 0, savings_spent || 0, req.user.id]
      );
    } else {
      // Insere novo
      result = await db.query(
        `INSERT INTO budgets (user_id, monthly_income, needs_spent, wants_spent, savings_spent) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [req.user.id, monthly_income, needs_spent || 0, wants_spent || 0, savings_spent || 0]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao salvar dados do orçamento.' });
  }
});

module.exports = router;
