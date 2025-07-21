import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react'; // 👈 import icone
import styles from './AppFooter.module.css';

const AppFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>BoolShop</h3>
            <p className={styles.description}>
              Stampe d'arte di alta qualità nel formato 45x75 cm per trasformare i tuoi spazi.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Navigazione</h4>
            <nav className={styles.links}>
              <Link to="/" className={styles.link}>Homepage</Link>
              <Link to="/about" className={styles.link}>Chi siamo</Link>
              <Link to="/gallery" className={styles.link}>Galleria</Link>
              <Link to="/contact" className={styles.link}>Contatti</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Newsletter</h4>
            <p className={styles.newsletterText}>
              Ricevi le nostre ultime novità e offerte speciali
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="La tua email"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterButton}>
                Iscriviti
              </button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2024 BoolShop. Tutti i diritti riservati.
          </p>
          <div className={styles.payment}>
            <span className={styles.paymentText}>Accettiamo:</span>
            <div className={styles.paymentMethods}>
              <span>💳</span>
              <span>🏧</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
