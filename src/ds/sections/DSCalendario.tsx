import DSPanel from '../DSPanel'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const week1 = [
  { num: 23, other: true },
  { num: 24, other: true },
  { num: 25, other: true },
  { num: 26, other: true },
  { num: 27, other: true },
  { num: 28, other: true },
  { num: 1 },
]
const week2 = [
  { num: 2 },
  { num: 3, dots: ['var(--dom-urg)'] },
  { num: 4 },
  { num: 5, dots: ['var(--dom-dil)'] },
  { num: 6 },
  { num: 7 },
  { num: 8, dots: ['var(--dom-urg)', 'var(--dom-calc)'] },
]
const week3 = [
  { num: 9 },
  { num: 10 },
  { num: 11, dots: ['var(--dom-dil)'] },
  { num: 12, today: true },
  { num: 13 },
  { num: 14, dots: ['var(--dom-urg)'] },
  { num: 15 },
]

interface DayData {
  num: number
  other?: boolean
  today?: boolean
  dots?: string[]
}

function DayCell({ day }: { day: DayData }) {
  const cls = `day-cell${day.today ? ' today' : ''}${day.other ? ' other-month' : ''}`
  return (
    <div className={cls}>
      <span className="day-num">{day.num}</span>
      {day.dots && (
        <div className="flex" style={{ gap: 3, marginTop: 2 }}>
          {day.dots.map((c, i) => (
            <span className="day-dot" key={i} style={{ background: c }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DSCalendario() {
  return (
    <div>
      <h2 className="ds-section-title">Calendario e Escala</h2>
      <p className="ds-section-desc">
        Sistema de calendario para gerenciar plantoes medicos. O medico visualiza sua escala mensal com dots
        coloridos indicando diferentes hospitais. Projetado para simplicidade maxima — o medico consulta
        no corredor entre atendimentos, muitas vezes com uma mao so. Cada plantao e identificado por cor
        e acessivel com um unico toque.
      </p>

      {/* Calendar Nav */}
      <div className="ds-subsection">
        <h3>Navegacao de Mes</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Setas para navegar entre meses com o nome do mes centralizado. Touch targets de 48dp
          nas setas para facilitar o toque rapido.
        </p>
        <DSPanel>
          <div className="calendar-nav">
            <button className="nav-arrow"><i className="ph ph-caret-left" /></button>
            <span className="month-title">Marco 2026</span>
            <button className="nav-arrow"><i className="ph ph-caret-right" /></button>
          </div>
        </DSPanel>
      </div>

      {/* Mini Calendar */}
      <div className="ds-subsection">
        <h3>Grid do Calendario</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Grid de 7 colunas com cabecalho dos dias da semana. Dias do mes atual em cor primaria,
          dias de outros meses em cor terciaria. O dia atual recebe destaque circular com fundo primary.
          Dots coloridos abaixo do numero indicam plantoes agendados.
        </p>
        <DSPanel>
          <div className="calendar-grid">
            {weekDays.map(d => (
              <div className="day-header" key={d}>{d}</div>
            ))}
            {week1.map(d => <DayCell key={`w1-${d.num}`} day={d} />)}
            {week2.map(d => <DayCell key={`w2-${d.num}`} day={d} />)}
            {week3.map(d => <DayCell key={`w3-${d.num}`} day={d} />)}
          </div>
        </DSPanel>
      </div>

      {/* Legend */}
      <div className="ds-subsection">
        <h3>Legenda</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Mapeamento entre cores dos dots e hospitais/unidades de saude. Cada medico configura seus
          proprios locais de trabalho com cores distintas para identificacao rapida.
        </p>
        <DSPanel>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--dom-urg)' }} />
              <span>Hospital Sao Lucas</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--dom-dil)' }} />
              <span>UPA Central</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--dom-calc)' }} />
              <span>Hospital Municipal</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Shift Cards */}
      <div className="ds-subsection">
        <h3>Cards de Plantao</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Lista dos plantoes proximos com identificacao por cor, nome do hospital e horario.
          Exibidos abaixo do calendario ao selecionar um dia. O chevron indica que ha detalhes ao tocar.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="shift-card">
              <span className="shift-dot" style={{ background: 'var(--dom-urg)' }} />
              <div className="shift-info">
                <div className="shift-hospital">Hospital Sao Lucas</div>
                <div className="shift-time">Hoje, 19h - 07h</div>
              </div>
              <i className="ph ph-caret-right text-fg-3" />
            </div>
            <div className="shift-card">
              <span className="shift-dot" style={{ background: 'var(--dom-dil)' }} />
              <div className="shift-info">
                <div className="shift-hospital">UPA Central</div>
                <div className="shift-time">Amanha, 07h - 19h</div>
              </div>
              <i className="ph ph-caret-right text-fg-3" />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* FAB */}
      <div className="ds-subsection">
        <h3>Botao Flutuante (FAB)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Botao de acao principal da tela de escala para adicionar um novo plantao.
          Posicionado no canto inferior direito com sombra nivel 3.
        </p>
        <DSPanel>
          <div className="flex items-center gap-4">
            <button className="fab" style={{ position: 'relative' }}>
              <i className="ph ph-plus" style={{ fontSize: 24 }} />
            </button>
            <span className="t-corpo-2 text-fg-2">
              Adicionar novo plantao
            </span>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Referencia de classes para implementacao dos componentes de calendario e escala.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.calendar-nav', desc: 'Navegacao de mes: flex, space-between, alinhado ao centro' },
              { cls: '.calendar-grid', desc: 'Grid de 7 colunas para os dias do mes' },
              { cls: '.day-header', desc: 'Cabecalho dos dias da semana: font 600, uppercase, cor fg-3' },
              { cls: '.day-cell', desc: 'Celula do dia: flex column, center, altura minima 48px' },
              { cls: '.day-cell.today', desc: 'Dia atual: fundo primary, texto on-primary, formato circular' },
              { cls: '.day-cell.other-month', desc: 'Dia de outro mes: cor fg-3, opacidade reduzida' },
              { cls: '.day-dot', desc: 'Indicador de plantao: 6px, circulo colorido por hospital' },
              { cls: '.calendar-legend', desc: 'Legenda: flex wrap, gap 16px' },
              { cls: '.legend-item', desc: 'Item da legenda: flex, gap 8px, alinhado ao centro' },
              { cls: '.legend-dot', desc: 'Dot colorido da legenda: 10px, circulo' },
              { cls: '.shift-card', desc: 'Card de plantao: flex, radius xl, borda, padding' },
              { cls: '.fab', desc: 'Botao flutuante: 56px, circulo, fundo primary, sombra nivel 3' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
