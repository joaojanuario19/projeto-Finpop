import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Quiz.module.css';

const perguntas = [
  {
    pergunta: "O que é uma reserva de emergência?",
    alternativas: [
      "Um fundo para lazer",
      "Dinheiro guardado para imprevistos",
      "Investimento em ações",
      "Pagamento de dívidas"
    ],
    respostaCorreta: 1,
    explicacao: "A reserva de emergência é um valor guardado para cobrir imprevistos, como problemas de saúde ou perda de renda."
  },
  {
    pergunta: "O que é inflação?",
    alternativas: [
      "Aumento do valor da moeda",
      "Redução dos preços",
      "Aumento generalizado dos preços",
      "Crescimento do PIB"
    ],
    respostaCorreta: 2,
    explicacao: "Inflação é o aumento contínuo dos preços, reduzindo o poder de compra."
  },
  {
    pergunta: "Qual é o objetivo da taxa Selic?",
    alternativas: [
      "Controlar o câmbio",
      "Regular os preços dos alimentos",
      "Controlar a inflação e orientar os juros da economia",
      "Definir o salário mínimo"
    ],
    respostaCorreta: 2,
    explicacao: "A Selic é a taxa básica de juros usada para controlar a inflação."
  },
  {
    pergunta: "Na metodologia 50-30-20, o que representa o “50” ?",
    alternativas: [
      "Investimentos",
      "Lazer",
      "Necessidades básicas",
      "Dívidas"
    ],
    respostaCorreta: 2,
    explicacao: "50% da renda deve ser destinada a despesas essenciais como moradia e alimentação."
  },
  {
    pergunta: "Na metodologia 50-30-20, o que representa o “30” ?",
    alternativas: [
      "Dívidas",
      "Lazer e desejos pessoais",
      "Poupança",
      "Impostos"
    ],
    respostaCorreta: 1,
    explicacao: "30% da renda é para gastos com estilo de vida, como lazer e compras não essenciais."
  },
  {
    pergunta: "Qual ativo é mais recomendado para reserva de emergência?",
    alternativas: [
      "Ações de empresas",
      "Fundos imobiliários",
      "Tesouro Selic",
      "Criptomoedas"
    ],
    respostaCorreta: 2,
    explicacao: "O Tesouro Selic é seguro, tem liquidez diária e baixo risco — ideal para emergências."
  },
  {
    pergunta: "Na metodologia 50-30-20, o que representa o “20” ?",
    alternativas: [
      "Gastos com transporte",
      "Investimentos e reserva de emergência",
      "Compras parceladas"
    ],
    respostaCorreta: 1,
    explicacao: "20% da renda deve ser destinada à construção de patrimônio e segurança financeira."
  },
  {
    pergunta: "O que é liquidez de um investimento ?",
    alternativas: [
      "Capacidade de gerar lucro",
      "Facilidade de transformar em dinheiro",
      "Risco de perda",
      "Taxa de juros aplicada"
    ],
    respostaCorreta: 1,
    explicacao: "Liquidez é a rapidez com que um ativo pode ser convertido em dinheiro."
  },
  {
    pergunta: "O que é um ativo financeiro ?",
    alternativas: [
      "Um bem que gera renda ou valor",
      "Um gasto fixo",
      "Um imposto",
      "Uma dívida"
    ],
    respostaCorreta: 0,
    explicacao: "Ativos são recursos que podem gerar retorno financeiro."
  },
  {
    pergunta: "Qual é uma boa prática para definir metas financeiras?",
    alternativas: [
      "Evitar pensar no futuro",
      "Gastar tudo que ganha",
      "Estabelecer objetivos claros e prazos",
      "Ignorar o orçamento"
    ],
    respostaCorreta: 2,
    explicacao: "Metas financeiras devem ser específicas, mensuráveis e com prazo definido para serem alcançáveis."
  }
];

const Quiz = () => {
  const { user, token, API_URL } = useContext(AuthContext);
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  
  const quizActiveRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      fetchHistory();
    }
  }, [user, token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/quiz/attempts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico do quiz:', error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setScore(0);
    setTimeout(() => {
      quizActiveRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnswer = (optionIndex) => {
    const isCorrect = optionIndex === perguntas[currentQuestion].respostaCorreta;
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    
    let newScore = score;
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentQuestion + 1 < perguntas.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(newScore, newAnswers);
    }
  };

  const finishQuiz = async (finalScore, finalAnswers) => {
    setQuizFinished(true);
    setQuizStarted(false);

    if (user && token) {
      try {
        await fetch(`${API_URL}/quiz/attempt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            score: finalScore,
            total_questions: perguntas.length
          })
        });
        fetchHistory(); // Recarregar histórico
      } catch (error) {
        console.error('Erro ao salvar tentativa no servidor:', error);
      }
    }
    
    setTimeout(() => {
      quizActiveRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Mensagem final baseada no score
  const getResultMessage = () => {
    if (score === perguntas.length) {
      return "Incrível! Você acertou tudo. Seu conhecimento financeiro está afiado!";
    } else if (score >= perguntas.length / 2) {
      return "Muito bem! Você está no caminho certo. Continue aprendendo.";
    } else {
      return "Você pode melhorar! Que tal revisar alguns conceitos com a ajuda do Finpop?";
    }
  };

  return (
    <main>
      <section className={styles.containerApresentacao}>
        <img src="/imagens/cow-1357210_1280.jpg" alt="Banner do quiz financeiro" />
        <h1 className={styles.tituloBanner}>Quiz Financeiro <br /><span className={styles.fin}>Fin</span><span className={styles.pop}>pop</span></h1>
        <p className={styles.textoBanner}>Faça o Quiz</p>
        <a href="#quiz-box" className={styles.ctaQuiz} onClick={(e) => { e.preventDefault(); startQuiz(); }}>
          Iniciar Quiz
        </a>
      </section>

      <section className={styles.secao} id="quiz-box" ref={quizActiveRef}>
        {!quizStarted && !quizFinished && (
          <div className={styles.secaoFlex}>
            <div className={styles.containerConteudo}>
              <h2 className={styles.rotulo}>Como funciona o quiz?</h2>
              <p className={styles.descricao}>
                Você responderá 10 perguntas sobre finanças pessoais. Ao final, verá seu resultado e explicações detalhadas para cada questão.
              </p>
              {!user && (
                <p style={{ margin: '1rem 0', color: '#ffeb3b', fontSize: '0.9rem' }}>
                  💡 Dica: <Link to="/login" style={{ color: '#ffeb3b', fontWeight: 'bold' }}>Faça login</Link> para salvar seu histórico de pontuação!
                </p>
              )}
              <button className={styles.btn} onClick={startQuiz}>
                Iniciar Quiz
              </button>
            </div>
            <div className={styles.containerImg}>
              <img src="/imagens/cow-1357210_1280.jpg" alt="Ícone ilustrativo do quiz" />
            </div>
          </div>
        )}

        {/* Quiz Ativo */}
        {quizStarted && (
          <div className={styles.quizActiveBox}>
            <div className={styles.progressText}>
              Pergunta {currentQuestion + 1} de {perguntas.length}
            </div>
            <h3 className={styles.questionTitle}>{perguntas[currentQuestion].pergunta}</h3>
            <div className={styles.optionsGrid}>
              {perguntas[currentQuestion].alternativas.map((option, index) => (
                <button 
                  key={index} 
                  className={styles.optionBtn}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {quizFinished && (
          <div className={styles.resultBox}>
            <h2 className={styles.resultTitle}>Resultado Final</h2>
            <p className={styles.resultScore}>Você acertou <strong>{score}</strong> de <strong>{perguntas.length}</strong> perguntas.</p>
            <p className={styles.resultMsg}>{getResultMessage()}</p>
            
            <button className={styles.btn} onClick={startQuiz} style={{ display: 'block', margin: '0 auto 2rem auto' }}>
              Refazer Quiz
            </button>

            <h3 className={styles.explanationsTitle}>Explicações Detalhadas:</h3>
            {perguntas.map((pergunta, index) => {
              const respostaEscolhida = userAnswers[index];
              const isCorrect = respostaEscolhida === pergunta.respostaCorreta;
              return (
                <div key={index} className={styles.explicacaoItem}>
                  <p><strong>{index + 1}. {pergunta.pergunta}</strong></p>
                  <p className={styles.correctAnswer}>
                    ✅ Correta: {pergunta.alternativas[pergunta.respostaCorreta]}
                  </p>
                  {!isCorrect && (
                    <p className={styles.wrongAnswer}>
                      ❌ Sua resposta: {pergunta.alternativas[respostaEscolhida]}
                    </p>
                  )}
                  <p className={styles.explicationText}>
                    <strong>Explicação:</strong> {pergunta.explicacao}
                  </p>
                </div>
              );
            })}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a 
                href="https://www.serasa.com.br/educacao-financeira/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#a8fc0b', fontWeight: 'bold', textDecoration: 'none' }}
              >
                🔗 Saiba mais sobre educação financeira na Serasa
              </a>
            </div>
          </div>
        )}

        {/* Histórico do Usuário Logado */}
        {user && history.length > 0 && !quizStarted && (
          <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>Seu Histórico de Tentativas</h3>
            <ul className={styles.historyList}>
              {history.map((attempt) => (
                <li key={attempt.id} className={styles.historyItem}>
                  <span>📅 {new Date(attempt.completed_at).toLocaleDateString('pt-BR')} às {new Date(attempt.completed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <strong>Pontuação: {attempt.score} / {attempt.total_questions}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};

export default Quiz;
