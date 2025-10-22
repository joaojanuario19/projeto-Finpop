
// Lista de perguntas do quiz

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
      "Pagamento de dívidas",
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
  },

  // Adicione mais perguntas aqui
];

// Variáveis de controle
let perguntaAtual = 0;
let pontuacao = 0;
let respostasUsuario = [];

// Exibe a pergunta atual
function mostrarPergunta() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  const perguntaObj = perguntas[perguntaAtual];

  const titulo = document.createElement("h2");
  titulo.textContent = perguntaObj.pergunta;
  quizContainer.appendChild(titulo);

  perguntaObj.alternativas.forEach((alternativa, index) => {
    const botao = document.createElement("button");
    botao.textContent = alternativa;
    botao.classList.add("btn");
    botao.onclick = () => verificarResposta(index);
    quizContainer.appendChild(botao);
  });
}


// Verifica a resposta e avança
function verificarResposta(indiceEscolhido) {
  respostasUsuario.push(indiceEscolhido);

  if (indiceEscolhido === perguntas[perguntaAtual].respostaCorreta) {
    pontuacao++;
  }

  perguntaAtual++;
  if (perguntaAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
}

// Exibe o resultado final com explicações
function mostrarResultado() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  const resultado = document.getElementById("resultado");
  let mensagem = "";

  if (pontuacao === perguntas.length) {
    mensagem = "Incrível! Você acertou tudo. Seu conhecimento financeiro está afiado!";
  } else if (pontuacao >= perguntas.length / 2) {
    mensagem = "Muito bem! Você está no caminho certo. Continue aprendendo.";
  } else {
    mensagem = "Você pode melhorar! Que tal revisar alguns conceitos com a ajuda do Finpop?";
  }

  resultado.innerHTML = `
    <h2>Resultado</h2>
    <p>Você acertou ${pontuacao} de ${perguntas.length} perguntas.</p>
    <p>${mensagem}</p>
    <h3>Explicações:</h3>
  `;

  perguntas.forEach((pergunta, index) => {
    const correta = pergunta.respostaCorreta;
    const escolhida = respostasUsuario[index];
    const corretaTexto = pergunta.alternativas[correta];
    const escolhidaTexto = pergunta.alternativas[escolhida];
    const explicacaoTexto = pergunta.explicacao;

    resultado.innerHTML += `
      <div class="explicacao-item">
        <p><strong>${index + 1}. ${pergunta.pergunta}</strong></p>
        <p>✅ Correta: ${corretaTexto}</p>
        <p>📝 Sua resposta: ${escolhidaTexto}</p>
        <p>📚 explicação: ${explicacaoTexto}</p>
      </div>
      <hr>
    `;
  });

  resultado.innerHTML += `
    <p><a href="https://www.serasa.com.br/educacao-financeira/" target="_blank" class="link">🔗 Saiba mais sobre educação financeira</a></p>
  `;
}

// Inicia o quiz ao clicar no botão
document.addEventListener("DOMContentLoaded", () => {
  const botaoIniciar = document.getElementById("iniciar-quiz");
  if (botaoIniciar) {
    botaoIniciar.addEventListener("click", () => {
      perguntaAtual = 0;
      pontuacao = 0;
      respostasUsuario = [];
      document.getElementById("resultado").innerHTML = "";
      mostrarPergunta();
    });
  }
});

