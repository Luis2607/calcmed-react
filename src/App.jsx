import { getProtocolById } from './data/protocols';
import { CADFlow } from './features/cad/CADFlow';
import { SCAFlow } from './features/sca/SCAFlow';
import { SepseFlow } from './features/sepse/SepseFlow';
import { PCRFlow } from './features/pcr/PCRFlow';
import { AVCFlow } from './features/avc/AVCFlow';
import { Home } from './features/home/Home';
import { HubHome } from './features/hub/HubHome';
import { ColorGallery } from './features/ds/ColorGallery';
import { DsDashboard } from './features/ds/DsDashboard';
import { TypographyGallery } from './features/ds/TypographyGallery';
import { SpacingGallery } from './features/ds/SpacingGallery';
import { InputGallery } from './features/ds/InputGallery';
import { SheetGallery } from './features/ds/SheetGallery';
import { GoldenProtocolFrame } from './shared/components/layout/GoldenProtocolFrame';
import { DevPanel } from './shared/components/layout/DevPanel/DevPanel';
import { usePersistedState } from './shared/hooks/usePersistedState';

export default function App() {
  const [activeRoute, setActiveRoute] = usePersistedState('active_route', 'home');
  const [isPediatricMode, setIsPediatricMode] = usePersistedState('pediatric_mode', false);
  const [isDark, setIsDark] = usePersistedState('dark_mode', false);
  const qaRoute = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('qa')
    : null;
  const routeOverride = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('route')
    : null;
  const visibleRoute = routeOverride || activeRoute;
  const activeProtocol = getProtocolById(visibleRoute);

  const handleNavigate = (route) => {
    if (routeOverride && typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setActiveRoute(route);
  };
  const goHome = () => handleNavigate('home');

  const isSheetGallery = visibleRoute === 'ds-sheets' || qaRoute === 'bottomsheets';
  const isColorGallery = visibleRoute === 'ds-colors' || qaRoute === 'colors';
  const isTypographyGallery = visibleRoute === 'ds-typography' || qaRoute === 'typography';
  const isSpacingGallery = visibleRoute === 'ds-spacing' || qaRoute === 'spacing';
  const isInputGallery = visibleRoute === 'ds-inputs' || qaRoute === 'inputs';
  const isControlsGallery = visibleRoute === 'ds-controles' || qaRoute === 'controles';
  const isGallery = isSheetGallery || isColorGallery || isTypographyGallery || isSpacingGallery || isInputGallery || isControlsGallery;
  const isSepseReact = visibleRoute === 'sepse-react';
  const isPcrReact = visibleRoute === 'pcr-react';
  const isAvcReact = visibleRoute === 'avc-react';
  const isKnownRoute =
    visibleRoute === 'home' || visibleRoute === 'hub' || isGallery || isSepseReact || isPcrReact || isAvcReact || Boolean(activeProtocol);
  const showHome = !isGallery && (visibleRoute === 'home' || !isKnownRoute);

  if (qaRoute) {
    return <DsDashboard />;
  }

  return (
    <div className="page-wrapper">
      <div className={`viewport-container ${isPediatricMode ? 'modo-pediatrico' : ''} ${isDark ? 'modo-escuro' : ''}`.trim()}>
        <div className="scroll-container">
          {showHome && <Home onNavigate={handleNavigate} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />}

          {isSheetGallery && <SheetGallery />}

          {isColorGallery && <ColorGallery />}

          {isTypographyGallery && <TypographyGallery />}

          {isSpacingGallery && <SpacingGallery />}

          {isInputGallery && <InputGallery />}

          {visibleRoute === 'hub' && (
            <HubHome
              onNavigate={handleNavigate}
              isPediatric={isPediatricMode}
              setIsPediatric={setIsPediatricMode}
            />
          )}

          {visibleRoute === 'cad' && (
            <CADFlow onBack={goHome} isPediatric={isPediatricMode} />
          )}

          {visibleRoute === 'sca' && (
            <SCAFlow onBack={goHome} />
          )}

          {isSepseReact && (
            <SepseFlow onBack={goHome} />
          )}

          {isPcrReact && (
            <PCRFlow onBack={goHome} />
          )}

          {isAvcReact && (
            <AVCFlow onBack={goHome} />
          )}

          {activeProtocol && activeProtocol.id !== 'cad' && activeProtocol.id !== 'sca' && (
            <GoldenProtocolFrame protocol={activeProtocol} onBack={goHome} />
          )}
        </div>
      </div>
      <DevPanel route={visibleRoute} />
    </div>
  );
}
