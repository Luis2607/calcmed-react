interface Props {
  title: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export default function SectionHeader({ title, action }: Props) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {action && (
        <a href={action.href || '#'} onClick={action.onClick}>{action.label}</a>
      )}
    </div>
  )
}
