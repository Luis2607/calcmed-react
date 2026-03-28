import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import TabBar from '../components/layout/TabBar'
import BottomNav from '../components/layout/BottomNav'
import ShiftCard from '../components/cards/ShiftCard'
import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react'
import HomeHeader from '../components/layout/HomeHeader'

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

interface Shift {
  day: number
  hospital: string
  time: string
  color: string
}

interface MonthData {
  year: number
  month: number          // 0-indexed
  label: string          // "Março 2026"
  startDay: number       // weekday of 1st (0=Sun)
  totalDays: number
  shifts: Shift[]
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const WEEKDAY_HEADERS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function buildMonth(year: number, month: number): MonthData {
  const startDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  return {
    year,
    month,
    label: `${MONTH_NAMES[month]} ${year}`,
    startDay,
    totalDays,
    shifts: getShiftsForMonth(year, month),
  }
}

/** Static demo shifts -- only March 2026 has data */
function getShiftsForMonth(year: number, month: number): Shift[] {
  if (year === 2026 && month === 2) {
    return [
      { day: 5, hospital: 'Hospital São Lucas', time: '12h às 00h', color: 'var(--dom-dil)' },
      { day: 12, hospital: 'UPA Centro', time: '07h às 19h', color: 'var(--success)' },
      { day: 19, hospital: 'Hospital São Lucas', time: '12h às 00h', color: 'var(--dom-dil)' },
      { day: 26, hospital: 'Hospital Regional', time: '19h às 07h', color: 'var(--dom-calc)' },
    ]
  }
  return []
}

function getUpcomingShifts(data: MonthData) {
  const today = new Date()
  return data.shifts
    .filter(s => {
      const d = new Date(data.year, data.month, s.day)
      return d >= today
    })
    .sort((a, b) => a.day - b.day)
}

/* ------------------------------------------------------------------ */
/*  DayCell                                                            */
/* ------------------------------------------------------------------ */

interface DayProps {
  num: number | string
  today?: boolean
  otherMonth?: boolean
  dotColor?: string
  monthLabel?: string
  hasShift?: boolean
  onClick?: () => void
}

function DayCell({ num, today, otherMonth, dotColor, monthLabel = 'março', hasShift, onClick }: DayProps) {
  const [tapped, setTapped] = useState(false)
  const label = `${num} de ${monthLabel}`

  const handleClick = () => {
    if (hasShift) {
      setTapped(true)
      setTimeout(() => setTapped(false), 200)
    }
    onClick?.()
  }

  const classes = [
    'day-cell',
    today && 'today',
    otherMonth && 'other-month',
    tapped && 'day-cell-tapped',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} role="gridcell" aria-label={label} tabIndex={-1} onClick={handleClick}>
      <span className="day-num">{num}</span>
      {dotColor && <span className="day-dot" style={{ background: dotColor }} aria-hidden="true" />}
      {today && <span className="today-pulse-dot" aria-hidden="true" />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function EscalaCalendarioPage() {
  const [current, setCurrent] = useState(() => buildMonth(2026, 2))
  const [slideDir, setSlideDir] = useState<'none' | 'left' | 'right'>('none')
  const [expandedShift, setExpandedShift] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLAnchorElement>(null)

  // FAB scale-in on mount
  useEffect(() => {
    const fab = fabRef.current
    if (fab) {
      fab.classList.add('fab-enter')
    }
  }, [])

  const goMonth = useCallback((delta: number) => {
    setSlideDir(delta > 0 ? 'left' : 'right')
    setExpandedShift(null)
    setTimeout(() => {
      setCurrent(prev => {
        let m = prev.month + delta
        let y = prev.year
        if (m > 11) { m = 0; y++ }
        if (m < 0) { m = 11; y-- }
        return buildMonth(y, m)
      })
      setSlideDir('none')
    }, 200)
  }, [])

  const shiftMap = new Map<number, Shift>()
  current.shifts.forEach(s => shiftMap.set(s.day, s))

  // Next month name for trailing day labels
  const nextMonthIdx = current.month === 11 ? 0 : current.month + 1
  const nextMonthLabel = MONTH_NAMES[nextMonthIdx].toLowerCase()

  // Build calendar rows
  const rows: (null | { num: number; otherMonth?: boolean })[][] = []
  let row: (null | { num: number; otherMonth?: boolean })[] = []

  // Leading blanks
  for (let i = 0; i < current.startDay; i++) row.push(null)

  for (let d = 1; d <= current.totalDays; d++) {
    row.push({ num: d })
    if (row.length === 7) { rows.push(row); row = [] }
  }

  // Trailing days from next month
  if (row.length > 0) {
    let nextDay = 1
    while (row.length < 7) {
      row.push({ num: nextDay++, otherMonth: true })
    }
    rows.push(row)
  }

  const isToday = (day: number) => {
    const now = new Date()
    return now.getFullYear() === current.year && now.getMonth() === current.month && now.getDate() === day
  }

  const upcoming = getUpcomingShifts(current)
  const hasShifts = current.shifts.length > 0

  const slideClass = slideDir === 'left' ? 'calendar-slide-left' : slideDir === 'right' ? 'calendar-slide-right' : ''

  return (
    <MobileFrame className="relative">
      {/* HEADER */}
      <HomeHeader />

      <TabBar tabs={['Calendário', 'Histórico', 'Hospitais']} />

      <div className="screen-content flex-1 overflow-y-auto">
        <div className="escala-layout">
          <div className="escala-calendar-col">
            {/* Calendar nav */}
            <div className="calendar-nav">
              <button className="nav-arrow" aria-label="Mês anterior" onClick={() => goMonth(-1)}><CaretLeft size={20} /></button>
              <span className="month-title">{current.label}</span>
              <button className="nav-arrow" aria-label="Próximo mês" onClick={() => goMonth(1)}><CaretRight size={20} /></button>
            </div>

            {/* Calendar grid */}
            <div
              ref={gridRef}
              className={`calendar-grid ${slideClass}`}
              role="grid"
              aria-label="Calendário de plantões"
            >
              <div className="calendar-row" role="row">
                {WEEKDAY_HEADERS.map(d => (
                  <div key={d} className="day-header" role="columnheader">{d}</div>
                ))}
              </div>

              {rows.map((week, wi) => (
                <div key={wi} className="calendar-row" role="row">
                  {week.map((cell, ci) => {
                    if (!cell) return <div key={ci} className="day-cell" role="gridcell" />
                    const shift = !cell.otherMonth ? shiftMap.get(cell.num) : undefined
                    return (
                      <DayCell
                        key={ci}
                        num={cell.num}
                        today={!cell.otherMonth && isToday(cell.num)}
                        otherMonth={cell.otherMonth}
                        dotColor={shift?.color}
                        hasShift={!!shift}
                        monthLabel={cell.otherMonth ? nextMonthLabel : MONTH_NAMES[current.month].toLowerCase()}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Empty state */}
            {!hasShifts && (
              <div className="calendar-empty-state" role="status">
                Nenhum plantão neste mês
              </div>
            )}

            {/* Legenda -- only show when there are shifts */}
            {hasShifts && (
              <div className="calendar-legend" role="list" aria-label="Legenda de hospitais">
                <div className="legend-item" role="listitem">
                  <span className="legend-dot" style={{ background: 'var(--dom-dil)' }} aria-hidden="true" />Hospital São Lucas
                </div>
                <div className="legend-item" role="listitem">
                  <span className="legend-dot" style={{ background: 'var(--success)' }} aria-hidden="true" />UPA Centro
                </div>
                <div className="legend-item" role="listitem">
                  <span className="legend-dot" style={{ background: 'var(--dom-calc)' }} aria-hidden="true" />Hospital Regional
                </div>
              </div>
            )}
          </div>

          {/* Próximos plantões */}
          <div className="escala-shifts-col">
            <div className="t-texto-badge text-fg-3 uppercase tracking-wide mb-3">Próximos plantões</div>
            <div className="flex flex-col gap-3">
              {upcoming.length > 0 ? (
                upcoming.map((s, i) => (
                  <ShiftCard
                    key={i}
                    hospital={s.hospital}
                    date={`${String(s.day).padStart(2, '0')} ${MONTH_NAMES[current.month].substring(0, 3)}`}
                    time={s.time}
                    color={s.color}
                    expanded={expandedShift === i}
                    onTap={() => setExpandedShift(expandedShift === i ? null : i)}
                  />
                ))
              ) : (
                <div className="calendar-empty-state min-h-80" role="status">
                  Nenhum plantão neste mês
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link
        ref={fabRef}
        to="/escala/novo"
        className="fab"
        aria-label="Adicionar plantão"
      >
        <Plus size={24} weight="bold" />
      </Link>

      <BottomNav />
    </MobileFrame>
  )
}
