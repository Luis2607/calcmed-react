import type { KeyboardEvent } from 'react'
import { BookmarkSimple } from '@phosphor-icons/react'

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
  const isPremiumLocked = status === 'premium'
  const isTeste = status === 'teste'
  const stateClass = isPremiumLocked ? 'locked' : isTeste ? 'trial' : ''

  // Locked cards navigate to premium modal
  const resolvedHref = isPremiumLocked ? (href ?? '/premium') : href

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  const sharedProps = {
    className: `card-feature ${stateClass} ${className}`,
    onClick,
    'aria-label': `${name}${isPremiumLocked ? ' (Premium)' : ''}${isTeste ? ' (Teste)' : ''}`,
  }

  const content = (
    <>
      {/* Tag status — absolute top-left via CSS */}
      {isPremiumLocked && <span className="tag-status premium">PREMIUM</span>}
      {isTeste && <span className="tag-status teste">TESTE</span>}

      {/* Bookmark — absolute top-right via CSS */}
      {onBookmark !== undefined && (
        <button
          className={`feat-bookmark ${bookmarked ? 'saved' : ''}`}
          onClick={e => { e.stopPropagation(); e.preventDefault(); onBookmark?.() }}
          aria-label={bookmarked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <BookmarkSimple size={18} weight={bookmarked ? 'fill' : 'regular'} />
        </button>
      )}

      {/* Content — centered */}
      <span className={`tag-abbr ${domain}`}>{abbr}</span>
      <span className="feat-name">{name}</span>

      {/* Trial remaining badge below name */}
      {isTeste && trialRemaining && (
        <span className="tag-status teste">{trialRemaining}</span>
      )}
    </>
  )

  if (resolvedHref) {
    return <a {...sharedProps} href={resolvedHref}>{content}</a>
  }

  return (
    <div
      {...sharedProps}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {content}
    </div>
  )
}
