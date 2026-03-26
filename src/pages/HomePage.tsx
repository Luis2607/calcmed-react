import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'

export default function HomePage() {
  return (
    <MobileFrame>
      <div className="home-header">
        <div className="avatar avatar-sm avatar-teal">RF</div>
        <div className="flex-1">
          <div className="t-legenda text-fg-3">Bom dia,</div>
          <div className="t-alerta-titulo">Dr. Rafael</div>
        </div>
        <a href="/notificacoes" className="notif-wrap">
          <i className="ph ph-bell icon-lg text-fg-3" />
          <div className="notif-dot" />
        </a>
      </div>

      <div className="screen-content flex-1 overflow-y-auto p-5 pb-8">
        <div className="text-center p-8">
          <div className="t-titulo-pagina">Home em construção</div>
          <p className="t-corpo-2 text-fg-3 mt-2">Migração React em andamento. Navegue pelo fluxo de login pra testar.</p>
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
