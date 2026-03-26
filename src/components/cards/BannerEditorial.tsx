interface Props {
  tag: string
  title: string
  description: string
}

export default function BannerEditorial({ tag, title, description }: Props) {
  return (
    <div className="banner-editorial mb-6">
      <div className="banner-tag">{tag}</div>
      <div className="banner-title">{title}</div>
      <div className="banner-desc">{description}</div>
    </div>
  )
}
