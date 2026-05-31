import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{ padding: '0 1rem' }}>
      <nav className={styles.menuNavegacao} aria-label="Menu principal">
        <Link to="/" className={styles.logo} aria-label="Ir para a página inicial do Finpop">
          <span className={styles.fin}>Fin</span><span className={styles.pop}>pop</span>
        </Link>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Quiz
            </NavLink>
          </li>
          <li>
            <NavLink to="/planejamento" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              Planejamento
            </NavLink>
          </li>
          {user ? (
            <li className={styles.userInfo}>
              <span className={styles.userName}>Olá, {user.name}</span>
              <button onClick={logout} className={styles.btnLogout}>Sair</button>
            </li>
          ) : (
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Entrar
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
