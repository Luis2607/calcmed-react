import DSPanel from '../DSPanel'

export default function DSMenu() {
  return (
    <div>
      <h2 className="ds-section-title">Menu e Perfil</h2>
      <p className="ds-section-desc">
        Componentes do menu lateral e perfil do usu\u00e1rio. Acesso a configura\u00e7\u00f5es, ferramentas e conte\u00fado
        secund\u00e1rio. O menu deve ser limpo e organizado: o m\u00e9dico precisa encontrar o que busca sem navegar
        por dezenas de op\u00e7\u00f5es.
      </p>

      {/* User Card */}
      <div className="ds-subsection">
        <h3>Card do Usu\u00e1rio</h3>
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
                  <div className="list-title">Configura\u00e7\u00f5es</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-bell" /></div>
                <div className="list-content">
                  <div className="list-title">Notifica\u00e7\u00f5es</div>
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
              <div className="hero-sub">Teste seus conhecimentos em emerg\u00eancia</div>
            </div>
            <i className="ph ph-caret-right hero-arrow" />
          </div>
        </DSPanel>
      </div>

      {/* Notifications */}
      <div className="ds-subsection">
        <h3>Notifica\u00e7\u00f5es</h3>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="notif-item notif-unread">
              <div className="icon-circle-teal flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-sparkle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Nova funcionalidade: CalcMed IA</div>
                <div className="t-legenda text-fg-2 mt-1">Agora voc\u00ea pode tirar d\u00favidas cl\u00ednicas com IA.</div>
                <div className="notif-meta mt-1">Hoje, 14:32</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-success flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-check-circle" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Plant\u00e3o confirmado</div>
                <div className="t-legenda text-fg-2 mt-1">Hospital S\u00e3o Lucas, 19h-07h.</div>
                <div className="notif-meta mt-1">Ontem</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="icon-circle-warning flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}>
                <i className="ph ph-warning" style={{ fontSize: 20 }} />
              </div>
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Assinatura expira em 3 dias</div>
                <div className="t-legenda text-fg-2 mt-1">Renove para n\u00e3o perder acesso.</div>
                <div className="notif-meta mt-1">2 dias atr\u00e1s</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* List Item States */}
      <div className="ds-subsection">
        <h3>Estados do List Item</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O componente list-item possui tr\u00eas estados visuais. O estado default usa fundo transparente
          com hover sutil. O estado selecionado destaca com fundo teal-50 (light) ou navy-800 (dark).
          O estado desabilitado reduz a opacidade e remove intera\u00e7\u00e3o via pointer-events.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-star" /></div>
              <div className="list-content">
                <div className="list-title">Default</div>
                <div className="list-subtitle">Estado padr\u00e3o, com hover ao passar o dedo/mouse</div>
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
                <div className="list-subtitle">Opacidade reduzida, sem intera\u00e7\u00e3o</div>
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
            <tr><th>Classe</th><th>Descri\u00e7\u00e3o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.user-card', desc: 'Card do perfil: flex, border-radius xl, borda sutil, padding interno' },
              { cls: '.menu-group', desc: 'Grupo com borda: border-radius xl, overflow hidden para arredondar filhos' },
              { cls: '.menu-hero-card', desc: 'Card navy destacado: flex com padding 20px, \u00edcone + texto em fundo escuro' },
              { cls: '.hero-icon', desc: '\u00cdcone 44px com fundo branco transl\u00facido (destaque sobre navy)' },
              { cls: '.hero-title', desc: 'T\u00edtulo branco: font 600 16px' },
              { cls: '.hero-sub', desc: 'Subt\u00edtulo: font 400 13px, cor slate-400' },
              { cls: '.notif-item', desc: 'Item de notifica\u00e7\u00e3o: flex com padding e border-radius lg' },
              { cls: '.notif-unread', desc: 'N\u00e3o lida: fundo teal-50 para destaque visual' },
              { cls: '.notif-meta', desc: 'Metadados (data/hora): font 400 12px, cor fg-3' },
              { cls: '.list-item', desc: 'Item de lista gen\u00e9rico: flex, padding, min-height 56px (touch target)' },
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
