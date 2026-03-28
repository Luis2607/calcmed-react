interface Props {
  title: string
  action?: { label: string; onClick?: () => void }
}

export default function SectionHeader({ title, action }: Props) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action && (
        <button
          className="section-header-action"
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
