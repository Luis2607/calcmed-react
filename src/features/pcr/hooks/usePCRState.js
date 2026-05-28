import { useState } from 'react';
import { usePersistedState } from '../../../shared/hooks/usePersistedState';
import { CICLO_MS, ANTI_DOUBLE_TAP_ADREN_MS, getAdrenalinaJanela } from '../pcrData';

/**
 * usePCRState — fonte única de verdade do PCR (golden pcr.js · paridade 1:1 com
 * mudanças B4/B6/B7 do Gustavo aplicadas).
 *
 * ⚠️ B4/B7: cicloAtual e cicloIniciadoEm SÓ mudam por ação manual (Checar pulso/
 *    Aplicar adrenalina/Recidiva). SEM auto-cicle 15s buffer.
 * ⚠️ B6: janela adrenalina EXATA no tempo selecionado (não [m-1, m+1]).
 */
export function usePCRState() {
  // ============================================================
  // SESSÃO / NAVEGAÇÃO
  // ============================================================
  const [iniciadoEm, setIniciadoEm] = usePersistedState('pcr_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('pcr_tela_atual', 1);
  const [abaAtual, setAbaAtual] = usePersistedState('pcr_aba_atual', 'executar');

  // ============================================================
  // COMPRESSÕES (ciclo · BPM · áudio)
  // ============================================================
  const [cicloAtual, setCicloAtual] = usePersistedState('pcr_ciclo_atual', 1);
  const [cicloIniciadoEm, setCicloIniciadoEm] = usePersistedState('pcr_ciclo_iniciado_em', null);
  const [bpm, setBpm] = usePersistedState('pcr_bpm', 110);
  const [audioOn, setAudioOn] = usePersistedState('pcr_audio_on', true);

  // ============================================================
  // RITMO E DESFIBRILAÇÃO
  // ============================================================
  const [ritmo, setRitmoRaw] = usePersistedState('pcr_ritmo', 'na');
  const [desfibrilado, setDesfibrilado] = usePersistedState('pcr_desfibrilado', false);

  // ============================================================
  // ADRENALINA
  // ============================================================
  const [intervaloAdrenalinaMin, setIntervaloAdrenalinaMin] = usePersistedState('pcr_intervalo_adren_min', 3);
  const [ultimaAdrenalinaEm, setUltimaAdrenalinaEm] = usePersistedState('pcr_ultima_adren_em', null);
  const [adrenalinaCount, setAdrenalinaCount] = usePersistedState('pcr_adren_count', 0);

  // ============================================================
  // RCE
  // ============================================================
  const [rce, setRce] = usePersistedState('pcr_rce', false);
  const [recidiva, setRecidiva] = usePersistedState('pcr_recidiva', false);
  const [rceCriterios, setRceCriterios] = usePersistedState('pcr_rce_criterios', []);

  // ============================================================
  // EVENTOS (timeline)
  // ============================================================
  const [eventos, setEventos] = usePersistedState('pcr_eventos', []);

  // ============================================================
  // PACIENTE (T4 form)
  // ============================================================
  const [paciente, setPaciente] = usePersistedState('pcr_paciente', {
    iniciais: null,
    idadeAnos: null,
    idadeMeses: null,
    // §A5 (Luis) · altura REMOVIDA do T4 form — só pra peso predito ARDSnet via VCV adulto modal.
    sexo: 'ni',
    desfecho: 'revertida',
    obs: '',
  });

  // Pediatria/Cargas (top-level pra sincronizar entre T4 + Cargas/Doses + VCV)
  const [peso, setPeso] = usePersistedState('pcr_peso', null);
  const [altura, setAltura] = usePersistedState('pcr_altura', null); // só VCV adulto
  const [idade, setIdade] = usePersistedState('pcr_idade', null);
  const [sexo, setSexo] = usePersistedState('pcr_sexo', null);

  // ============================================================
  // ANOTAÇÃO
  // ============================================================
  const [anotacao, setAnotacao] = usePersistedState('pcr_anotacao', '');
  const [anotacaoEditadaEm, setAnotacaoEditadaEm] = usePersistedState('pcr_anotacao_editada_em', null);

  // ============================================================
  // ACLS|AHA tab (§A7 · Panfletos → Fluxogramas)
  // ============================================================
  const [teoriaSubAtiva, setTeoriaSubAtiva] = usePersistedState('pcr_teoria_sub', 'fluxogramas');
  const [teoriaAP, setTeoriaAP] = usePersistedState('pcr_teoria_ap', 'adulto');

  // ============================================================
  // TTS flags anti-spam (resetam a cada ciclo novo · pcr.js linha 100)
  // Não-persistidas (in-memory) — reset ao reload é OK pra anti-spam.
  // ============================================================
  const [avisou30s, setAvisou30s] = useState(false);
  const [avisouAdrenJanela, setAvisouAdrenJanela] = useState(false);
  const [avisouAdrenAtrasada, setAvisouAdrenAtrasada] = useState(false);

  // ============================================================
  // DERIVADOS
  // ============================================================
  const janelaAdren = getAdrenalinaJanela(intervaloAdrenalinaMin);

  // ============================================================
  // AÇÕES — todas registram evento + persistem estado (B7: ações manuais).
  // ============================================================
  const registrarEvento = (acao, tag = '') => {
    setEventos((evs) => [...evs, { hora: Date.now(), acao, tag }]);
  };

  const iniciarPCR = () => {
    const now = Date.now();
    setIniciadoEm(now);
    setCicloIniciadoEm(now);
    setCicloAtual(1);
    setTelaAtual(2);
    setAvisou30s(false);
    setAvisouAdrenJanela(false);
    setAvisouAdrenAtrasada(false);
    registrarEvento('PCR iniciada', '');
  };

  const irParaTela = (n) => {
    setTelaAtual(n);
  };

  // §B4/B7 · ciclo INCREMENTA SÓ por ação manual de checar pulso/ritmo.
  // Pcr.js golden tinha auto-cicle a cada CICLO_MS+15s. Removido.
  const checarPulsoRitmoConfirmado = () => {
    const now = Date.now();
    setCicloAtual((c) => c + 1);
    setCicloIniciadoEm(now);
    setAvisou30s(false);
    setAvisouAdrenJanela(false);
    setAvisouAdrenAtrasada(false);
    registrarEvento(`Ciclo ${cicloAtual + 1} iniciado · pulso/ritmo checados`, '');
  };

  const setRitmo = (novoRitmo) => {
    setRitmoRaw(novoRitmo);
    registrarEvento(`Ritmo: ${novoRitmo.toUpperCase()}`, '');
  };

  const aplicarAdrenalina = () => {
    const now = Date.now();
    setUltimaAdrenalinaEm(now);
    setAdrenalinaCount((c) => c + 1);
    setAvisouAdrenJanela(false);
    setAvisouAdrenAtrasada(false);
    registrarEvento(`Adrenalina ×${adrenalinaCount + 1} · 1 mg IV/IO`, 'droga');
  };

  /** Anti-double-tap: retorna true se última dose < 30s atrás (modal confirm). */
  const adrenalinaDoubleTap = () => {
    if (!ultimaAdrenalinaEm) return false;
    return Date.now() - ultimaAdrenalinaEm < ANTI_DOUBLE_TAP_ADREN_MS;
  };

  const registrarChoque = (cargaLabel = '200 J') => {
    setDesfibrilado(true);
    registrarEvento(`Choque ${cargaLabel} · ${ritmo.toUpperCase()}`, 'choque');
  };

  const confirmarRCE = (criterios = []) => {
    setRce(true);
    setRecidiva(false);
    setRceCriterios(criterios);
    setTelaAtual(3);
    registrarEvento(`RCE confirmado · ${criterios.length}/3 critérios`, 'rce');
  };

  const registrarRecidiva = () => {
    const now = Date.now();
    setRce(false);
    setRecidiva(true);
    setCicloAtual((c) => c + 1);
    setCicloIniciadoEm(now);
    setAvisou30s(false);
    setAvisouAdrenJanela(false);
    setAvisouAdrenAtrasada(false);
    setTelaAtual(2);
    registrarEvento('RECIDIVA · nova parada', 'marco');
  };

  const encerrarSemRCE = (motivo) => {
    const labels = {
      obito: 'Óbito declarado',
      suspensa: 'Suspensa por decisão clínica',
    };
    setTelaAtual(4);
    setPaciente((p) => ({ ...p, desfecho: motivo === 'obito' ? 'obito' : 'suspensa' }));
    registrarEvento(`PCR encerrada · ${labels[motivo] || motivo}`, 'critico');
  };

  const resetarEstado = () => {
    setIniciadoEm(null);
    setTelaAtual(1);
    setAbaAtual('executar');
    setCicloAtual(1);
    setCicloIniciadoEm(null);
    setBpm(110);
    setAudioOn(true);
    setRitmoRaw('na');
    setDesfibrilado(false);
    setIntervaloAdrenalinaMin(3);
    setUltimaAdrenalinaEm(null);
    setAdrenalinaCount(0);
    setRce(false);
    setRecidiva(false);
    setRceCriterios([]);
    setEventos([]);
    setPaciente({ iniciais: null, idadeAnos: null, idadeMeses: null, sexo: 'ni', desfecho: 'revertida', obs: '' });
    setPeso(null);
    setAltura(null);
    setIdade(null);
    setSexo(null);
    setAnotacao('');
    setAnotacaoEditadaEm(null);
    setAvisou30s(false);
    setAvisouAdrenJanela(false);
    setAvisouAdrenAtrasada(false);
  };

  const toggleAudio = () => setAudioOn((on) => !on);

  return {
    // sessão
    iniciadoEm, telaAtual, abaAtual,
    setTelaAtual, setAbaAtual, irParaTela,
    // compressões
    cicloAtual, cicloIniciadoEm, bpm, audioOn,
    setBpm, toggleAudio, checarPulsoRitmoConfirmado,
    // ritmo
    ritmo, desfibrilado, setRitmo, registrarChoque,
    // adrenalina
    intervaloAdrenalinaMin, ultimaAdrenalinaEm, adrenalinaCount,
    setIntervaloAdrenalinaMin, aplicarAdrenalina, adrenalinaDoubleTap, janelaAdren,
    // rce
    rce, recidiva, rceCriterios, confirmarRCE, registrarRecidiva, encerrarSemRCE,
    // eventos
    eventos, registrarEvento,
    // paciente
    paciente, setPaciente,
    peso, setPeso, altura, setAltura, idade, setIdade, sexo, setSexo,
    // anotação
    anotacao, anotacaoEditadaEm, setAnotacao, setAnotacaoEditadaEm,
    // acls|aha
    teoriaSubAtiva, teoriaAP, setTeoriaSubAtiva, setTeoriaAP,
    // tts flags
    avisou30s, avisouAdrenJanela, avisouAdrenAtrasada,
    setAvisou30s, setAvisouAdrenJanela, setAvisouAdrenAtrasada,
    // fluxo
    iniciarPCR, resetarEstado,
    // constantes derivadas
    CICLO_MS,
  };
}
