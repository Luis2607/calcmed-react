import { usePersistedState } from '../../../shared/hooks/usePersistedState';
import {
  parseNum,
  formatarHorario,
  janelaMinDe,
  nihssTotal as calcNihssTotal,
  nihssGravidade as calcNihssGravidade,
  avaliarElegibilidade,
  calcularDose,
  metaPA as calcMetaPA,
  NIHSS_TOTAL_PASSOS,
  PESO_MIN,
  PESO_MAX,
} from '../avcData';

/**
 * Estado clínico do protocolo AVC — porte 1:1 do golden avc.js (objeto `estado`).
 * Chaves React `avc_*` por campo (não usa o blob `avc_protocolo_atual` do golden,
 * evitando colisão com o iframe golden durante o QA lado-a-lado — mesmo padrão Sepse).
 */
export function useAVCState() {
  // Sessão / navegação
  const [iniciadoEm, setIniciadoEm] = usePersistedState('avc_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('avc_tela_atual', 1);
  const [telaMaxVisitada, setTelaMaxVisitada] = usePersistedState('avc_tela_max', 1);
  const [abaAtual, setAbaAtual] = usePersistedState('avc_aba_atual', 'executar');

  // T1 · Triagem
  const [sintomasPresenciado, setSintomasPresenciado] = usePersistedState('avc_sintomas', null);
  const [horarioInicio, setHorarioInicioRaw] = usePersistedState('avc_horario', '');
  // diasAtras: 0 = hoje, 1 = ontem, 2 = anteontem (para permitir janelas >24h).
  const [horarioDiasAtras, setHorarioDiasAtras] = usePersistedState('avc_horario_dias_atras', 0);
  const [janelaMin, setJanelaMin] = usePersistedState('avc_janela_min', null);
  const [cincinnati, setCincinnati] = usePersistedState('avc_cincinnati', { face: null, braco: null, fala: null });
  const [bypassUsado, setBypassUsado] = usePersistedState('avc_bypass_usado', false);
  const [janelaConfirmada, setJanelaConfirmada] = usePersistedState('avc_janela_confirmada', false);

  // T2 · NIHSS (scores por índice de opção · domínio atual do wizard)
  const [nihssScores, setNihssScores] = usePersistedState('avc_nihss_scores', {});
  const [nihssDominio, setNihssDominio] = usePersistedState('avc_nihss_dominio', 1);

  // T3 · Elegibilidade
  const [contras, setContras] = usePersistedState('avc_contras', { absolutas: [], patologia: [], relativas: [] });
  const [pas, setPas] = usePersistedState('avc_pas', '');
  const [pad, setPad] = usePersistedState('avc_pad', '');

  // T4 · Posologia
  const [peso, setPeso] = usePersistedState('avc_peso', '');
  const [pesoEstimado, setPesoEstimado] = usePersistedState('avc_peso_estimado', null);
  const [trombolitico, setTrombolitico] = usePersistedState('avc_trombolitico', 'tnk');

  // T5 · Monitoramento
  const [paAfericoes, setPaAfericoes] = usePersistedState('avc_pa_afericoes', []);
  const [glicemia, setGlicemia] = usePersistedState('avc_glicemia', '');
  const [disfagia, setDisfagia] = usePersistedState('avc_disfagia', null);
  const [iniciais, setIniciais] = usePersistedState('avc_iniciais', '');

  // T6 · Trombectomia
  const [trombecVaso, setTrombecVaso] = usePersistedState('avc_trombec_vaso', null);
  const [trombecAspects, setTrombecAspects] = usePersistedState('avc_trombec_aspects', '');
  const [trombecMRS, setTrombecMRS] = usePersistedState('avc_trombec_mrs', null);

  // Desvio + eventos + anotação
  const [hemorragico, setHemorragico] = usePersistedState('avc_hemorragico', false);
  const [eventos, setEventos] = usePersistedState('avc_eventos', []);
  const [anotacao, setAnotacao] = usePersistedState('avc_anotacao', '');
  const [anotacaoEditadaEm, setAnotacaoEditadaEm] = usePersistedState('avc_anotacao_em', null);

  // ============================================================
  // DERIVADOS (lógica clínica pura · via avcData)
  // ============================================================
  const numPeso = peso !== '' && !isNaN(parseNum(peso)) ? parseNum(peso) : null;
  const numPas = pas !== '' ? parseInt(pas, 10) : null;
  const numPad = pad !== '' ? parseInt(pad, 10) : null;
  const numAspects = trombecAspects !== '' && !isNaN(parseInt(trombecAspects, 10)) ? parseInt(trombecAspects, 10) : null;

  const nihssTotal = calcNihssTotal(nihssScores);
  const nihssGravidade = calcNihssGravidade(nihssTotal);
  const elegibilidade = avaliarElegibilidade(contras);
  // Peso fora da faixa fisiológica não calcula dose (golden onPesoInput).
  const pesoValido = numPeso != null && numPeso >= PESO_MIN && numPeso <= PESO_MAX;
  const dose = pesoValido ? calcularDose(numPeso, trombolitico) : null;
  const doseTotal = dose ? dose.doseTotal : null;
  const meta = calcMetaPA({ hemorragico, doseTotal, trombolitico });

  const cincinnatiAlterados = Object.values(cincinnati).filter((v) => v === 'alterado').length;
  const cincinnatiRespondidos = Object.values(cincinnati).filter((v) => v !== null).length;

  // ============================================================
  // AÇÕES
  // ============================================================
  const marcarInicio = () => { if (!iniciadoEm) setIniciadoEm(Date.now()); };

  const registrarEvento = (acao, tag) => {
    setEventos((prev) => [...(prev || []), { hora: Date.now(), acao, tag: tag || '' }]);
  };

  const irParaTela = (n) => {
    setTelaAtual(n);
    setTelaMaxVisitada((prev) => Math.max(prev || 0, n));
  };

  // Horário: formata + recalcula janela (snapshot, golden onHorarioInput).
  const setHorarioInicio = (raw) => {
    const v = formatarHorario(raw);
    setHorarioInicioRaw(v);
    setJanelaMin(janelaMinDe(v, horarioDiasAtras));
  };

  // Muda o deslocamento de dias e recalcula a janela imediatamente.
  const setDiasAtras = (dias) => {
    setHorarioDiasAtras(dias);
    setJanelaMin(janelaMinDe(horarioInicio, dias));
  };

  // Cincinnati: marca início no 1º sinal alterado + abre Código AVC na timeline.
  const setCincinnatiItem = (item, valor) => {
    setCincinnati((prev) => {
      const next = { ...prev, [item]: valor };
      const alterados = Object.values(next).filter((v) => v === 'alterado').length;
      if (alterados >= 1 && !iniciadoEm) {
        setIniciadoEm(Date.now());
        registrarEvento('Protocolo AVC aberto · Cincinnati positivo', 'abertura');
      }
      return next;
    });
  };

  // NIHSS: seleciona índice da opção do domínio.
  const setNihssIdx = (domainId, idx) => {
    marcarInicio();
    setNihssScores((prev) => ({ ...prev, [domainId]: idx }));
  };
  const nihssAvancar = () => setNihssDominio((prev) => Math.min(NIHSS_TOTAL_PASSOS, prev + 1));
  const nihssVoltar = () => setNihssDominio((prev) => Math.max(1, prev - 1));

  // Contraindicações: toggle por grupo.
  const toggleContra = (grupo, key) => {
    setContras((prev) => {
      const atual = prev[grupo] || [];
      const next = atual.includes(key) ? atual.filter((k) => k !== key) : [...atual, key];
      return { ...prev, [grupo]: next };
    });
  };

  // Peso digitado manualmente → limpa flag de estimado.
  const setPesoManual = (v) => {
    setPeso(v);
    setPesoEstimado(null);
  };
  const setPesoPorBiotipo = (pesoKg, biotipo) => {
    setPeso(String(pesoKg));
    setPesoEstimado(biotipo);
    registrarEvento(`Peso estimado: ${biotipo} · ${pesoKg} kg`, 't4');
  };

  // Registrar aferição de PA no monitoramento.
  const registrarPA = (pasV, padV) => {
    setPaAfericoes((prev) => [...(prev || []), { hora: Date.now(), pas: pasV, pad: padV }]);
    registrarEvento(`PA ${pasV}/${padV} mmHg`, 'pa');
  };

  const definirDisfagia = (valor) => {
    setDisfagia(valor);
    if (valor === 'aprovado') registrarEvento('Deglutição aprovada · dieta liberada', 'disfagia');
    if (valor === 'falhou') registrarEvento('Deglutição falhou · dieta zero · fonoaudiologia', 'disfagia');
  };

  const ativarHemorragico = () => {
    setHemorragico(true);
    registrarEvento('TC: hemorragia intraparenquimatosa · desvio fluxo', 'hemorragico');
  };

  const resetProtocol = () => {
    setIniciadoEm(null); setTelaAtual(1); setTelaMaxVisitada(1); setAbaAtual('executar');
    setSintomasPresenciado(null); setHorarioInicioRaw(''); setHorarioDiasAtras(0); setJanelaMin(null);
    setCincinnati({ face: null, braco: null, fala: null });
    setBypassUsado(false); setJanelaConfirmada(false);
    setNihssScores({}); setNihssDominio(1);
    setContras({ absolutas: [], patologia: [], relativas: [] }); setPas(''); setPad('');
    setPeso(''); setPesoEstimado(null); setTrombolitico('tnk');
    setPaAfericoes([]); setGlicemia(''); setDisfagia(null); setIniciais('');
    setTrombecVaso(null); setTrombecAspects(''); setTrombecMRS(null);
    setHemorragico(false); setEventos([]);
    setAnotacao(''); setAnotacaoEditadaEm(null);
  };

  return {
    // sessão / nav
    iniciadoEm, setIniciadoEm, marcarInicio,
    telaAtual, setTelaAtual, telaMaxVisitada, irParaTela,
    abaAtual, setAbaAtual,
    // T1
    sintomasPresenciado, setSintomasPresenciado,
    horarioInicio, setHorarioInicio,
    horarioDiasAtras, setDiasAtras,
    janelaMin, setJanelaMin,
    cincinnati, setCincinnatiItem, cincinnatiAlterados, cincinnatiRespondidos,
    bypassUsado, setBypassUsado,
    janelaConfirmada, setJanelaConfirmada,
    // T2
    nihssScores, setNihssIdx, nihssDominio, setNihssDominio, nihssAvancar, nihssVoltar,
    nihssTotal, nihssGravidade,
    // T3
    contras, toggleContra, pas, setPas, pad, setPad, numPas, numPad,
    elegibilidade,
    // T4
    peso, setPesoManual, setPesoPorBiotipo, pesoEstimado, numPeso, pesoValido,
    trombolitico, setTrombolitico, dose, doseTotal,
    // T5
    paAfericoes, registrarPA, glicemia, setGlicemia,
    disfagia, definirDisfagia, iniciais, setIniciais, meta,
    // T6
    trombecVaso, setTrombecVaso, trombecAspects, setTrombecAspects, numAspects,
    trombecMRS, setTrombecMRS,
    // desvio / eventos / anotação
    hemorragico, ativarHemorragico,
    eventos, registrarEvento,
    anotacao, setAnotacao, anotacaoEditadaEm, setAnotacaoEditadaEm,
    // ciclo
    resetProtocol,
  };
}
