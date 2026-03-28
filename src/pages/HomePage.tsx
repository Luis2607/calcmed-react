import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookmarkSimple } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import HomeHeader from '../components/layout/HomeHeader'
import SubheaderBar from '../components/layout/SubheaderBar'
import BottomNav from '../components/layout/BottomNav'
import BannerEditorial from '../components/cards/BannerEditorial'
import CardFeature from '../components/cards/CardFeature'
import CardRecent from '../components/cards/CardRecent'
import CategoryCollapse from '../components/cards/CategoryCollapse'
import SectionHeader from '../components/ui/SectionHeader'
import AlertCard from '../components/ui/AlertCard'
import { useLayout } from '../contexts/LayoutContext'
import { favorites, recents, categories } from '../data/homeData'

/* ── Skeleton sub-components ── */
function SkeletonFavCards() {
  return (
    <div className="fav-scroll mb-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton skeleton-card skeleton-card-sm" />
      ))}
    </div>
  )
}

function SkeletonRecents() {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="skeleton skeleton-text w-100" />
      <div className="skeleton skeleton-text w-80" />
    </div>
  )
}

function SkeletonCategories() {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton skeleton-row" />
      ))}
    </div>
  )
}

/* ── Empty state for "Meu Plantao" ── */
function EmptyFavorites() {
  return (
    <div className="empty-state empty-state-compact">
      <BookmarkSimple size={32} className="text-accent opacity-75 mb-3" />
      <p className="empty-title">
        Adicione seus favoritos
      </p>
      <p className="empty-desc">
        Toque no icone de salvar em qualquer ferramenta
      </p>
    </div>
  )
}

export default function HomePage() {
  const location = useLocation()
  const isTrial = location.pathname.includes('/trial')
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['IOT', 'DVA', 'CrCl', 'VM']))
  const [mode, setMode] = useState<'adulto' | 'ped'>('adulto')
  const [loading, setLoading] = useState(true)
  const { layoutMode } = useLayout()
  const isWeb = layoutMode === 'web'

  // Simulate skeleton loading (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const bannerTitle = mode === 'adulto'
    ? 'Cetoacidose Diabetica atualizada: novo protocolo 2026'
    : 'Dose pediatrica: novos protocolos 2026'

  const handleModeChange = (index: number) => {
    setMode(index === 0 ? 'adulto' : 'ped')
  }

  const toggleBookmark = (abbr: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(abbr) ? next.delete(abbr) : next.add(abbr)
      return next
    })
  }

  // Filter favorites to only bookmarked ones
  const activeFavorites = favorites.filter(f => bookmarks.has(f.abbr))
  const hasBookmarks = activeFavorites.length > 0
  const hasRecents = recents.length > 0

  /* ── Skeleton state ── */
  if (loading) {
    return (
      <MobileFrame>
        <HomeHeader />
        <SubheaderBar tabs={['Adulto', 'Ped']} onChange={handleModeChange} />
        <div className="screen-content flex-1 overflow-y-auto p-5 pb-8">
          {isWeb ? (
            <div className="home-content-grid">
              <div className="home-main-col">
                <div className="skeleton skeleton-banner" />
                <SkeletonCategories />
              </div>
              <aside className="home-aside-col">
                <div className="skeleton skeleton-text w-60 skeleton-text-mb4" />
                <SkeletonFavCards />
                <div className="skeleton skeleton-text w-60 skeleton-text-mb4" />
                <SkeletonRecents />
              </aside>
            </div>
          ) : (
            <>
              <div className="skeleton skeleton-banner-sm" />
              <div className="skeleton skeleton-text w-60 skeleton-text-mb4" />
              <SkeletonFavCards />
              <div className="skeleton skeleton-text w-60 skeleton-text-mb4" />
              <SkeletonRecents />
              <SkeletonCategories />
            </>
          )}
        </div>
        <BottomNav />
      </MobileFrame>
    )
  }

  /* ── Loaded state ── */
  return (
    <MobileFrame>
      <HomeHeader />
      <SubheaderBar tabs={['Adulto', 'Ped']} onChange={handleModeChange} />

      <div className="screen-content flex-1 overflow-y-auto p-5 pb-8">
        {isWeb ? (
          <>
            {/* Banner full-width above grid */}
            {isTrial && (
              <AlertCard level="warning" icon="warning" title="Modo teste" className="mb-4">
                Você tem <strong>3 usos gratuitos</strong> restantes em funcionalidades premium.{' '}
                <Link to="/planos" className="btn-text">Assinar agora</Link>
              </AlertCard>
            )}
            <BannerEditorial
              tag="Novidade"
              title={bannerTitle}
              description="Veja as mudanças e atualize sua prática clínica."
              className="mb-6"
            />

            <div className="home-content-grid">
              {/* LEFT COLUMN: Categories */}
              <div className="home-main-col">

              {categories.map((cat, i) => (
                <CategoryCollapse
                  key={cat.name}
                  icon={cat.icon}
                  domain={cat.domain}
                  name={cat.name}
                  count={cat.count}
                  defaultOpen={i < 3}
                >
                  {cat.items.map(item => (
                    <CardFeature
                      key={item.abbr + item.name}
                      abbr={item.abbr}
                      domain={item.domain}
                      name={item.name}
                      status={item.status}
                      bookmarked={bookmarks.has(item.abbr)}
                      onBookmark={() => toggleBookmark(item.abbr)}
                      href={item.status === 'premium' ? '/premium' : undefined}
                    />
                  ))}
                </CategoryCollapse>
              ))}
            </div>

            {/* RIGHT COLUMN: Meu Plantao + Recents in sticky containers */}
            <aside className="home-aside-col">
              {/* Container: Meu Plantão */}
              <div className="aside-card">
                <SectionHeader title="Meu Plantão" action={{ label: 'Editar' }} />
                {hasBookmarks ? (
                  <div className="aside-card-list">
                    {favorites.map(f => (
                      <CardFeature
                        key={f.abbr}
                        abbr={f.abbr}
                        domain={f.domain}
                        name={f.name}
                        status={f.status}
                        bookmarked={bookmarks.has(f.abbr)}
                        onBookmark={() => toggleBookmark(f.abbr)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyFavorites />
                )}
              </div>

              {/* Container: Últimas utilizadas */}
              {hasRecents && (
                <div className="aside-card">
                  <SectionHeader title="Últimas utilizadas" />
                  <div className="aside-card-list">
                    {recents.map(r => <CardRecent key={r.name} name={r.name} time={r.time} />)}
                  </div>
                </div>
              )}
              </aside>
            </div>
          </>
        ) : (
          <>
            {isTrial && (
              <AlertCard level="warning" icon="warning" title="Modo teste" className="mb-4">
                Voce tem <strong>3 usos gratuitos</strong> restantes em funcionalidades premium.{' '}
                <Link to="/planos" className="btn-text">Assinar agora</Link>
              </AlertCard>
            )}
            <BannerEditorial
              tag="Novidade"
              title={bannerTitle}
              description="Veja as mudancas e atualize sua pratica clinica."
              className="mb-6"
            />

            <SectionHeader title="Meu Plantao" action={{ label: 'Editar' }} />
            {hasBookmarks ? (
              <div className="fav-scroll-wrapper mb-6">
                <div className="fav-scroll">
                  {favorites.map(f => (
                    <CardFeature
                      key={f.abbr}
                      abbr={f.abbr}
                      domain={f.domain}
                      name={f.name}
                      status={f.status}
                      bookmarked={bookmarks.has(f.abbr)}
                      onBookmark={() => toggleBookmark(f.abbr)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyFavorites />
            )}

            {hasRecents && (
              <>
                <SectionHeader title="Ultimas utilizadas" />
                <div className="flex flex-col gap-2 mb-6">
                  {recents.map(r => <CardRecent key={r.name} name={r.name} time={r.time} />)}
                </div>
              </>
            )}

            <div className="flex flex-col gap-3 mb-6">
              {categories.map((cat) => (
                <CategoryCollapse
                  key={cat.name}
                  icon={cat.icon}
                  domain={cat.domain}
                  name={cat.name}
                  count={cat.count}
                  defaultOpen={cat.defaultOpen}
                >
                  {cat.items.map(item => (
                    <CardFeature
                      key={item.abbr + item.name}
                      abbr={item.abbr}
                      domain={item.domain}
                      name={item.name}
                      status={item.status}
                      bookmarked={bookmarks.has(item.abbr)}
                      onBookmark={() => toggleBookmark(item.abbr)}
                      href={item.status === 'premium' ? '/premium' : undefined}
                    />
                  ))}
                </CategoryCollapse>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
