import { Link } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import TabBar from '../components/layout/TabBar'
import BottomNav from '../components/layout/BottomNav'
import ShiftCard from '../components/cards/ShiftCard'
import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react'

interface DayProps {
  num: number | string
  today?: boolean
  otherMonth?: boolean
  dotColor?: string
}

function DayCell({ num, today, otherMonth, dotColor }: DayProps) {
  const classes = ['day-cell', today && 'today', otherMonth && 'other-month'].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      <span className="day-num">{num}</span>
      {dotColor && <span className="day-dot" style={{ background: dotColor }} />}
    </div>
  )
}

export default function EscalaCalendarioPage() {
  return (
    <MobileFrame className="relative">
      {/* HEADER */}
      <div className="home-header">
        <div className="t-alerta-titulo flex-1">Minha Escala</div>
      </div>

      <TabBar tabs={['Calendário', 'Histórico', 'Hospitais']} />

      <div className="screen-content flex-1 overflow-y-auto">
        {/* Calendar nav */}
        <div className="calendar-nav">
          <button className="nav-arrow"><CaretLeft size={16} /></button>
          <span className="month-title">Março 2026</span>
          <button className="nav-arrow"><CaretRight size={16} /></button>
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="day-header">{d}</div>
          ))}

          {/* Semana 1 */}
          <DayCell num={1} />
          <DayCell num={2} />
          <DayCell num={3} />
          <DayCell num={4} />
          <DayCell num={5} dotColor="var(--dom-dil)" />
          <DayCell num={6} />
          <DayCell num={7} />

          {/* Semana 2 */}
          <DayCell num={8} />
          <DayCell num={9} />
          <DayCell num={10} />
          <DayCell num={11} />
          <DayCell num={12} dotColor="var(--success)" />
          <DayCell num={13} />
          <DayCell num={14} />

          {/* Semana 3 */}
          <DayCell num={15} />
          <DayCell num={16} />
          <DayCell num={17} />
          <DayCell num={18} />
          <DayCell num={19} dotColor="var(--dom-dil)" />
          <DayCell num={20} />
          <DayCell num={21} />

          {/* Semana 4 */}
          <DayCell num={22} />
          <DayCell num={23} />
          <DayCell num={24} />
          <DayCell num={25} today />
          <DayCell num={26} dotColor="var(--dom-calc)" />
          <DayCell num={27} />
          <DayCell num={28} />

          {/* Semana 5 */}
          <DayCell num={29} />
          <DayCell num={30} />
          <DayCell num={31} />
          <DayCell num={1} otherMonth />
          <DayCell num={2} otherMonth />
          <DayCell num={3} otherMonth />
          <DayCell num={4} otherMonth />
        </div>

        {/* Legenda */}
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--dom-dil)' }} />Hospital São Lucas
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--success)' }} />UPA Centro
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--dom-calc)' }} />Hospital Regional
          </div>
        </div>

        {/* Próximos plantões */}
        <div className="p-5 flex flex-col gap-3">
          <div className="t-texto-badge text-fg-3 uppercase tracking-wide mb-1">Próximos plantões</div>
          <ShiftCard
            hospital="Hospital Regional"
            date="26 Mar"
            time="19h às 07h"
            color="var(--dom-calc)"
          />
          <ShiftCard
            hospital="Hospital São Lucas"
            date="02 Abr"
            time="12h às 00h"
            color="var(--dom-dil)"
          />
        </div>
      </div>

      {/* FAB */}
      <Link to="/escala/novo" className="fab"><Plus size={24} /></Link>

      <BottomNav />
    </MobileFrame>
  )
}
