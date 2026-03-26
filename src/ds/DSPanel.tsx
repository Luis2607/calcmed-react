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
        <h4 className="t-corpo-2 text-fg-2 mb-3" style={{ fontWeight: 600 }}>
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
