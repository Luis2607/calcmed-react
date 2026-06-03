import { usePersistedState } from '../../../shared/hooks/usePersistedState';

/**
 * useSCAState — fonte única de verdade do SCA (golden sca.js · estadoPadrao).
 * Tudo persistido (sobrevive reload) — corrige o bug do mock React (useState volátil).
 * Abre LIMPO: sem paciente demo. Cronômetros manual-start (feedback_cronometros_manual_start).
 */
const CRONO_VAZIO = { iniciadoEm: null, pausadoEm: null, acumulado: 0, finalizadoEm: null, finalMs: null };

const PACIENTE_PADRAO = { iniciais: null, idade: null, peso: null, sexo: null, queixa: null, manchester: null };

const FLAGS_PADRAO = {
  dor10min: false, irradiacao: false, autonomicos: false, fatoresRisco: false,
  dacPrevia: false, avcPrevio: false, pde5: false, saa: false, aco: false, gestante: false,
};

const SINAIS_OMI_PADRAO = {
  tHiperaguda: false, deWinter: false, wellens: false, aslanger: false,
  espelhoPosterior: false, sgarbossaSmith: false, distorcaoQrsTerminal: false, istAvlIsolado: false,
};

const HEART_PADRAO = { history: null, ecg: null, age: null, risk: null, troponin: null };
const TIMI_PADRAO = { age65: false, fr3: false, dac: false, aas: false, angina: false, ecgSt: false, troponina: false };
const HEAR_PADRAO = { history: null, ecg: null, age: null, risk: null };

const ALTA_PADRAO = {
  estatina: false, bb: false, ieca: false, espirono: false,
  dapt: false, ppi: false, cr: false, eco: false,
};

export function useSCAState() {
  // Sessão / navegação
  const [iniciadoEm, setIniciadoEm] = usePersistedState('sca_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('sca_tela_atual', 1);
  const [telaMaxVisitada, setTelaMaxVisitada] = usePersistedState('sca_tela_max', 1);
  const [abaAtual, setAbaAtual] = usePersistedState('sca_aba_atual', 'executar');

  // Setup realidade do serviço
  const [setupTrop, setSetupTrop] = usePersistedState('sca_setup_trop', 'hs');
  const [setupEscore, setSetupEscore] = usePersistedState('sca_setup_escore', 'heart');
  const [setupConfigurado, setSetupConfigurado] = usePersistedState('sca_setup_ok', false);

  // Paciente + anamnese
  const [paciente, setPaciente] = usePersistedState('sca_paciente', PACIENTE_PADRAO);
  const [flags, setFlags] = usePersistedState('sca_flags', FLAGS_PADRAO);

  // ECG
  const [ecgClasse, setEcgClasse] = usePersistedState('sca_ecg_classe', null);
  const [stemiLocalizacao, setStemiLocalizacao] = usePersistedState('sca_stemi_loc', null);
  const [gateAvlChecado, setGateAvlChecado] = usePersistedState('sca_gate_avl', false);
  const [gateV7v9Checado, setGateV7v9Checado] = usePersistedState('sca_gate_v7v9', false);
  const [sinaisOmi, setSinaisOmi] = usePersistedState('sca_sinais_omi', SINAIS_OMI_PADRAO);
  const [lockSoftOmiConfirmado, setLockSoftOmiConfirmado] = usePersistedState('sca_lock_omi', false);
  const [ecgAnotacao, setEcgAnotacao] = usePersistedState('sca_ecg_anotacao', '');

  // Cronômetros (manual-start)
  const [cronoPortaEcg, setCronoPortaEcg] = usePersistedState('sca_crono_porta_ecg', CRONO_VAZIO);
  const [cronoEcgSeriado, setCronoEcgSeriado] = usePersistedState('sca_crono_ecg_seriado', { iniciadoEm: null });
  const [cronoPortaBalao, setCronoPortaBalao] = usePersistedState('sca_crono_porta_balao', { iniciadoEm: null });
  const [cronoPortaAgulha, setCronoPortaAgulha] = usePersistedState('sca_crono_porta_agulha', { iniciadoEm: null });

  // Escores
  const [escoreEscolhido, setEscoreEscolhido] = usePersistedState('sca_escore', 'heart');
  const [heart, setHeart] = usePersistedState('sca_heart', HEART_PADRAO);
  const [timi, setTimi] = usePersistedState('sca_timi', TIMI_PADRAO);
  const [hear, setHear] = usePersistedState('sca_hear', HEAR_PADRAO);

  // Troponina
  const [tropInicial, setTropInicial] = usePersistedState('sca_trop_inicial', null);
  const [tropSeriada, setTropSeriada] = usePersistedState('sca_trop_seriada', null);
  const [tropPulada, setTropPulada] = usePersistedState('sca_trop_pulada', false);

  // Conduta / reperfusão
  const [aasAdministrado, setAasAdministrado] = usePersistedState('sca_aas', false);
  const [p2y12Escolhido, setP2y12Escolhido] = usePersistedState('sca_p2y12', null);
  const [tempoPCI, setTempoPCI] = usePersistedState('sca_tempo_pci', null);
  const [ondeReperfundir, setOndeReperfundir] = usePersistedState('sca_onde_reperfundir', null);
  const [reperfusaoTipo, setReperfusaoTipo] = usePersistedState('sca_reperfusao_tipo', null);
  const [cathLabAtivado, setCathLabAtivado] = usePersistedState('sca_cathlab', false);
  const [contraindicacoes, setContraindicacoes] = usePersistedState('sca_contras_fib', {});
  const [tnkAdministrado, setTnkAdministrado] = usePersistedState('sca_tnk', false);

  // Desfecho / alta
  const [alta, setAlta] = usePersistedState('sca_alta', ALTA_PADRAO);
  const [anotacao, setAnotacao] = usePersistedState('sca_anotacao', '');
  const [anotacaoEditadaEm, setAnotacaoEditadaEm] = usePersistedState('sca_anotacao_em', null);
  const [observacoes, setObservacoes] = usePersistedState('sca_observacoes', '');

  // Eventos (timeline real)
  const [eventos, setEventos] = usePersistedState('sca_eventos', []);

  // ============================================================
  // AÇÕES
  // ============================================================
  const registrarEvento = (acao, tag = '') => {
    setEventos((evs) => [...evs, { hora: Date.now(), acao, tag }]);
  };

  const iniciarProtocolo = () => {
    if (!iniciadoEm) setIniciadoEm(Date.now());
  };

  const irParaTela = (n) => {
    setTelaAtual(n);
    setTelaMaxVisitada((m) => Math.max(m || 1, n));
    if (n >= 2) iniciarProtocolo();
  };

  const toggleFlag = (key) => setFlags((f) => ({ ...f, [key]: !f[key] }));
  const toggleSinalOmi = (id) => setSinaisOmi((s) => ({ ...s, [id]: !s[id] }));
  const toggleAlta = (key) => setAlta((a) => ({ ...a, [key]: !a[key] }));
  const setContraindicacao = (key, val) => setContraindicacoes((c) => ({ ...c, [key]: val }));

  const setHeartItem = (id, val) => setHeart((h) => ({ ...h, [id]: val }));
  const setHearItem = (id, val) => setHear((h) => ({ ...h, [id]: val }));
  const toggleTimi = (id) => setTimi((t) => ({ ...t, [id]: !t[id] }));

  // Cronômetro porta-ECG · marcar realizado / reset (manual-start no flow).
  const marcarEcgRealizado = () => {
    setCronoPortaEcg((c) => {
      const fim = Date.now();
      const finalMs = c.iniciadoEm ? fim - c.iniciadoEm + (c.acumulado || 0) : (c.acumulado || 0);
      return { ...c, finalizadoEm: fim, finalMs };
    });
    registrarEvento('ECG realizado', 'ecg');
  };
  const iniciarCronoPortaEcg = () => setCronoPortaEcg({ ...CRONO_VAZIO, iniciadoEm: Date.now() });
  const resetCronoPortaEcg = () => setCronoPortaEcg(CRONO_VAZIO);

  const resetProtocol = () => {
    setIniciadoEm(null);
    setTelaAtual(1);
    setTelaMaxVisitada(1);
    setAbaAtual('executar');
    setPaciente(PACIENTE_PADRAO);
    setFlags(FLAGS_PADRAO);
    setEcgClasse(null);
    setStemiLocalizacao(null);
    setGateAvlChecado(false);
    setGateV7v9Checado(false);
    setSinaisOmi(SINAIS_OMI_PADRAO);
    setLockSoftOmiConfirmado(false);
    setEcgAnotacao('');
    setCronoPortaEcg(CRONO_VAZIO);
    setCronoEcgSeriado({ iniciadoEm: null });
    setCronoPortaBalao({ iniciadoEm: null });
    setCronoPortaAgulha({ iniciadoEm: null });
    setEscoreEscolhido(setupEscore === 'timi' ? 'timi' : 'heart');
    setHeart(HEART_PADRAO);
    setTimi(TIMI_PADRAO);
    setHear(HEAR_PADRAO);
    setTropInicial(null);
    setTropSeriada(null);
    setTropPulada(false);
    setAasAdministrado(false);
    setP2y12Escolhido(null);
    setTempoPCI(null);
    setOndeReperfundir(null);
    setReperfusaoTipo(null);
    setCathLabAtivado(false);
    setContraindicacoes({});
    setTnkAdministrado(false);
    setAlta(ALTA_PADRAO);
    setAnotacao('');
    setAnotacaoEditadaEm(null);
    setObservacoes('');
    setEventos([]);
  };

  return {
    // sessão
    iniciadoEm, telaAtual, telaMaxVisitada, abaAtual,
    setTelaAtual, setAbaAtual, irParaTela, iniciarProtocolo,
    // setup
    setupTrop, setupEscore, setupConfigurado,
    setSetupTrop, setSetupEscore, setSetupConfigurado,
    // paciente
    paciente, setPaciente, flags, setFlags, toggleFlag,
    // ecg
    ecgClasse, setEcgClasse, stemiLocalizacao, setStemiLocalizacao,
    gateAvlChecado, setGateAvlChecado, gateV7v9Checado, setGateV7v9Checado,
    sinaisOmi, setSinaisOmi, toggleSinalOmi,
    lockSoftOmiConfirmado, setLockSoftOmiConfirmado, ecgAnotacao, setEcgAnotacao,
    // cronômetros
    cronoPortaEcg, setCronoPortaEcg, iniciarCronoPortaEcg, marcarEcgRealizado, resetCronoPortaEcg,
    cronoEcgSeriado, setCronoEcgSeriado,
    cronoPortaBalao, setCronoPortaBalao, cronoPortaAgulha, setCronoPortaAgulha,
    // escores
    escoreEscolhido, setEscoreEscolhido,
    heart, setHeart, setHeartItem, timi, setTimi, toggleTimi, hear, setHear, setHearItem,
    // troponina
    tropInicial, setTropInicial, tropSeriada, setTropSeriada, tropPulada, setTropPulada,
    // conduta
    aasAdministrado, setAasAdministrado, p2y12Escolhido, setP2y12Escolhido,
    tempoPCI, setTempoPCI, ondeReperfundir, setOndeReperfundir,
    reperfusaoTipo, setReperfusaoTipo, cathLabAtivado, setCathLabAtivado,
    contraindicacoes, setContraindicacoes, setContraindicacao, tnkAdministrado, setTnkAdministrado,
    // alta / desfecho
    alta, setAlta, toggleAlta, anotacao, setAnotacao, anotacaoEditadaEm, setAnotacaoEditadaEm,
    observacoes, setObservacoes,
    // eventos
    eventos, registrarEvento,
    // fluxo
    resetProtocol,
  };
}
