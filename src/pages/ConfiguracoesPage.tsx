import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, DeviceMobile, Bell, WifiHigh, Globe, Info } from '@phosphor-icons/react'
import { useState } from 'react'

type ThemeOption = 'light' | 'dark' | 'auto'

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [notificacoes, setNotificacoes] = useState(true)
  const [offline, setOffline] = useState(false)

  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
    { value: 'auto', label: 'Auto', icon: <DeviceMobile size={16} /> },
  ]

  return (
    <MobileFrame>
      <PageHeader title="Configuracoes" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Tema */}
        <div className="config-section">
          <div className="config-section-label t-legenda text-fg-3 mb-3">Aparencia</div>
          <div className="config-card">
            <div className="config-item">
              <div className="config-item-left">
                <Sun size={20} className="text-fg-3" />
                <span className="config-item-label">Tema</span>
              </div>
              <div className="config-theme-toggle">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`config-theme-btn ${theme === opt.value ? 'active' : ''}`}
                    onClick={() => setTheme(opt.value)}
                    aria-pressed={theme === opt.value}
                    aria-label={`Tema ${opt.label}`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Geral */}
        <div className="config-section">
          <div className="config-section-label t-legenda text-fg-3 mb-3">Geral</div>
          <div className="config-card">
            <div className="config-item">
              <div className="config-item-left">
                <Bell size={20} className="text-fg-3" />
                <span className="config-item-label">Notificacoes</span>
              </div>
              <button
                className={`config-toggle ${notificacoes ? 'active' : ''}`}
                onClick={() => setNotificacoes(!notificacoes)}
                role="switch"
                aria-checked={notificacoes}
                aria-label="Ativar notificacoes"
              >
                <div className="config-toggle-thumb" />
              </button>
            </div>

            <div className="config-divider" />

            <div className="config-item">
              <div className="config-item-left">
                <WifiHigh size={20} className="text-fg-3" />
                <span className="config-item-label">Modo offline</span>
              </div>
              <button
                className={`config-toggle ${offline ? 'active' : ''}`}
                onClick={() => setOffline(!offline)}
                role="switch"
                aria-checked={offline}
                aria-label="Ativar modo offline"
              >
                <div className="config-toggle-thumb" />
              </button>
            </div>

            <div className="config-divider" />

            <div className="config-item">
              <div className="config-item-left">
                <Globe size={20} className="text-fg-3" />
                <span className="config-item-label">Idioma</span>
              </div>
              <span className="config-item-value text-fg-3">Portugues</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="config-section">
          <div className="config-section-label t-legenda text-fg-3 mb-3">Informacoes</div>
          <div className="config-card">
            <div className="config-item">
              <div className="config-item-left">
                <Info size={20} className="text-fg-3" />
                <span className="config-item-label">Versao</span>
              </div>
              <span className="config-item-value text-fg-3 font-mono">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
