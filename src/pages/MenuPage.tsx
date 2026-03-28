import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import UserCard from '../components/cards/UserCard'
import MenuGroup from '../components/layout/MenuGroup'
import MenuHeroCard from '../components/cards/MenuHeroCard'
import ListItem from '../components/ui/ListItem'
import { Brain, Megaphone, Footprints, Moon, HeartHalf, NotePencil, Gear, ChatCircleText, Gift, Info, SignOut, CaretRight } from '@phosphor-icons/react'
import HomeHeader from '../components/layout/HomeHeader'

export default function MenuPage() {
  return (
    <MobileFrame>
      <HomeHeader />

      <div className="screen-content menu-screen flex-1 overflow-y-auto p-5">
        <UserCard
          initials="RF"
          name="Dr. Rafael"
          email="rafael@hospital.com"
          status="free"
        />

        <MenuGroup label="Destaque">
          <ListItem
            icon={<Megaphone size={20} />}
            iconClass="text-link"
            title="Novidades e Lançamentos"
            href="/novidades"
            trailing={<><span className="tag-status novo">NOVO</span><CaretRight size={16} /></>}
          />
          <ListItem
            icon={<Footprints size={20} />}
            iconClass="text-link"
            title="Passômetro"
            href="/passometro"
            trailing={<CaretRight size={16} />}
          />
        </MenuGroup>

        <MenuGroup label="Ferramentas">
          <ListItem
            icon={<Moon size={20} />}
            title="Dividir Descanso"
            href="/dividir-descanso"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<HeartHalf size={20} />}
            title="CalcMed Eletro"
            href="/eletro"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<NotePencil size={20} />}
            title="Minhas Anotações"
            href="/anotacoes"
            trailing={<CaretRight size={16} />}
          />
        </MenuGroup>

        <MenuGroup label="Extras">
          <MenuHeroCard
            icon={<Brain size={20} />}
            title="Quiz CalcMed"
            subtitle="Teste seus conhecimentos clínicos"
            href="/quiz"
          />
        </MenuGroup>

        <MenuGroup label="Configurações">
          <ListItem
            icon={<Gear size={20} />}
            title="Configurações"
            href="/configuracoes"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<ChatCircleText size={20} />}
            title="Sugestão e Suporte"
            href="/suporte"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<Gift size={20} />}
            title="Minhas Vantagens"
            href="/vantagens"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<Info size={20} />}
            title="Sobre"
            href="/sobre"
            trailing={<CaretRight size={16} />}
          />
        </MenuGroup>

        {/* Sair separado no final */}
        <div className="menu-sair-wrapper">
          <ListItem
            icon={<SignOut size={20} />}
            iconClass="text-danger"
            title="Sair"
            href="/"
            className="list-item-danger"
            ariaLabel="Sair da conta"
          />
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
