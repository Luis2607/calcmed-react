import DSPanel from '../DSPanel'

export default function DSMenu() {
  return (
    <div>
      <h2 className="ds-section-title">Menu e Perfil</h2>
      <p className="ds-section-desc">
        Componentes do menu lateral e perfil do usuário. Acesso a configurações, ferramentas e conteúdo
        secundário. O menu deve ser limpo e organizado: o médico precisa encontrar o que busca sem navegar
        por dezenas de opções.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Agrupar configurações relacionadas. Use menu-group para manter contexto visual</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Destacar ações promocionais ou de gamificação. Use hero-card com fundo navy</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir notificações com estados lido/não lido para priorização visual</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Houver mais de 8 itens por grupo. Divida em subgrupos para facilitar a leitura</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Misturar itens de configuração com ações clínicas no mesmo grupo</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar hero-card para conteúdo informativo comum. Reserve para destaques reais</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="ds-subsection">
        <h3>Card do Usuário</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Identificação visual do médico no topo do menu. Avatar com iniciais, nome e badge do plano.
        </p>
        <DSPanel>
          <div className="user-card">
            <div className="avatar avatar-md avatar-teal">LB</div>
            <div className="flex-1">
              <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Dr. Luis Barros</div>
              <div className="t-legenda text-fg-3">Emergencista</div>
            </div>
            <i className="ph ph-caret-right text-fg-3" style={{ fontSize: 20 }} />
          </div>
        </DSPanel>
      </div>

      {/* Menu Groups */}
      <div className="ds-subsection">
        <h3>Grupos de Menu</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Itens agrupados por contexto. A separação visual ajuda o médico a localizar a opção sem ler todos os itens.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            {/* Group 1 */}
            <div className="menu-group">
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-gear" /></div>
                <div className="list-content">
                  <div className="list-title">Configurações</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-bell" /></div>
                <div className="list-content">
                  <div className="list-title">Notificações</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item selected">
                <div className="list-icon"><i className="ph ph-moon" /></div>
                <div className="list-content">
                  <div className="list-title">Modo escuro</div>
                  <div className="list-subtitle">Ativo</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
            </div>

            {/* Group 2 */}
            <div className="menu-group">
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-question" /></div>
                <div className="list-content">
                  <div className="list-title">Central de ajuda</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item disabled">
                <div className="list-icon"><i className="ph ph-chat-text" /></div>
                <div className="list-content">
                  <div className="list-title">Feedback</div>
                  <div className="list-subtitle">Em breve</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Hero Card */}
      <div className="ds-subsection">
        <h3>Hero Card</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Card destacado para ações promocionais ou gamificação. Fundo navy para contraste máximo.
        </p>
        <DSPanel>
          <div className="menu-hero-card">
            <div className="hero-icon"><i className="ph ph-trophy" /></div>
            <div className="hero-content">
              <div className="hero-title">Quiz CalcMed</div>
              <div className="hero-sub">Teste seus conhecimentos em emergência</div>
            </div>
            <i className="ph ph-caret-right hero-arrow" />
          </div>
        </DSPanel>
      </div>

      {/* Notifications */}
      <div className="ds-subsection">
        <h3>Notificações</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Lista com estados lido/não lido. Não lidas com fundo teal sutil. Cada item inclui ícone, título e timestamp.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="notif-item notif-unread">
              <div className="icon-circle-teal flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-sparkle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Nova funcionalidade: CalcMed IA</div>
                <div className="t-legenda text-fg-2 mt-1">Agora você pode tirar dúvidas clínicas com IA.</div>
                <div className="notif-meta mt-1">Hoje, 14:32</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-success flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-check-circle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Plantão confirmado</div>
                <div className="t-legenda text-fg-2 mt-1">Hospital São Lucas, 19h-07h.</div>
                <div className="notif-meta mt-1">Ontem</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-warning flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-warning" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Assinatura expira em 3 dias</div>
                <div className="t-legenda text-fg-2 mt-1">Renove para não perder acesso.</div>
                <div className="notif-meta mt-1">2 dias atrás</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* List Item States */}
      <div className="ds-subsection">
        <h3>Estados do List Item</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O componente list-item possui três estados visuais. O estado default usa fundo transparente
          com hover sutil. O estado selecionado destaca com fundo teal-50 (light) ou navy-800 (dark).
          O estado desabilitado reduz a opacidade e remove interação via pointer-events.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-star" /></div>
              <div className="list-content">
                <div className="list-title">Default</div>
                <div className="list-subtitle">Estado padrão, com hover ao passar o dedo/mouse</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item selected">
              <div className="list-icon"><i className="ph ph-check" /></div>
              <div className="list-content">
                <div className="list-title">Selecionado</div>
                <div className="list-subtitle">Fundo teal-50 (light) / navy-800 (dark)</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item disabled">
              <div className="list-icon"><i className="ph ph-prohibit" /></div>
              <div className="list-content">
                <div className="list-title">Desabilitado</div>
                <div className="list-subtitle">Opacidade reduzida, sem interação</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.user-card', desc: 'Card do perfil: flex, border-radius xl, borda sutil, padding interno' },
              { cls: '.menu-group', desc: 'Grupo com borda: border-radius xl, overflow hidden para arredondar filhos' },
              { cls: '.menu-hero-card', desc: 'Card navy destacado: flex com padding 20px, ícone + texto em fundo escuro' },
              { cls: '.hero-icon', desc: 'Ícone 44px com fundo branco translúcido (destaque sobre navy)' },
              { cls: '.hero-title', desc: 'Título branco: font 600 16px' },
              { cls: '.hero-sub', desc: 'Subtítulo: font 400 13px, cor slate-400' },
              { cls: '.notif-item', desc: 'Item de notificação: flex com padding e border-radius lg' },
              { cls: '.notif-unread', desc: 'Não lida: fundo teal-50 para destaque visual' },
              { cls: '.notif-meta', desc: 'Metadados (data/hora): font 400 12px, cor fg-3' },
              { cls: '.list-item', desc: 'Item de lista genérico: flex, padding, min-height 56px (touch target)' },
              { cls: '.list-item.selected', desc: 'Estado selecionado: fundo teal-50 (light) / navy-800 (dark)' },
              { cls: '.list-item.disabled', desc: 'Estado desabilitado: opacidade reduzida, pointer-events none' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
