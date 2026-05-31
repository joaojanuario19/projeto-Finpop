import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Planejamento.module.css';

const Planejamento = () => {
  const { user, token, API_URL } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('orcamento');

  // Estado do Orçamento 50-30-20
  const [receita, setReceita] = useState(0);
  const [gastosNecessidades, setGastosNecessidades] = useState(0);
  const [gastosDesejos, setGastosDesejos] = useState(0);
  const [gastosInvestimentos, setGastosInvestimentos] = useState(0);
  const [saveBudgetStatus, setSaveBudgetStatus] = useState('');

  // Estado das Metas
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTargetAmount, setNewGoalTargetAmount] = useState('');
  const [newGoalSavedAmount, setNewGoalSavedAmount] = useState('');
  const [newGoalTargetMonths, setNewGoalTargetMonths] = useState('');
  const [updateSavedAmount, setUpdateSavedAmount] = useState({});
  const [saveGoalError, setSaveGoalError] = useState('');

  useEffect(() => {
    if (user && token) {
      loadBudget();
      loadGoals();
    }
  }, [user, token]);

  // Carregar dados de orçamento do servidor
  const loadBudget = async () => {
    try {
      const response = await fetch(`${API_URL}/budget`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReceita(Number(data.monthly_income) || 0);
        setGastosNecessidades(Number(data.needs_spent) || 0);
        setGastosDesejos(Number(data.wants_spent) || 0);
        setGastosInvestimentos(Number(data.savings_spent) || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar orçamento do backend:', error);
    }
  };

  // Salvar orçamento no servidor
  const handleSaveBudget = async () => {
    setSaveBudgetStatus('Salvando...');
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          monthly_income: receita,
          needs_spent: gastosNecessidades,
          wants_spent: gastosDesejos,
          savings_spent: gastosInvestimentos
        })
      });
      if (response.ok) {
        setSaveBudgetStatus('Orçamento salvo com sucesso!');
        setTimeout(() => setSaveBudgetStatus(''), 3000);
      } else {
        const err = await response.json();
        setSaveBudgetStatus(`Erro: ${err.message}`);
      }
    } catch (error) {
      setSaveBudgetStatus('Erro ao salvar no servidor.');
      console.error(error);
    }
  };

  // Carregar metas do servidor
  const loadGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  // Adicionar nova meta
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setSaveGoalError('');
    if (!newGoalTitle || !newGoalTargetAmount || !newGoalTargetMonths) {
      setSaveGoalError('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newGoalTitle,
          target_amount: Number(newGoalTargetAmount),
          saved_amount: Number(newGoalSavedAmount) || 0,
          target_months: Number(newGoalTargetMonths)
        })
      });

      if (response.ok) {
        setNewGoalTitle('');
        setNewGoalTargetAmount('');
        setNewGoalSavedAmount('');
        setNewGoalTargetMonths('');
        loadGoals();
      } else {
        const err = await response.json();
        setSaveGoalError(err.message || 'Erro ao salvar meta.');
      }
    } catch (error) {
      console.error(error);
      setSaveGoalError('Erro ao se conectar ao servidor.');
    }
  };

  // Atualizar valor guardado de uma meta
  const handleUpdateSavedAmount = async (goalId) => {
    const val = updateSavedAmount[goalId];
    if (val === undefined || val === '') return;

    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          saved_amount: Number(val)
        })
      });

      if (response.ok) {
        setUpdateSavedAmount(prev => ({ ...prev, [goalId]: '' }));
        loadGoals();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Excluir meta
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        loadGoals();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cálculos do Orçamento 50-30-20
  const necessidadeRecomendada = receita * 0.5;
  const desejoRecomendado = receita * 0.3;
  const investimentoRecomendado = receita * 0.2;

  return (
    <main>
      <section className={styles.containerApresentacao}>
        <img src="/imagens/coins-948603_1280.jpg" alt="Imagem ilustrativa sobre finanças" />
        <h1 className={styles.tituloBanner}>
          Organize sua vida com o <span className={styles.fin}>Fin</span><span className={styles.pop}>pop</span>
        </h1>
        <p className={styles.textoBanner}>"Planeje hoje. Conquiste amanhã."</p>
      </section>

      <section className={styles.secao}>
        <div className={styles.secaoFlex}>
          <div className={styles.containerConteudo}>
            <h2 className={styles.rotulo}>O que é planejamento financeiro?</h2>
            <p className={styles.descricao}>
              É o processo de organizar sua vida financeira com metas, controle de gastos e estratégias para alcançar seus objetivos.
              Com o Finpop, você aprende de forma leve, prática e com ferramentas interativas personalizadas.
            </p>
          </div>
          <div className={styles.containerImg}>
            <img src="/imagens/coins-948603_1280.jpg" alt="Ilustração sobre planejamento financeiro" />
          </div>
        </div>
      </section>

      {/* Container de Ferramentas com Abas */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'orcamento' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('orcamento')}
          >
            Orçamento 50-30-20
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'metas' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('metas')}
          >
            Calculadora de Metas
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'artigos' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('artigos')}
          >
            Artigos Educacionais
          </button>
        </div>

        {/* Aba 1: Orçamento 50-30-20 */}
        {activeTab === 'orcamento' && (
          <div className={styles.orcamentoBox}>
            <h2 className={styles.toolTitle}>Planilha e Divisão do Orçamento (50-30-20)</h2>
            <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
              Insira sua receita mensal e acompanhe a distribuição ideal de acordo com a regra 50-30-20 (50% Necessidades Básicas, 30% Desejos Pessoais e 20% Poupança/Investimentos).
            </p>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="receita">Receita Mensal (R$)</label>
                <input
                  type="number"
                  id="receita"
                  value={receita || ''}
                  onChange={(e) => setReceita(Number(e.target.value))}
                  placeholder="Ex: 3000"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="necessidades">Gasto Real com Necessidades (R$)</label>
                <input
                  type="number"
                  id="necessidades"
                  value={gastosNecessidades || ''}
                  onChange={(e) => setGastosNecessidades(Number(e.target.value))}
                  placeholder="Ex: 1500"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="desejos">Gasto Real com Desejos (R$)</label>
                <input
                  type="number"
                  id="desejos"
                  value={gastosDesejos || ''}
                  onChange={(e) => setGastosDesejos(Number(e.target.value))}
                  placeholder="Ex: 800"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="investimentos">Gasto/Investimento Real (R$)</label>
                <input
                  type="number"
                  id="investimentos"
                  value={gastosInvestimentos || ''}
                  onChange={(e) => setGastosInvestimentos(Number(e.target.value))}
                  placeholder="Ex: 700"
                />
              </div>
            </div>

            {/* Quadro de Distribuição */}
            <div className={styles.distributionGrid}>
              {/* Card Necessidades */}
              <div className={styles.distCard} style={{ borderLeftColor: '#3498db' }}>
                <h3 className={styles.distTitle}>Necessidades Básicas (50%)</h3>
                <div className={styles.distValues}>
                  <span>💡 Recomendado: <strong>R$ {necessidadeRecomendada.toFixed(2)}</strong></span>
                  <span>💸 Gasto Real: <strong>R$ {gastosNecessidades.toFixed(2)}</strong></span>
                  {receita > 0 && (
                    gastosNecessidades > necessidadeRecomendada ? (
                      <span className={styles.warning}>⚠️ Você excedeu o recomendado em R$ {(gastosNecessidades - necessidadeRecomendada).toFixed(2)}!</span>
                    ) : (
                      <span className={styles.success}>✅ Dentro do orçamento recomendado.</span>
                    )
                  )}
                </div>
              </div>

              {/* Card Desejos */}
              <div className={styles.distCard} style={{ borderLeftColor: '#e74c3c' }}>
                <h3 className={styles.distTitle}>Desejos e Lazer (30%)</h3>
                <div className={styles.distValues}>
                  <span>🎉 Recomendado: <strong>R$ {desejoRecomendado.toFixed(2)}</strong></span>
                  <span>💸 Gasto Real: <strong>R$ {gastosDesejos.toFixed(2)}</strong></span>
                  {receita > 0 && (
                    gastosDesejos > desejoRecomendado ? (
                      <span className={styles.warning}>⚠️ Você excedeu o recomendado em R$ {(gastosDesejos - desejoRecomendado).toFixed(2)}!</span>
                    ) : (
                      <span className={styles.success}>✅ Dentro do orçamento recomendado.</span>
                    )
                  )}
                </div>
              </div>

              {/* Card Investimentos */}
              <div className={styles.distCard} style={{ borderLeftColor: '#2ecc71' }}>
                <h3 className={styles.distTitle}>Investimentos e Poupança (20%)</h3>
                <div className={styles.distValues}>
                  <span>📈 Recomendado: <strong>R$ {investimentoRecomendado.toFixed(2)}</strong></span>
                  <span>💸 Poupança Real: <strong>R$ {gastosInvestimentos.toFixed(2)}</strong></span>
                  {receita > 0 && (
                    gastosInvestimentos < investimentoRecomendado ? (
                      <span className={styles.warning}>⚠️ Tente guardar mais R$ {(investimentoRecomendado - gastosInvestimentos).toFixed(2)} para bater a meta.</span>
                    ) : (
                      <span className={styles.success}>✅ Ótimo trabalho! Meta de investimentos atingida.</span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Controle de Persistência */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className={styles.btnAction} onClick={handleSaveBudget}>
                  Salvar Orçamento no Banco
                </button>
                {saveBudgetStatus && <span style={{ fontWeight: 'bold', color: '#a8fc0b' }}>{saveBudgetStatus}</span>}
              </div>
            ) : (
              <p style={{ color: '#ffeb3b', fontSize: '0.9rem' }}>
                💡 <Link to="/login" style={{ color: '#ffeb3b', fontWeight: 'bold' }}>Faça login</Link> para salvar esta distribuição de orçamento no seu perfil!
              </p>
            )}
          </div>
        )}

        {/* Aba 2: Metas Financeiras */}
        {activeTab === 'metas' && (
          <div className={styles.metaBox}>
            <h2 className={styles.toolTitle}>Calculadora e Gestão de Metas</h2>
            <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
              Simule objetivos de curto, médio ou longo prazo. Veja exatamente quanto precisa economizar por mês para conquistar sua meta no prazo desejado.
            </p>

            {user ? (
              <>
                <form onSubmit={handleAddGoal} className={styles.formGrid} style={{ marginBottom: '2rem' }}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="meta_titulo">Objetivo (ex: Comprar Carro)</label>
                    <input
                      type="text"
                      id="meta_titulo"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Título da meta"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="meta_valor">Valor Total Alvo (R$)</label>
                    <input
                      type="number"
                      id="meta_valor"
                      value={newGoalTargetAmount}
                      onChange={(e) => setNewGoalTargetAmount(e.target.value)}
                      placeholder="Ex: 10000"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="meta_guardado">Valor Já Guardado (R$)</label>
                    <input
                      type="number"
                      id="meta_guardado"
                      value={newGoalSavedAmount}
                      onChange={(e) => setNewGoalSavedAmount(e.target.value)}
                      placeholder="Ex: 1000"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="meta_prazo">Prazo (em Meses)</label>
                    <input
                      type="number"
                      id="meta_prazo"
                      value={newGoalTargetMonths}
                      onChange={(e) => setNewGoalTargetMonths(e.target.value)}
                      placeholder="Ex: 12"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup} style={{ justifyContent: 'flex-end' }}>
                    <button type="submit" className={styles.btnAction}>Adicionar Meta</button>
                  </div>
                </form>

                {saveGoalError && <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '1.5rem' }}>{saveGoalError}</div>}

                <h3 style={{ color: '#a8fc0b', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Suas Metas Ativas</h3>
                {goals.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: '#ccc' }}>Nenhuma meta criada ainda. Preencha o formulário acima para criar!</p>
                ) : (
                  <div className={styles.goalsList}>
                    {goals.map((goal) => {
                      const target = Number(goal.target_amount);
                      const saved = Number(goal.saved_amount);
                      const percent = Math.min((saved / target) * 100, 100);
                      const remaining = target - saved;
                      const monthlyTarget = remaining > 0 ? (remaining / goal.target_months) : 0;

                      return (
                        <div key={goal.id} className={styles.goalCard}>
                          <div className={styles.goalHeader}>
                            <h4 className={styles.goalTitle}>{goal.title}</h4>
                            <button className={styles.btnDelete} onClick={() => handleDeleteGoal(goal.id)}>Excluir</button>
                          </div>

                          <div className={styles.goalProgressContainer}>
                            <div className={styles.progressBarOuter}>
                              <div className={styles.progressBarInner} style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>

                          <div className={styles.goalInfo}>
                            <span>R$ {saved.toFixed(2)} de R$ {target.toFixed(2)}</span>
                            <span>{percent.toFixed(0)}% concluído</span>
                          </div>

                          <div className={styles.goalSimulation}>
                            {remaining > 0 ? (
                              <span>Prazo: {goal.target_months} meses. Economize <strong>R$ {monthlyTarget.toFixed(2)}/mês</strong>.</span>
                            ) : (
                              <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>🎉 Meta Concluída! Parabéns!</span>
                            )}
                          </div>

                          {remaining > 0 && (
                            <div className={styles.goalUpdateForm}>
                              <input
                                type="number"
                                placeholder="Novo Total"
                                value={updateSavedAmount[goal.id] || ''}
                                onChange={(e) => setUpdateSavedAmount({ ...updateSavedAmount, [goal.id]: e.target.value })}
                              />
                              <button className={styles.btnSmall} onClick={() => handleUpdateSavedAmount(goal.id)}>Atualizar</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#ffeb3b', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  💡 Você precisa estar logado para criar, gerenciar e calcular suas metas financeiras.
                </p>
                <Link to="/login" className={styles.btnAction}>Fazer Login</Link>
              </div>
            )}
          </div>
        )}

        {/* Aba 3: Artigos Educacionais */}
        {activeTab === 'artigos' && (
          <div className={styles.orcamentoBox}>
            <h2 className={styles.toolTitle}>Artigos de Educação Financeira</h2>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
              Aprenda mais sobre o mercado financeiro e estratégias de economia com nossos artigos selecionados.
            </p>

            <div className={styles.artigosGrid}>
              <div className={styles.artigoCard}>
                <h3 className={styles.artigoTitle}>Como montar a Reserva de Emergência</h3>
                <p className={styles.artigoDesc}>
                  Entenda o passo a passo de como calcular seu custo de vida mensal e qual a importância de ter um fundo seguro com liquidez diária.
                </p>
                <a href="https://www.serasa.com.br/educacao-financeira/" target="_blank" rel="noopener noreferrer" className={styles.artigoLink}>Ler artigo completo ↗</a>
              </div>

              <div className={styles.artigoCard}>
                <h3 className={styles.artigoTitle}>Entendendo os Juros Compostos</h3>
                <p className={styles.artigoDesc}>
                  Descubra o impacto dos juros compostos no dia-a-dia e como os bancos lucram com isso.
                </p>
                <a href="https://www.todamateria.com.br/juros-compostos/" target="_blank" rel="noopener noreferrer" className={styles.artigoLink}>Ler artigo completo ↗</a>
              </div>

              <div className={styles.artigoCard}>
                <h3 className={styles.artigoTitle}>Evitando dívidas de cartão de crédito</h3>
                <p className={styles.artigoDesc}>
                  O cartão de crédito pode ser um grande aliado ou o pior inimigo do seu bolso. Conheça as melhores dicas práticas para usá-lo com consciência.
                </p>
                <a href="https://www.cnnbrasil.com.br/economia/negocios/como-controlar-gastos-no-cartao-de-credito-e-evitar-dividas/" target="_blank" rel="noopener noreferrer" className={styles.artigoLink}>Ler artigo completo ↗</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Planejamento;
