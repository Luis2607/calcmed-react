import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { FileText, ShieldCheck } from '@phosphor-icons/react'

export default function SobrePage() {
  return (
    <MobileFrame>
      <PageHeader title="Sobre" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <div className="sobre-container">
          {/* Logo and version */}
          <div className="sobre-hero">
            <img src="/assets/Icone.svg" width={80} height={80} alt="CalcMed" className="sobre-logo-img" />
            <div className="t-marca" style={{ fontSize: 28 }}>Calc<span className="dot">.</span>Med</div>
            <div className="brand-sub mt-1">Urgência e Emergência</div>
            <div className="t-legenda text-fg-3 mt-2">Versão 1.0.0</div>
          </div>

          {/* Description */}
          <div className="sobre-description">
            <p className="t-corpo-2 text-fg-2 text-center">
              Desenvolvido por médicos de Urgência e Emergência para auxiliar no cálculo rápido de doses, escores e protocolos clínicos.
            </p>
          </div>

          {/* Links */}
          <div className="sobre-links">
            <a href="#" className="sobre-link">
              <FileText size={20} className="text-fg-3" />
              <span className="t-corpo-2">Termos de Uso</span>
            </a>
            <a href="#" className="sobre-link">
              <ShieldCheck size={20} className="text-fg-3" />
              <span className="t-corpo-2">Política de Privacidade</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="t-legenda text-fg-3 text-center mt-6">
            &copy; {new Date().getFullYear()} CalcMed &middot; Todos os direitos reservados
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
