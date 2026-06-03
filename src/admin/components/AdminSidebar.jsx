import { Icon } from '../../shared/components/atoms/Icon';
import { Button } from '../../shared/components/atoms/Button';
import styles from './AdminSidebar.module.css';

/**
 * Sidebar do admin. Fase 1: 1 item de navegação ("Escores", ativo) + bloco da conta
 * e botão "Sair" no rodapé. Conta/Sair são visuais no protótipo (sem auth real).
 */
export function AdminSidebar({ account = { name: 'Gustavo', email: 'gustavo@calcmed.com.br', initials: 'GU' } }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>C</span>
        <span className={styles.brandText}>
          CalcMed
          <span className={styles.brandSub}>Admin</span>
        </span>
      </div>

      <nav className={styles.nav} aria-label="Navegação do admin">
        <a className={`${styles.navItem} ${styles.navItemActive}`} aria-current="page">
          <Icon name="escores" size={20} />
          <span>Escores</span>
        </a>
      </nav>

      <div className={styles.footer}>
        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">{account.initials}</span>
          <span className={styles.accountText}>
            <span className={styles.accountName}>{account.name}</span>
            <span className={styles.accountEmail}>{account.email}</span>
          </span>
        </div>
        <Button variant="secondary" size="md" className={styles.logout}>
          Sair
        </Button>
      </div>
    </aside>
  );
}
