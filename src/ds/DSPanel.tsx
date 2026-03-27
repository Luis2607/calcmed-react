import type { ReactNode } from 'react'

interface DSPanelProps {
  /** Título opcional exibido acima dos painéis Light/Dark */
  title?: string
  /** Conteúdo renderizado no painel Light (e no Dark, se darkChildren não for fornecido) */
  children: ReactNode
  /** Conteúdo alternativo para o painel Dark. Se omitido, replica children. */
  darkChildren?: ReactNode
}

export default function DSPanel({ title, children, darkChildren }: DSPanelProps) {
  return (
    <>
      {title && (
        <h4 className="t-rotulo-campo text-fg-2 mb-3">
          {title}
        </h4>
      )}
      <div className="ds-dual">
        <div className="ds-panel light">
          <div className="ds-mode-label">Light</div>
          <div className="light">{children}</div>
        </div>
        <div className="ds-panel dark">
          <div className="ds-mode-label">Dark</div>
          <div className="dark">{darkChildren ?? children}</div>
        </div>
      </div>
    </>
  )
}
