import { BookmarkSimple, Lock } from '@phosphor-icons/react'

type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
type Status = 'free' | 'premium' | 'teste' | 'assinante'

interface Props {
  abbr: string
  domain: Domain
  name: string
  status?: Status
  trialRemaining?: string
  bookmarked?: boolean
  onBookmark?: () => void
  onClick?: () => void
  href?: string
  className?: string
}

export default function CardFeature({ abbr, domain, name, status = 'free', trialRemaining, bookmarked, onBookmark, onClick, href, className = '' }: Props) {
  const Tag = href ? 'a' : 'div'
  const isPremiumLocked = status === 'premium'
  const isTeste = status === 'teste'
  const stateClass = isPremiumLocked ? 'locked' : isTeste ? 'trial' : ''

  return (
    <Tag className={`card-feature ${stateClass} ${className}`} onClick={onClick} href={href}>
      <span className={`tag-abbr ${domain}`}>{abbr}</span>
      <span className="feat-name">{name}</span>

      {/* free: no tag, no lock, no badge */}
      {/* assinante: no tag, no lock, no badge — cleanest experience */}

      {isPremiumLocked && (
        <>
          <span className="tag-status premium mt-1">PREMIUM</span>
          <Lock size={16} weight="fill" className="feat-lock" />
        </>
      )}

      {isTeste && (
        <>
          <span className="tag-status premium mt-1">PREMIUM</span>
          {trialRemaining && (
            <span className="tag-status teste mt-1">{trialRemaining}</span>
          )}
        </>
      )}

      {onBookmark !== undefined && (
        <BookmarkSimple
          size={18}
          weight={bookmarked ? 'fill' : 'regular'}
          className={`feat-bookmark ${bookmarked ? 'saved' : ''}`}
          onClick={e => { e.stopPropagation(); e.preventDefault(); onBookmark?.() }}
        />
      )}
    </Tag>
  )
}
