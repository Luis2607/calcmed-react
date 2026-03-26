import type { ReactNode } from 'react'

interface DSPanelProps {
  /** T\u00edtulo opcional exibido acima dos pain\u00e9is Light/Dark */
  title?: string
  /** Conte\u00fado renderizado no painel Light (e no Dark, se darkChildren n\u00e3o for fornecido) */
  children: ReactNode
  /** Conte\u00fado alternativo para o painel Dark. Se omitido, replica children. */
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
