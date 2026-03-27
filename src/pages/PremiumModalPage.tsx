import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import HomeHeader from '../components/layout/HomeHeader'
import Button from '../components/ui/Button'
import { CheckCircle } from '@phosphor-icons/react'

export default function PremiumModalPage() {
  const navigate = useNavigate()

  return (
    <MobileFrame className="relative">
      {/* HOME POR TRÁS (blur) */}
      <HomeHeader blur />
      <div className="screen-content flex-1 blur-bg-soft" />

      {/* OVERLAY + MODAL */}
      <div className="modal-overlay from-bottom">
        <div className="modal-premium-sheet">
          {/* Tag PREMIUM topo */}
          <div className="text-center p-5 pb-0">
            <span className="tag-status premium">PREMIUM</span>
          </div>

          {/* Badge funcionalidade */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="tag-abbr urg">DHE</span>
            <span className="t-corpo-2 text-fg-2">Dist. Hidroeletrolíticos</span>
          </div>

          {/* Título */}
          <div className="text-center p-5 pb-0">
            <h2 className="t-titulo-pagina">Sua degustação está acabando</h2>
          </div>

          {/* Destaque uso restante */}
          <div className="modal-usage-box">
            <div className="text-center">
              <div className="t-valor-grande">1</div>
              <div className="t-legenda text-fg-3">USO</div>
            </div>
            <div className="divider-v" />
            <div>
              <div className="t-corpo-2">Uso restante no seu acesso gratuito</div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="modal-benefits">
            <div className="modal-benefit-row">
              <CheckCircle size={24} weight="fill" className="modal-benefit-icon" />
              <div>
                <div className="t-alerta-titulo">Acesso ilimitado a DHE</div>
                <div className="t-legenda text-fg-3">Sem restrições nos cálculos clínicos.</div>
              </div>
            </div>

            <div className="modal-benefit-row">
              <CheckCircle size={24} weight="fill" className="modal-benefit-icon" />
              <div>
                <div className="t-alerta-titulo">Todas as funcionalidades premium</div>
                <div className="t-legenda text-fg-3">Intubação, DVA, Escores e mais.</div>
              </div>
            </div>

            <div className="modal-benefit-row">
              <CheckCircle size={24} weight="fill" className="modal-benefit-icon" />
              <div>
                <div className="t-alerta-titulo">Atualizações com evidências</div>
                <div className="t-legenda text-fg-3">Protocolos revisados conforme novas diretrizes.</div>
              </div>
            </div>
          </div>

          {/* Ancoragem */}
          <div className="text-center mt-4 p-5 pb-0">
            <p className="t-corpo-2 text-fg-2">
              Com o plano anual por apenas <strong className="t-valor-mono text-fg">R$ 0,41/DIA</strong>
            </p>
          </div>

          {/* Ações (3 níveis) */}
          <div className="modal-footer-col mt-4">
            <Button variant="primary" size="lg" href="/planos" fullWidth>
              Assinar agora - R$149,90/ano
            </Button>
            <Button variant="ghost" size="lg" fullWidth>
              Usar meu último acesso
            </Button>
            <Button variant="discrete" onClick={() => navigate(-1)}>
              Agora não
            </Button>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
