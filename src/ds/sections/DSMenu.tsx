import DSPanel from '../DSPanel'

export default function DSMenu() {
  return (
    <div>
      <h2 className="ds-section-title">Menu e Perfil</h2>
      <p className="ds-section-desc">
        Componentes do menu lateral e perfil do usuario. Acesso a configuracoes, ferramentas e conteudo secundario.
        O menu deve ser limpo e organizado — o medico precisa encontrar o que busca sem navegar por dezenas de opcoes.
      </p>

      {/* User Card */}
      <div className="ds-subsection">
        <h3>Card do Usuario</h3>
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
        <DSPanel>
          <div className="flex flex-col gap-4">
            {/* Group 1 */}
            <div className="menu-group">
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-gear" /></div>
                <div className="list-content">
                  <div className="list-title">Configuracoes</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-bell" /></div>
                <div className="list-content">
                  <div className="list-title">Notificacoes</div>
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
        <DSPanel>
          <div className="menu-hero-card">
            <div className="hero-icon"><i className="ph ph-trophy" /></div>
            <div className="hero-content">
              <div className="hero-title">Quiz CalcMed</div>
              <div className="hero-sub">Teste seus conhecimentos em emergencia</div>
            </div>
            <i className="ph ph-caret-right hero-arrow" />
          </div>
        </DSPanel>
      </div>

      {/* Notifications */}
      <div className="ds-subsection">
        <h3>Notificacoes</h3>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="notif-item notif-unread">
              <div className="icon-circle-teal flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-sparkle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Nova funcionalidade: CalcMed IA</div>
                <div className="t-legenda text-fg-2 mt-1">Agora voce pode tirar duvidas clinicas com IA.</div>
                <div className="notif-meta mt-1">Hoje, 14:32</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-success flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-check-circle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Plantao confirmado</div>
                <div className="t-legenda text-fg-2 mt-1">Hospital Sao Lucas, 19h-07h.</div>
                <div className="notif-meta mt-1">Ontem</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-warning flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-warning" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Assinatura expira em 3 dias</div>
                <div className="t-legenda text-fg-2 mt-1">Renove para nao perder acesso.</div>
                <div className="notif-meta mt-1">2 dias atras</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* List Item States */}
      <div className="ds-subsection">
        <h3>Estados do List Item</h3>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-star" /></div>
              <div className="list-content">
                <div className="list-title">Default</div>
                <div className="list-subtitle">Estado padrao do item</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item selected">
              <div className="list-icon"><i className="ph ph-check" /></div>
              <div className="list-content">
                <div className="list-title">Selecionado</div>
                <div className="list-subtitle">Fundo teal-50 / navy-800 no dark</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item disabled">
              <div className="list-icon"><i className="ph ph-prohibit" /></div>
              <div className="list-content">
                <div className="list-title">Desabilitado</div>
                <div className="list-subtitle">Opacidade reduzida, sem interacao</div>
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
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.user-card', desc: 'Card do perfil: flex, radius xl, borda, padding' },
              { cls: '.menu-group', desc: 'Grupo com borda: radius xl, overflow hidden' },
              { cls: '.menu-hero-card', desc: 'Card navy destacado: flex, padding 20px, icone + texto' },
              { cls: '.hero-icon', desc: 'Icone 44px com fundo branco translucido' },
              { cls: '.hero-title', desc: 'Titulo branco: font 600 16px' },
              { cls: '.hero-sub', desc: 'Subtitulo: font 400 13px, cor slate-400' },
              { cls: '.notif-item', desc: 'Item de notificacao: flex, padding, radius lg' },
              { cls: '.notif-unread', desc: 'Nao lida: fundo teal-50' },
              { cls: '.notif-meta', desc: 'Metadados: font 400 12px, cor fg-3' },
              { cls: '.list-item', desc: 'Item de lista: flex, padding, min-h 56px' },
              { cls: '.list-item.selected', desc: 'Fundo teal-50 (light) / navy-800 (dark)' },
              { cls: '.list-item.disabled', desc: 'Opacidade reduzida, pointer-events none' },
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
