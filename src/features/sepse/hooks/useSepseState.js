import { usePersistedState } from '../../../shared/hooks/usePersistedState';
import {
  parseNum,
  totalScoreAtivo as calcTotalScoreAtivo,
  statusScoreAtivo as calcStatusScoreAtivo,
  calcularPesoAjustado,
  calcularVolume,
  BUNDLE_PRIMEIRA_HORA,
  BUNDLE_ACOMPANHAMENTO,
  BUNDLE_TIMELINE_LABEL,
} from '../sepseData';

/**
 * Estado clínico do protocolo Sepse — porte 1:1 do golden sepse.js.
 * Chaves React `sepse_*` por campo (não usa o blob `sepse_protocolo_atual` do golden,
 * evitando colisão com o iframe golden durante o QA lado-a-lado).
 */
export function useSepseState() {
  // Navegação / sessão
  const [iniciadoEm, setIniciadoEm] = usePersistedState('sepse_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('sepse_tela_atual', 1);
  const [telaMaxVisitada, setTelaMaxVisitada] = usePersistedState('sepse_tela_max', 1);
  const [abaAtual, setAbaAtual] = usePersistedState('sepse_aba_atual', 'executar');

  // Paciente (T2)
  const [idade, setIdade] = usePersistedState('sepse_idade', '');
  const [peso, setPeso] = usePersistedState('sepse_peso', '');
  const [altura, setAltura] = usePersistedState('sepse_altura', '');
  const [sexo, setSexo] = usePersistedState('sepse_sexo', null); // 'masc' | 'fem'
  const [imcObeso, setImcObeso] = usePersistedState('sepse_imc_obeso', false);

  // Marcadores clínicos (sem input no golden — só dev/header)
  const [pam, setPam] = usePersistedState('sepse_pam', null);
  const [lactato, setLactato] = usePersistedState('sepse_lactato', null);

  // T1 · escores
  const [scoreAtivo, setScoreAtivo] = usePersistedState('sepse_score_ativo', 'sofa');
  const [sofa, setSofa] = usePersistedState('sepse_sofa', {}); // {sistema: idx}
  const [sirs, setSirs] = usePersistedState('sepse_sirs', {}); // {temp,fc,fr,leuco: bool}
  const [news, setNews] = usePersistedState('sepse_news', { versao: 'news2' });
  const [mews, setMews] = usePersistedState('sepse_mews', {});
  const [classificacao, setClassificacao] = usePersistedState('sepse_classificacao', null);
  const [vereditoEm, setVereditoEm] = usePersistedState('sepse_veredito_em', null);
  const [eventos, setEventos] = usePersistedState('sepse_eventos', []);

  // T2 · bundle
  const [bundle, setBundle] = usePersistedState('sepse_bundle', {});
  const [horaAtb, setHoraAtb] = usePersistedState('sepse_hora_atb', null);

  // T3 · ATB
  const [foco, setFoco] = usePersistedState('sepse_foco', null);
  const [riscoMrsa, setRiscoMrsa] = usePersistedState('sepse_risco_mrsa', {});
  const [riscoMdr, setRiscoMdr] = usePersistedState('sepse_risco_mdr', {});

  // T4 · vasopressores (dose = string do input; ativa = painel revelado)
  const [neDose, setNeDose] = usePersistedState('sepse_ne_dose', '0,10');
  const [neAtiva, setNeAtiva] = usePersistedState('sepse_ne_ativa', false);
  const [vasoAtiva, setVasoAtiva] = usePersistedState('sepse_vaso_ativa', false);
  const [epiDose, setEpiDose] = usePersistedState('sepse_epi_dose', '0,05');
  const [epiAtiva, setEpiAtiva] = usePersistedState('sepse_epi_ativa', false);
  const [dobDose, setDobDose] = usePersistedState('sepse_dob_dose', '5');
  const [dobAtiva, setDobAtiva] = usePersistedState('sepse_dob_ativa', false);
  const [hidroAtiva, setHidroAtiva] = usePersistedState('sepse_hidro_ativa', false);

  // T5 · metas + ICU
  const [metas, setMetas] = usePersistedState('sepse_metas', {}); // {key: bool}
  const [icu, setIcu] = usePersistedState('sepse_icu', {});

  // Anotação
  const [anotacao, setAnotacao] = usePersistedState('sepse_anotacao', '');
  const [anotacaoEditadaEm, setAnotacaoEditadaEm] = usePersistedState('sepse_anotacao_editada_em', null);

  // ============================================================
  // DERIVADOS (LÓGICA CLÍNICA — pura, via sepseData)
  // ============================================================
  const numIdade = idade !== '' ? Number(idade) : null;
  const numPeso = peso !== '' && !isNaN(parseNum(peso)) ? parseNum(peso) : null;
  const numAltura = altura !== '' && !isNaN(parseNum(altura)) ? parseNum(altura) : null;

  const estadoEscores = { sofa, sirs, news, mews };
  const total = calcTotalScoreAtivo(scoreAtivo, estadoEscores);
  const status = calcStatusScoreAtivo(scoreAtivo, total, estadoEscores);

  // Gate T1: score preenchido E veredito dado
  const tela1Liberada = total > 0 && !!classificacao;

  // Peso ajustado + volume (T2)
  const pesoAjustado = calcularPesoAjustado({ imcObeso, peso: numPeso, altura: numAltura, sexo });
  const volume = calcularVolume({ peso: numPeso, pesoAjustado });

  // Bundle progress
  const bundlePH = BUNDLE_PRIMEIRA_HORA.filter((k) => bundle[k]).length;
  const bundleAC = BUNDLE_ACOMPANHAMENTO.filter((k) => bundle[k]).length;
  const bundleTotal = BUNDLE_PRIMEIRA_HORA.length + BUNDLE_ACOMPANHAMENTO.length;
  const bundleFeitos = bundlePH + bundleAC;

  // Riscos ATB
  const mrsaN = Object.values(riscoMrsa).filter(Boolean).length;
  const mdrN = Object.values(riscoMdr).filter(Boolean).length;
  const mrsaAtivo = mrsaN >= 2;
  const mdrAtivo = mdrN >= 2;

  // Metas / ICU contadores
  const metasN = Object.values(metas).filter(Boolean).length;
  const icuN = Object.values(icu).filter(Boolean).length;

  // Marca início no 1º toque (espelha estado.iniciadoEm = Date.now())
  const marcarInicio = () => { if (!iniciadoEm) setIniciadoEm(Date.now()); };

  const registrarEvento = (acao, tag) => {
    setEventos((prev) => [...(prev || []), { hora: Date.now(), acao, tag: tag || '' }]);
  };

  // Veredito clínico → timeline (só se mudou)
  const definirVeredito = (valor) => {
    if (classificacao !== valor) {
      const labels = { definida: 'Sepse definida', provavel: 'Sepse provável', possivel: 'Sepse possível', improvavel: 'Sepse improvável' };
      registrarEvento(`Veredito: ${labels[valor] || valor}`, 'veredito');
    }
    setClassificacao(valor);
    setVereditoEm(new Date().toISOString());
  };

  // Setters de escore que marcam início
  const setSofaNivel = (key, idx) => {
    marcarInicio();
    setSofa((prev) => ({ ...prev, [key]: prev[key] === idx ? null : idx }));
  };
  const setNewsNivel = (key, idx) => {
    marcarInicio();
    setNews((prev) => ({ ...prev, [key]: prev[key] === idx ? null : idx }));
  };
  const setMewsNivel = (key, idx) => {
    marcarInicio();
    setMews((prev) => ({ ...prev, [key]: prev[key] === idx ? null : idx }));
  };
  const toggleSirs = (key) => {
    marcarInicio();
    setSirs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Bundle / riscos / metas / icu toggles
  // §11.H + auditoria 2026-05-28: itens-chave (hemocultura/lactato/cristaloide)
  // registram evento na timeline quando marcados (paridade golden).
  const toggleBundle = (key) => {
    marcarInicio();
    setBundle((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Registra evento só ao MARCAR (transição false→true) e só pros itens-chave.
      if (!prev[key] && BUNDLE_TIMELINE_LABEL[key]) {
        registrarEvento(BUNDLE_TIMELINE_LABEL[key], 'bundle');
      }
      return next;
    });
  };
  const toggleRiscoMrsa = (key) => setRiscoMrsa((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleRiscoMdr = (key) => setRiscoMdr((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleMeta = (key) => setMetas((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleIcu = (key) => setIcu((prev) => ({ ...prev, [key]: !prev[key] }));

  // Registrar hora do ATB (FB-18)
  const registrarHoraAtb = () => {
    marcarInicio();
    setHoraAtb(Date.now());
    setBundle((prev) => ({ ...prev, atb: true }));
  };

  // Toggle ATB com registro de hora — quando marca, seta hora; quando desmarca, limpa hora.
  // Usado pelo ChecklistBlock 1ª linha (golden: clicar item ATB também registra hora — §11.T2.6).
  const toggleAtbWithTime = () => {
    marcarInicio();
    if (bundle.atb) {
      setBundle((prev) => ({ ...prev, atb: false }));
      setHoraAtb(null);
    } else {
      setBundle((prev) => ({ ...prev, atb: true }));
      setHoraAtb(Date.now());
    }
  };

  // Ativar droga vaso (revela painel)
  const ativarDroga = (tipo) => {
    marcarInicio();
    if (tipo === 'ne') setNeAtiva(true);
    if (tipo === 'vaso') setVasoAtiva(true);
    if (tipo === 'epi') setEpiAtiva(true);
    if (tipo === 'dob') setDobAtiva(true);
    if (tipo === 'hidro') setHidroAtiva(true);
  };

  const irParaTela = (n) => {
    setTelaAtual(n);
    setTelaMaxVisitada((prev) => Math.max(prev || 0, n));
  };

  const resetProtocol = () => {
    setIniciadoEm(null); setTelaAtual(1); setTelaMaxVisitada(1); setAbaAtual('executar');
    setIdade(''); setPeso(''); setAltura(''); setSexo(null); setImcObeso(false);
    setPam(null); setLactato(null);
    setScoreAtivo('sofa'); setSofa({}); setSirs({}); setNews({ versao: 'news2' }); setMews({});
    setClassificacao(null); setVereditoEm(null); setEventos([]);
    setBundle({}); setHoraAtb(null);
    setFoco(null); setRiscoMrsa({}); setRiscoMdr({});
    setNeDose('0,10'); setNeAtiva(false); setVasoAtiva(false);
    setEpiDose('0,05'); setEpiAtiva(false); setDobDose('5'); setDobAtiva(false); setHidroAtiva(false);
    setMetas({}); setIcu({});
    setAnotacao(''); setAnotacaoEditadaEm(null);
  };

  return {
    // sessão / nav
    iniciadoEm, setIniciadoEm, marcarInicio,
    telaAtual, setTelaAtual, telaMaxVisitada, irParaTela,
    abaAtual, setAbaAtual,
    // paciente
    idade, setIdade, peso, setPeso, altura, setAltura, sexo, setSexo, imcObeso, setImcObeso,
    numIdade, numPeso, numAltura,
    pam, setPam, lactato, setLactato,
    // escores
    scoreAtivo, setScoreAtivo,
    sofa, setSofaNivel, sirs, toggleSirs, news, setNews, setNewsNivel, mews, setMewsNivel,
    classificacao, definirVeredito, vereditoEm,
    total, status, tela1Liberada,
    // eventos
    eventos, registrarEvento,
    // bundle
    bundle, toggleBundle, bundlePH, bundleAC, bundleFeitos, bundleTotal,
    horaAtb, registrarHoraAtb, toggleAtbWithTime,
    pesoAjustado, volume,
    // ATB
    foco, setFoco, riscoMrsa, toggleRiscoMrsa, riscoMdr, toggleRiscoMdr,
    mrsaN, mdrN, mrsaAtivo, mdrAtivo,
    // vaso
    neDose, setNeDose, neAtiva, vasoAtiva, epiDose, setEpiDose, epiAtiva,
    dobDose, setDobDose, dobAtiva, hidroAtiva, ativarDroga,
    // metas / icu
    metas, toggleMeta, metasN, icu, toggleIcu, icuN,
    // anotação
    anotacao, setAnotacao, anotacaoEditadaEm, setAnotacaoEditadaEm,
    // ciclo
    resetProtocol,
  };
}
