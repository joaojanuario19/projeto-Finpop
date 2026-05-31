import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <main>
      <div className={styles.containerApresentacao}>
        <img src="/imagens/money-2724241_1280.jpg" alt="Banner da página Início" />
        <h1 className={styles.tituloBanner}>
          Bem-Vindo ao <br /><span className={styles.fin}>Fin</span><span className={styles.pop}>pop</span>
        </h1>
        <span className={styles.textoBanner}>"Planeje hoje. Conquiste amanhã."</span>
      </div>

      <section className={styles.secaoHistoria}>
        <h2 className={styles.tituloHistoria}>Propósito do projeto</h2>
        <p className={styles.descricaoHistoria}>
          "Nosso site de educação financeira existe para simplificar o jeito de lidar com dinheiro. 
          A proposta é oferecer conteúdos práticos e acessíveis que ajudam qualquer pessoa a tomar decisões mais conscientes, 
          evitar dívidas e conquistar seus objetivos. Afinal, quase tudo na vida passa por escolhas financeiras 
          — e estar preparado faz toda a diferença."
        </p>
      </section>

      {/* Seção quiz Finanças */}
      <section className={styles.secao}>
        <div className={styles.secaoFlex}>
          <div className={styles.containerConteudo}>
            <h2 className={styles.rotulo}>Quiz Finanças</h2>
            <p className={styles.descricao}> 
              Teste seus conhecimentos! Responda ao nosso quiz interativo 
              e descubra o quanto você já sabe sobre finanças pessoais. 
              No final, veja explicações detalhadas e dicas práticas para melhorar ainda mais sua educação financeira.
            </p>
            <Link to="/quiz" className={styles.btn}>
              Fazer Quiz
            </Link>
          </div>
          <div className={styles.containerImg}>
            <img src="/imagens/cow-1357210_1280.jpg" alt="Imagem da página quiz Finanças" />
          </div>
        </div>
      </section>

      {/* Seção Planejamento */}
      <section className={styles.secao}>
        <div className={styles.secaoFlex}>
          <div className={styles.containerConteudo}>
            <h2 className={styles.rotulo}>Planejamento Financeiro</h2>
            <p className={styles.descricao}>     
              Planeje seu futuro! Aprenda a definir metas, controlar gastos e construir sua reserva de emergência. 
              Nesta página você encontra orientações e recursos para organizar suas finanças de forma simples e eficaz.
            </p>
            <Link to="/planejamento" className={styles.btn}>
              Acessar Planejamento
            </Link>
          </div>
          <div className={styles.containerImg}>
            <img src="/imagens/coins-948603_1280.jpg" alt="Imagem da página planejamento Financeiro" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
