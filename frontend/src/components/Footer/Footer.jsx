import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.rodape}>
      <div className={styles.rodapeFlex}>
        {/* Logo e faculdade */}
        <div className={styles.rodapeIdentidade}>
          <img src="/imagens/logo-faculdade.png" alt="Logo da Faculdade" className={styles.logoFaculdade} />
          <p>Universidade Exemplar do Brasil</p>
        </div>

        {/* Autores e orientadores */}
        <div className={styles.rodapeAutoria}>
          <p><strong>Autor:</strong> João Januário Coelho da Silva</p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Orientadores:</strong> Prof. Carlos Augusto Sicsú Ayres do Nascimento e Leonardo Boia da Silva
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
