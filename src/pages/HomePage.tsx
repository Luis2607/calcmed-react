import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import HomeHeader from '../components/layout/HomeHeader'
import SubheaderBar from '../components/layout/SubheaderBar'
import BottomNav from '../components/layout/BottomNav'
import BannerEditorial from '../components/cards/BannerEditorial'
import CardFeature from '../components/cards/CardFeature'
import CardRecent from '../components/cards/CardRecent'
import CategoryCollapse from '../components/cards/CategoryCollapse'
import SectionHeader from '../components/ui/SectionHeader'
import { favorites, recents, categories } from '../data/homeData'

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['IOT', 'DVA', 'CrCl', 'VM']))

  const toggleBookmark = (abbr: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(abbr) ? next.delete(abbr) : next.add(abbr)
      return next
    })
  }

  return (
    <MobileFrame>
      <HomeHeader />
      <SubheaderBar tabs={['Adulto', 'Ped']} />

      <div className="screen-content flex-1 overflow-y-auto p-5 pb-8">
        <BannerEditorial
          tag="Novidade"
          title="Cetoacidose Diabética atualizada - Novo protocolo 2026"
          description="Veja as mudanças e atualize sua prática clínica."
        />

        <SectionHeader title="Meu Plantão" action={{ label: 'Editar' }} />
        <div className="fav-scroll mb-6">
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

        <SectionHeader title="Últimas utilizadas" />
        <div className="flex flex-col gap-2 mb-6">
          {recents.map(r => <CardRecent key={r.name} name={r.name} time={r.time} />)}
        </div>

        {categories.map(cat => (
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

      <BottomNav />
    </MobileFrame>
  )
}
