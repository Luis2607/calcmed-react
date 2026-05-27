const ALIAS_MAP = {
  // Legado English -> Figma Portuguese
  'home': 'inicio',
  'search': 'busca',
  'calendar': 'escala',
  'sparkles': 'ia',
  'arrowLeft': 'voltar',
  'chevronRight': 'seta-direita',
  'chevronDown': 'dropdown',
  'bookmark': 'favoritar',
  'pencil': 'editar',
  'calculator': 'calculadoras',
  'flow': 'protocolos',
  'barChart': 'escores',
  'swap': 'conversores',
  'clock': 'tempo',
  'info': 'informacao',
  'sun': 'modo-claro',
  'bell': 'notificacao',
  'brain': 'cerebro',
  'activity': 'onda-ecg',
  'droplet': 'gota',
  'siren': 'primeiro-socorro',
  'heartPulse': 'batimento',
  'baby': 'bebe',
  'syringe': 'seringa',
};

export const Icon = ({ name, size = 24, className = '', color = 'currentColor', ...props }) => {
  const resolvedName = ALIAS_MAP[name] || name;

  // Centralized SVG path dictionary for CalcMed Design System
  const renderPath = () => {
    switch (resolvedName) {
      // 1. Navegação e App Bar
      case 'inicio':
        return (
          <>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </>
        );
      case 'busca':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </>
        );
      case 'escala':
        return (
          <>
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <line x1="6" y1="7" x2="6" y2="12" />
            <line x1="10" y1="7" x2="10" y2="10" />
            <line x1="14" y1="7" x2="14" y2="12" />
            <line x1="18" y1="7" x2="18" y2="10" />
          </>
        );
      case 'ia':
        return (
          <>
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          </>
        );
      case 'perfil':
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case 'voltar':
        return <polyline points="15 18 9 12 15 6" />;
      case 'fechar':
        return (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        );
      case 'seta-direita':
        return <polyline points="9 18 15 12 9 6" />;
      case 'menu':
        return (
          <>
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </>
        );
      case 'dropdown':
        return <polyline points="6 9 12 15 18 9" />;
      case 'dropdown-up':
        return <polyline points="18 15 12 9 6 15" />;
      case 'modo-claro':
        return (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        );
      case 'notificacao':
        return (
          <>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </>
        );

      // 2. Domínios
      case 'urgencias':
        return (
          <>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </>
        );
      case 'diluicoes':
        return (
          <>
            <path d="M10 2v7.586l-6.707 6.707A2 2 0 0 0 3 17.707V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.293a2 2 0 0 0-.586-1.414L14 9.586V2z" />
            <line x1="6" y1="14" x2="18" y2="14" />
          </>
        );
      case 'calculadoras':
        return (
          <>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="16" y2="18" />
          </>
        );
      case 'protocolos':
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </>
        );
      case 'escores':
        return (
          <>
            <path d="M12 20h9M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8M3 20h8M11 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
          </>
        );
      case 'conversores':
        return (
          <>
            <polyline points="16 3 21 8 16 13" />
            <line x1="21" y1="8" x2="9" y2="8" />
            <polyline points="8 21 3 16 8 11" />
            <line x1="3" y1="16" x2="15" y2="16" />
          </>
        );

      // 3. Feedbacks
      case 'informacao':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </>
        );
      case 'sucesso':
      case 'confirmacao':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 9 11 14 8 11" />
          </>
        );
      case 'critico':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'atencao':
        return (
          <>
            <path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </>
        );

      // 4. Ações
      case 'favoritar':
      case 'estrela':
        return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />;
      case 'compartilhar':
        return (
          <>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </>
        );
      case 'editar':
        return <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />;
      case 'excluir':
        return (
          <>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </>
        );
      case 'adicionar':
        return (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </>
        );
      case 'copiar':
        return (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        );
      case 'salvar':
        return <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />;
      case 'link-externo':
        return (
          <>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </>
        );
      case 'thumbs-up':
        return <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />;
      case 'thumbs-down':
        return <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm8-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />;
      case 'download':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </>
        );

      // 5. Formulários
      case 'erro-campo':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'senha-visivel':
        return (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
      case 'senha-oculta':
        return (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        );

      // 6. Clínicos
      case 'tempo':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        );
      case 'batimento':
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case 'termometro':
        return <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />;
      case 'seringa':
        return (
          <>
            <path d="M18 2l4 4M13 7l4 4M5 15l-3 3v4h4l3-3M6.5 12.5l5 5M9 10l5 5" />
          </>
        );
      case 'pilula':
        return (
          <>
            <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="7.6" transform="rotate(-45 12 12)" />
            <line x1="6.3" y1="17.7" x2="17.7" y2="6.3" />
          </>
        );
      case 'bebe':
        return (
          <>
            <circle cx="12" cy="10" r="5" />
            <path d="M12 15a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
          </>
        );
      case 'onda-ecg':
        return <path d="M2 12h3l2-5 3 10 2-7 1 4 1-2 2 3h6" />;
      case 'gota':
        return <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />;
      case 'cerebro':
        return (
          <>
            <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M12 5v13" />
          </>
        );
      case 'primeiro-socorro':
        return (
          <>
            <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
            <path d="M5 21a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1ZM20 21a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Z" />
            <path d="M4 12H3M21 12h-1M12 3V2M5.6 5.6l-.7-.7M18.4 5.6l.7-.7" />
          </>
        );

      // Fallback para ícones do figma pendentes de mapeamento SVG exato no código
      default:
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
            <line x1="3" y1="3" x2="21" y2="21" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2" />
          </>
        );
    }
  };

  const isMapped = resolvedName !== 'default' && ![
    // Lista de ícones conhecidos que caem no fallback por falta de SVG vetorizado no React
    'rodape', 'configuracoes', 'ajuda', 'sair', 'modo-escuro',
    'cartao-credito', 'bloqueado', 'premium', 'arrastar', 'frasco',
    'raio', 'relogio-rapido', 'medidor', 'estetoscopio', 'busca-vazia', 'favoritos-vazio',
    'sem-conexao', 'conteudo-premium', 'plantao-vazio', 'erro-rede', 'erro-timeout',
    'erro-conteudo', 'erro-calculo', 'carregando', 'email', 'whatsapp', 'usuario',
    'usuarios', 'envelope', 'audio', 'audio-mute', 'coracao-cheio', 'coracao', 'procedimento'
  ].includes(resolvedName);

  return (
    <svg
      className={`calcmed-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-mapped={isMapped}
      {...props}
    >
      {renderPath()}
    </svg>
  );
};
export default Icon;
