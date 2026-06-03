import { Icon } from '../../shared/components/atoms/Icon';
import { Button } from '../../shared/components/atoms/Button';
import styles from './AdminHeader.module.css';

/**
 * Header horizontal do admin (substitui a sidebar — ganha largura inteira).
 * Esquerda: marca + navegação (Escores ativo). Direita: conta + Sair.
 * Conta/Sair são visuais no protótipo (sem auth real). Sidebar fica pro futuro.
 */
export function AdminHeader({ account = { name: 'Gustavo', email: 'gustavo@calcmed.com.br', initials: 'GU' } }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>C</span>
          <span className={styles.brandText}>
            CalcMed <span className={styles.brandSub}>Admin</span>
          </span>
        </div>
        <nav className={styles.nav} aria-label="Navegação do admin">
          <a className={`${styles.navItem} ${styles.navItemActive}`} aria-current="page">
            <Icon name="escores" size={18} />
            <span>Escores</span>
          </a>
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.account} title={account.email}>
          <span className={styles.avatar} aria-hidden="true">{account.initials}</span>
          <span className={styles.accountName}>{account.name}</span>
        </div>
        <Button variant="secondary" size="sm">Sair</Button>
      </div>
    </header>
  );
}
