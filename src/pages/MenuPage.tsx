import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import UserCard from '../components/cards/UserCard'
import MenuGroup from '../components/layout/MenuGroup'
import MenuHeroCard from '../components/cards/MenuHeroCard'
import ListItem from '../components/ui/ListItem'
import { Megaphone, Footprints, Moon, HeartHalf, NotePencil, Gear, ChatCircleText, Gift, Info, SignOut, CaretRight } from '@phosphor-icons/react'

export default function MenuPage() {
  return (
    <MobileFrame>
      <div className="screen-content flex-1 overflow-y-auto p-5 pt-10">
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
            trailing={<><span className="tag-status novo">NOVO</span><CaretRight size={16} /></>}
          />
          <ListItem
            icon={<Footprints size={20} />}
            iconClass="text-link"
            title="Passômetro"
            trailing={<CaretRight size={16} />}
          />
        </MenuGroup>

        <MenuGroup label="Ferramentas">
          <ListItem
            icon={<Moon size={20} />}
            title="Dividir Descanso"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<HeartHalf size={20} />}
            title="CalcMed Eletro"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<NotePencil size={20} />}
            title="Minhas Anotações"
            trailing={<CaretRight size={16} />}
          />
        </MenuGroup>

        <MenuGroup label="Extras">
          <MenuHeroCard
            icon="brain"
            title="Quiz CalcMed"
            subtitle="Teste seus conhecimentos clínicos"
          />
        </MenuGroup>

        <MenuGroup label="Configurações">
          <ListItem
            icon={<Gear size={20} />}
            title="Configurações"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<ChatCircleText size={20} />}
            title="Sugestão e Suporte"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<Gift size={20} />}
            title="Minhas Vantagens"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<Info size={20} />}
            title="Sobre"
            trailing={<CaretRight size={16} />}
          />
          <ListItem
            icon={<SignOut size={20} />}
            iconClass="text-danger"
            title="Sair"
            href="/"
            className="text-danger"
          />
        </MenuGroup>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
