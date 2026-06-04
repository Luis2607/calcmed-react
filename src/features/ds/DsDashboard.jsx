import { useEffect, useState } from 'react';
import styles from './DsDashboard.module.css';

// Importar as galerias de QA existentes
import { ColorGallery } from './ColorGallery';
import { TypographyGallery } from './TypographyGallery';
import { SpacingGallery } from './SpacingGallery';
import { IconsGallery } from './IconsGallery';
import { ButtonsGallery } from './ButtonsGallery';
import { InputGallery } from './InputGallery';
import { ControlsGallery } from './ControlsGallery';
import { AlertGallery } from './AlertGallery';
import { TagsGallery } from './TagsGallery';
import { ClinicalGallery } from './ClinicalGallery';
import { UrgencyGallery } from './UrgencyGallery';
import { SheetGallery } from './SheetGallery';
import { AiResponseSystemGallery } from './AiResponseSystemGallery';

const CATEGORIES = [
  { id: 'colors', label: 'Cores semanticas', icon: '🎨' },
  { id: 'typography', label: 'Escala tipografica', icon: '✍️' },
  { id: 'spacing', label: 'Espacamentos e Radius', icon: '📏' },
  { id: 'icons', label: 'Biblioteca de Icones', icon: '🧩' },
  { id: 'buttons', label: 'Botoes do Sistema', icon: '🔘' },
  { id: 'inputs', label: 'Campos de Entrada', icon: '⌨️' },
  { id: 'controles', label: 'Controles de Seleção', icon: '☑️' },
  { id: 'alertas', label: 'Alertas (Alert Card)', icon: '🚨' },
  { id: 'tags', label: 'Tags e Chips', icon: '🏷️' },
  { id: 'clinicos', label: 'Componentes Clínicos', icon: '🩺' },
  { id: 'urgencia', label: 'Central de Urgência (kit)', icon: '🚑' },
  { id: 'bottomsheets', label: 'Bottom Sheets (QA)', icon: '📋' },
  { id: 'ia-respostas', label: 'IA · Sistema de Respostas', icon: '🤖' }
];

export function DsDashboard({ onExit }) {
  const [activeTab, setActiveTab] = useState('colors');

  // Sincronizar a aba ativa com o parâmetro 'qa' da URL na inicialização e mudanças
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const qaValue = params.get('qa');
      if (qaValue && CATEGORIES.some(c => c.id === qaValue)) {
        setActiveTab(qaValue);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Atualizar a URL sem forçar refresh da página
    const url = new URL(window.location.href);
    url.searchParams.set('qa', tabId);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className={styles.dashboard}>
      {onExit && (
        <button
          type="button"
          className="app-mode-switch app-mode-switch--right"
          onClick={onExit}
          aria-label="Ir para o protótipo"
          title="Ir para o protótipo"
        >
          ⇄
        </button>
      )}
      {/* Sidebar na esquerda */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandIcon}>🏆</div>
          <div className={styles.brandText}>
            <h2>CalcMed</h2>
            <span>DESIGN SYSTEM</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <span className={styles.menuLabel}>Fundacoes DS</span>
          <ul className={styles.menuList}>
            {CATEGORIES.map((category) => {
              const isActive = activeTab === category.id;
              return (
                <li key={category.id}>
                  <button
                    className={`${styles.navButton} ${isActive ? styles.active : ''}`}
                    onClick={() => handleTabChange(category.id)}
                  >
                    <span className={styles.icon}>{category.icon}</span>
                    <span className={styles.label}>{category.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className={styles.sidebarFooter}>
          <div className={styles.devBadge}>Modo Administrador</div>
          <span className={styles.versionLabel}>DS v6.5 · 2026</span>
        </footer>
      </aside>

      {/* Conteúdo principal na direita */}
      <main className={styles.content}>
        <div className={styles.scrollArea}>
          {activeTab === 'colors' && <ColorGallery />}
          {activeTab === 'typography' && <TypographyGallery />}
          {activeTab === 'spacing' && <SpacingGallery />}
          {activeTab === 'icons' && <IconsGallery />}
          {activeTab === 'buttons' && <ButtonsGallery />}
          {activeTab === 'inputs' && <InputGallery />}
          {activeTab === 'controles' && <ControlsGallery />}
          {activeTab === 'alertas' && <AlertGallery />}
          {activeTab === 'tags' && <TagsGallery />}
          {activeTab === 'clinicos' && <ClinicalGallery />}
          {activeTab === 'urgencia' && <UrgencyGallery />}
          {activeTab === 'bottomsheets' && <SheetGallery />}
          {activeTab === 'ia-respostas' && <AiResponseSystemGallery />}
        </div>
      </main>
    </div>
  );
}
