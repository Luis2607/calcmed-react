import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import AlertCard from '../components/ui/AlertCard'
import Chip from '../components/ui/Chip'
import Button from '../components/ui/Button'

export default function CalculadoraResultadoPage() {
  return (
    <MobileFrame>
      <PageHeader
        title="Clearance de Creatinina"
        backTo="/calculadora/crcl"
        trailing={<span className="tag-domain calc">Calculadoras</span>}
      />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Resumo dos inputs */}
        <div className="flex flex-wrap gap-3 mb-5">
          <Chip label="65 anos" />
          <Chip label="70 kg" />
          <Chip label="Cr 1,2 mg/dL" />
          <Chip label="Masculino" />
        </div>

        {/* RESULTADO (PROTAGONISTA) */}
        <AlertCard level="result" className="mb-4">
          <div className="alert-content text-center">
            <div className="t-dose-valor">72,5<span className="t-dose-unidade ml-2">mL/min</span></div>
            <div className="tag-status mt-2">Estágio 2 - Redução leve</div>
          </div>
        </AlertCard>

        {/* INFO */}
        <AlertCard level="info" icon="info" title="Fórmula aplicada" className="mb-3">
          Cockcroft-Gault. Resultado ajustado para sexo e idade do paciente.
        </AlertCard>

        {/* WARNING */}
        <AlertCard level="warning" icon="warning" title="Atenção" className="mb-3">
          Paciente &gt;65 anos: considerar ajuste de dose em medicações nefrotóxicas.
        </AlertCard>

        {/* FOOTNOTE */}
        <AlertCard level="footnote" icon="book-open" title="Ref: Cockcroft & Gault, 1976. Nephron 16(1):31-41." className="mb-6" />

        {/* Sugestões relacionadas */}
        <div className="t-legenda text-fg-3 mb-2">Médicos que usam CrCl também usam:</div>
        <div className="flex gap-2 mb-5">
          <Chip label="IRA KDIGO" domain="calc" />
          <Chip label="Osmolaridade" domain="calc" />
        </div>

        {/* Recalcular */}
        <Button variant="ghost" size="lg" href="/calculadora/crcl" fullWidth>Recalcular</Button>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
