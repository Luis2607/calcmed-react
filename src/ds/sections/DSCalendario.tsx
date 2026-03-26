import DSPanel from '../DSPanel'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

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
      <h2 className="ds-section-title">Calendário e Escala</h2>
      <p className="ds-section-desc">
        Sistema de calendário para gerenciar plantões médicos. O médico visualiza sua escala mensal com dots
        coloridos indicando diferentes hospitais. Projetado para simplicidade máxima — o médico consulta
        no corredor entre atendimentos, muitas vezes com uma mão só. Cada plantão é identificado por cor
        e acessível com um único toque.
      </p>

      {/* Calendar Nav */}
      <div className="ds-subsection">
        <h3>Navegação de Mês</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Setas para navegar entre meses com o nome do mês centralizado. Touch targets de 48dp
          nas setas para facilitar o toque rápido.
        </p>
        <DSPanel>
          <div className="calendar-nav">
            <button className="nav-arrow"><i className="ph ph-caret-left" /></button>
            <span className="month-title">Março 2026</span>
            <button className="nav-arrow"><i className="ph ph-caret-right" /></button>
          </div>
        </DSPanel>
      </div>

      {/* Mini Calendar */}
      <div className="ds-subsection">
        <h3>Grid do Calendário</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Grid de 7 colunas com cabeçalho dos dias da semana. Dias do mês atual em cor primária,
          dias de outros meses em cor terciária. O dia atual recebe destaque circular com fundo primary.
          Dots coloridos abaixo do número indicam plantões agendados.
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
          Mapeamento entre cores dos dots e hospitais/unidades de saúde. Cada médico configura seus
          próprios locais de trabalho com cores distintas para identificação rápida.
        </p>
        <DSPanel>
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--dom-urg)' }} />
              <span>Hospital São Lucas</span>
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
        <h3>Cards de Plantão</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Lista dos plantões próximos com identificação por cor, nome do hospital e horário.
          Exibidos abaixo do calendário ao selecionar um dia. O chevron indica que há detalhes ao tocar.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="shift-card">
              <span className="shift-dot" style={{ background: 'var(--dom-urg)' }} />
              <div className="shift-info">
                <div className="shift-hospital">Hospital São Lucas</div>
                <div className="shift-time">Hoje, 19h - 07h</div>
              </div>
              <i className="ph ph-caret-right text-fg-3" />
            </div>
            <div className="shift-card">
              <span className="shift-dot" style={{ background: 'var(--dom-dil)' }} />
              <div className="shift-info">
                <div className="shift-hospital">UPA Central</div>
                <div className="shift-time">Amanhã, 07h - 19h</div>
              </div>
              <i className="ph ph-caret-right text-fg-3" />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* FAB */}
      <div className="ds-subsection">
        <h3>Botão Flutuante (FAB)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Botão de ação principal da tela de escala para adicionar um novo plantão.
          Posicionado no canto inferior direito com sombra nível 3.
        </p>
        <DSPanel>
          <div className="flex items-center gap-4">
            <button className="fab" style={{ position: 'relative' }}>
              <i className="ph ph-plus" style={{ fontSize: 24 }} />
            </button>
            <span className="t-corpo-2 text-fg-2">
              Adicionar novo plantão
            </span>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Referência de classes para implementação dos componentes de calendário e escala.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.calendar-nav', desc: 'Navegação de mês: flex, space-between, alinhado ao centro' },
              { cls: '.calendar-grid', desc: 'Grid de 7 colunas para os dias do mês' },
              { cls: '.day-header', desc: 'Cabeçalho dos dias da semana: font 600, uppercase, cor fg-3' },
              { cls: '.day-cell', desc: 'Célula do dia: flex column, center, altura mínima 48px' },
              { cls: '.day-cell.today', desc: 'Dia atual: fundo primary, texto on-primary, formato circular' },
              { cls: '.day-cell.other-month', desc: 'Dia de outro mês: cor fg-3, opacidade reduzida' },
              { cls: '.day-dot', desc: 'Indicador de plantão: 6px, círculo colorido por hospital' },
              { cls: '.calendar-legend', desc: 'Legenda: flex wrap, gap 16px' },
              { cls: '.legend-item', desc: 'Item da legenda: flex, gap 8px, alinhado ao centro' },
              { cls: '.legend-dot', desc: 'Dot colorido da legenda: 10px, círculo' },
              { cls: '.shift-card', desc: 'Card de plantão: flex, radius xl, borda, padding' },
              { cls: '.fab', desc: 'Botão flutuante: 56px, círculo, fundo primary, sombra nível 3' },
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
