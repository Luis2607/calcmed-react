import { usePersistedState } from '../../../shared/hooks/usePersistedState';
import {
  parseNum,
  inferirModo,
  labelModo,
  isPediatrico as ehPediatrico,
  isCriticoPediatrico as ehCriticoPediatrico,
  contarCriterios,
  diagnosticoConfirmado,
  soroInicial,
  sodioCorrigido,
  gateK,
  doseInsulina,
  avaliarResolucao,
  REAVAL_SEGUNDOS,
} from '../cadData';

/**
 * Estado clínico do protocolo CAD — porte 1:1 do golden cad.js (objeto `estado`)
 * + pediatrico.js. Chaves React `cad_*` por campo (não usa o blob
 * `cad_protocolo_atual` do golden, evitando colisão com o iframe golden no QA).
 * Mesmo padrão de useAVCState.
 */
export function useCADState() {
  // Sessão / navegação. telaAtual: 1..6 | '2k' (subtela aguardo KCl).
  const [iniciadoEm, setIniciadoEm] = usePersistedState('cad_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('cad_tela_atual', 1);
  const [telaMaxVisitada, setTelaMaxVisitada] = usePersistedState('cad_tela_max', 1);
  const [abaAtual, setAbaAtual] = usePersistedState('cad_aba_atual', 'executar');

  // T1 · Diagnóstico
  const [idade, setIdade] = usePersistedState('cad_idade', '');
  const [peso, setPeso] = usePersistedState('cad_peso', '');
  const [glicemia, setGlicemia] = usePersistedState('cad_glicemia', '');
  const [acidoseConfirmada, setAcidoseConfirmada] = usePersistedState('cad_acidose', false);
  const [cetoseConfirmada, setCetoseConfirmada] = usePersistedState('cad_cetose', false);

  // T2 · Sódio + Potássio (gate K)
  const [sodio, setSodio] = usePersistedState('cad_sodio', '');
  const [potassio, setPotassio] = usePersistedState('cad_potassio', ''); // baixo|normal|alto|muito-alto
  const [potassioCorrigido, setPotassioCorrigido] = usePersistedState('cad_k_corrigido', false);
  const [aguardoKIniciadoEm, setAguardoKIniciadoEm] = usePersistedState('cad_aguardo_k_em', null);
  const [pediatricoFluidosEm, setPediatricoFluidosEm] = usePersistedState('cad_ped_fluidos_em', null);

  // T3 · Insulina IV
  const [bolus, setBolus] = usePersistedState('cad_bolus', false);
  const [insulinaIniciada, setInsulinaIniciada] = usePersistedState('cad_insulina_em', null);
  const [insulinaSuspensa, setInsulinaSuspensa] = usePersistedState('cad_insulina_suspensa', false);
  const [doseInsulinaUh, setDoseInsulinaUh] = usePersistedState('cad_dose_uh', null);

  // T4 · Reavaliação horária
  const [medidas, setMedidas] = usePersistedState('cad_medidas', []);
  const [reavalProximoEm, setReavalProximoEm] = usePersistedState('cad_reaval_proximo_em', null);

  // T5 · Resolução (auto-seed das medidas, com override manual)
  const [resolucao, setResolucao] = usePersistedState('cad_resolucao', { hgt: false, hco3: false, ag: false });

  // T6 · Encerramento
  const [iniciais, setIniciais] = usePersistedState('cad_iniciais', '');

  // Eventos (Timeline) + anotação (cross-protocolo)
  const [eventos, setEventos] = usePersistedState('cad_eventos', []);
  const [anotacao, setAnotacao] = usePersistedState('cad_anotacao', '');
  const [anotacaoEditadaEm, setAnotacaoEditadaEm] = usePersistedState('cad_anotacao_em', null);

  // ============================================================
  // DERIVADOS (lógica clínica pura · via cadData)
  // ============================================================
  const numIdade = idade !== '' && !isNaN(parseNum(idade)) ? parseNum(idade) : null;
  const numPeso = peso !== '' && !isNaN(parseNum(peso)) ? parseNum(peso) : null;

  const modo = inferirModo(numIdade);
  const modoLabel = labelModo(modo);
  const isPediatric = ehPediatrico(modo);
  const isCriticalPediatric = ehCriticoPediatrico(modo);

  const criteriosCount = contarCriterios({ glicemia, acidoseConfirmada, cetoseConfirmada });
  const isDiagnosisConfirmed = diagnosticoConfirmado({ idade, peso, glicemia, acidoseConfirmada, cetoseConfirmada });

  const soro = soroInicial(glicemia);
  const naCorrigido = sodioCorrigido(sodio, glicemia);
  const gate = gateK(potassio);
  const isInsulinBlocked = gate.bloqueado;
  const doseUh = doseInsulina(peso);

  const resolucaoAuto = avaliarResolucao(medidas);

  // ============================================================
  // AÇÕES
  // ============================================================
  const marcarInicio = () => { if (!iniciadoEm) setIniciadoEm(Date.now()); };

  const registrarEvento = (acao, tag) => {
    setEventos((prev) => [...(prev || []), { hora: Date.now(), acao, tag: tag || '' }]);
  };

  const irParaTela = (n) => {
    setTelaAtual(n);
    if (typeof n === 'number') setTelaMaxVisitada((prev) => Math.max(prev || 0, n));
  };

  // Idade muda → infere modo + marca início do caso (golden inputIdade).
  const setIdadeComModo = (v) => {
    setIdade(v);
    const i = parseNum(v);
    if (!iniciadoEm && !isNaN(i)) setIniciadoEm(Date.now());
  };

  // T1 → T2 (golden confirmarDiagnostico). Em pediátrico, marca início dos fluidos (bloqueio 1h).
  const confirmarDiagnostico = () => {
    if (isPediatric && !pediatricoFluidosEm) setPediatricoFluidosEm(Date.now());
    registrarEvento(`Diagnóstico CAD confirmado · ${modoLabel}`, 'confirmado');
    irParaTela(2);
  };

  // T2 · prescrição de KCl confirmada → subtela aguardo 2h (golden modal repor-k).
  const confirmarReposicaoK = () => {
    setPotassioCorrigido(true);
    setAguardoKIniciadoEm(Date.now());
    registrarEvento('KCl iniciado · K em correção', 'k');
    irParaTela('2k');
  };

  // Novo K lançado na subtela aguardo (golden modal relancar-k).
  const relancarK = (novaFaixa) => {
    setPotassio(novaFaixa);
    setAguardoKIniciadoEm(null);
    irParaTela(2);
  };

  // T3 · iniciar bomba (golden iniciarBomba).
  const iniciarBomba = () => {
    setInsulinaIniciada(Date.now());
    setInsulinaSuspensa(false);
    if (doseUh != null) setDoseInsulinaUh(parseNum(doseUh));
    setReavalProximoEm(Date.now() + REAVAL_SEGUNDOS * 1000);
    registrarEvento(`Insulina iniciada · ${doseUh} U/h${bolus ? ' + bolus 0,1 U/kg' : ''}`, 'insulina');
    irParaTela(4);
  };

  // Reset do contador de reavaliação para +1h (golden proximoHGTSec = 3600).
  const reiniciarReaval = () => setReavalProximoEm(Date.now() + REAVAL_SEGUNDOS * 1000);

  // T4 · lança uma reavaliação (golden modal inserir-medida · acao).
  const lancarMedida = (medida) => {
    const m = { hora: Date.now(), tipo: 'reavaliacao', insulinaUh: doseInsulinaUh, ...medida };
    setMedidas((prev) => [...(prev || []), m]);
    reiniciarReaval();
    if (m.hgt != null) registrarEvento(`HGT ${m.hgt} mg/dL`, 'medida');
    if (m.hgt != null && m.hgt < 200) setResolucao((r) => ({ ...r, hgt: true }));
    // K novo < 3,5 suspende infusão e volta pra reposição.
    if (m.k != null && m.k < 3.5) {
      setPotassio('baixo');
      setInsulinaSuspensa(true);
      setAguardoKIniciadoEm(Date.now());
    }
    // Hipoglicemia < 100 suspende infusão.
    if (m.hgt != null && m.hgt < 100) setInsulinaSuspensa(true);
    return m;
  };

  // Persiste cálculo de AG vindo do modal calcular-ag (golden modal calcular-ag · acao).
  const registrarAG = ({ na, cl, hco3, ag }) => {
    setMedidas((prev) => [...(prev || []), { hora: Date.now(), na, cl, hco3, ag, fonte: 'modal-ag' }]);
  };

  // T5 · seed automático da resolução a partir das medidas + toggle manual.
  const seedResolucao = () => {
    setResolucao({
      hgt: resolucaoAuto.hgt.atende,
      hco3: resolucaoAuto.hco3.atende,
      ag: resolucaoAuto.ag.atende,
    });
  };
  const toggleResolucao = (key) => setResolucao((r) => ({ ...r, [key]: !r[key] }));

  const resolucaoTodos = resolucao.hgt && resolucao.hco3 && resolucao.ag;

  const resetProtocol = () => {
    setIniciadoEm(null); setTelaAtual(1); setTelaMaxVisitada(1); setAbaAtual('executar');
    setIdade(''); setPeso(''); setGlicemia(''); setAcidoseConfirmada(false); setCetoseConfirmada(false);
    setSodio(''); setPotassio(''); setPotassioCorrigido(false); setAguardoKIniciadoEm(null); setPediatricoFluidosEm(null);
    setBolus(false); setInsulinaIniciada(null); setInsulinaSuspensa(false); setDoseInsulinaUh(null);
    setMedidas([]); setReavalProximoEm(null);
    setResolucao({ hgt: false, hco3: false, ag: false });
    setIniciais(''); setEventos([]); setAnotacao(''); setAnotacaoEditadaEm(null);
  };

  return {
    // sessão / nav
    iniciadoEm, setIniciadoEm, marcarInicio,
    telaAtual, setTelaAtual, telaMaxVisitada, irParaTela,
    abaAtual, setAbaAtual,
    // T1
    idade, setIdade: setIdadeComModo, setIdadeRaw: setIdade,
    peso, setPeso, glicemia, setGlicemia,
    acidoseConfirmada, setAcidoseConfirmada, cetoseConfirmada, setCetoseConfirmada,
    numIdade, numPeso, modo, modoLabel, isPediatric, isCriticalPediatric,
    criteriosCount, isDiagnosisConfirmed, soro, confirmarDiagnostico,
    // T2
    sodio, setSodio, naCorrigido,
    potassio, setPotassio, potassioCorrigido, gate, isInsulinBlocked,
    aguardoKIniciadoEm, setAguardoKIniciadoEm, confirmarReposicaoK, relancarK,
    pediatricoFluidosEm, setPediatricoFluidosEm,
    // T3
    bolus, setBolus, insulinaIniciada, insulinaSuspensa, setInsulinaSuspensa,
    doseUh, doseInsulinaUh, setDoseInsulinaUh, iniciarBomba,
    // T4
    medidas, setMedidas, lancarMedida, registrarAG,
    reavalProximoEm, setReavalProximoEm, reiniciarReaval,
    // T5
    resolucao, setResolucao, resolucaoAuto, seedResolucao, toggleResolucao, resolucaoTodos,
    // T6
    iniciais, setIniciais,
    // eventos / anotação
    eventos, registrarEvento,
    anotacao, setAnotacao, anotacaoEditadaEm, setAnotacaoEditadaEm,
    // ciclo
    resetProtocol,
  };
}
