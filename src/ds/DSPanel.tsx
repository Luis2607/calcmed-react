import type { ReactNode } from 'react'

interface DSPanelProps {
  title?: string
  children: ReactNode
  darkChildren?: ReactNode
}

export default function DSPanel({ title, children, darkChildren }: DSPanelProps) {
  return (
    <>
      {title && (
        <h4 style={{ font: "600 14px/20px 'Inter'", color: 'var(--fg-2)', marginBottom: 12 }}>
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
