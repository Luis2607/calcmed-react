import { usePersistedState } from '../../../shared/hooks/usePersistedState';

export function useCADState() {
  const [iniciadoEm, setIniciadoEm] = usePersistedState('cad_iniciado_em', null);
  const [telaAtual, setTelaAtual] = usePersistedState('cad_tela_atual', 1);
  
  // T1 inputs
  const [idade, setIdade] = usePersistedState('cad_idade', '');
  const [peso, setPeso] = usePersistedState('cad_peso', '');
  const [glicemia, setGlicemia] = usePersistedState('cad_glicemia', '');
  const [acidoseConfirmada, setAcidoseConfirmada] = usePersistedState('cad_acidose_confirmada', false);
  const [cetoseConfirmada, setCetoseConfirmada] = usePersistedState('cad_cetose_confirmada', false);

  // T2 inputs
  const [sodio, setSodio] = usePersistedState('cad_sodio', '');
  const [potassio, setPotassio] = usePersistedState('cad_potassio', ''); // 'baixo' | 'normal' | 'alto' | 'muito-alto'
  const [aguardoKIniciadoEm, setAguardoKIniciadoEm] = usePersistedState('cad_aguardo_k_iniciado', null);
  
  // T3 inputs
  const [bolus, setBolus] = usePersistedState('cad_bolus', false);
  const [insulinaIniciada, setInsulinaIniciada] = usePersistedState('cad_insulina_iniciada', null);

  // T4 measures & timing
  const [medidas, setMedidas] = usePersistedState('cad_medidas', []);
  const [proximoHGTSeconds, setProximoHGTSeconds] = usePersistedState('cad_proximo_hgt_seconds', 3600); // 60 min

  // T5 criteria checklist
  const [resolucaoHgt, setResolucaoHgt] = usePersistedState('cad_resolucao_hgt', false);
  const [resolucaoHco3, setResolucaoHco3] = usePersistedState('cad_resolucao_hco3', false);
  const [resolucaoAg, setResolucaoAg] = usePersistedState('cad_resolucao_ag', false);

  // T6 finalization
  const [iniciais, setIniciais] = usePersistedState('cad_iniciais', '');

  // ============================================================
  // DERIVED STATES (LÓGICA CLÍNICA)
  // ============================================================
  
  const numIdade = idade !== '' ? Number(idade) : null;
  const numPeso = peso !== '' ? Number(peso) : null;
  const numGlicemia = glicemia !== '' ? Number(glicemia) : null;
  const numSodio = sodio !== '' ? Number(sodio) : null;

  // D22: Inferência de modo por idade
  const isPediatric = numIdade !== null && numIdade < 18;
  const isCriticalPediatric = numIdade !== null && numIdade < 5; // risco edema cerebral
  
  const modoLabel = isCriticalPediatric 
    ? 'Pediátrico < 5a' 
    : isPediatric 
      ? 'Pediátrico' 
      : numIdade !== null 
        ? 'Adulto' 
        : '';

  const modoKey = isCriticalPediatric 
    ? 'pediatrico-extra' 
    : isPediatric 
      ? 'pediatrico' 
      : 'adulto';

  // Critérios diagnósticos (2 de 3 confirma)
  let criteriosAtendidosCount = 0;
  if (numGlicemia && numGlicemia > 200) criteriosAtendidosCount++;
  if (acidoseConfirmada) criteriosAtendidosCount++;
  if (cetoseConfirmada) criteriosAtendidosCount++;

  const isDiagnosisConfirmed = numIdade !== null && numPeso !== null && criteriosAtendidosCount >= 2;

  // Sódio Corrigido (fator 2.4 se glicemia >= 400, senão 1.6)
  const fatorSodio = numGlicemia >= 400 ? 2.4 : 1.6;
  const sodioCorrigido = numSodio && numGlicemia
    ? numSodio + fatorSodio * ((numGlicemia - 100) / 100)
    : null;

  // Trava do Gate K (insulina contraindicada se K < 3.5)
  const isInsulinBlocked = potassio === 'baixo';

  // Dose da Bomba de Insulina (0.1 U/kg/h)
  const calculatedInsulinDose = numPeso ? (numPeso * 0.1).toFixed(1) : '0';

  // Reset do protocolo
  const resetProtocol = () => {
    setIniciadoEm(null);
    setTelaAtual(1);
    setIdade('');
    setPeso('');
    setGlicemia('');
    setAcidoseConfirmada(false);
    setCetoseConfirmada(false);
    setSodio('');
    setPotassio('');
    setAguardoKIniciadoEm(null);
    setBolus(false);
    setInsulinaIniciada(null);
    setMedidas([]);
    setProximoHGTSeconds(3600);
    setResolucaoHgt(false);
    setResolucaoHco3(false);
    setResolucaoAg(false);
    setIniciais('');
  };

  return {
    iniciadoEm, setIniciadoEm,
    telaAtual, setTelaAtual,
    idade, setIdade,
    peso, setPeso,
    glicemia, setGlicemia,
    acidoseConfirmada, setAcidoseConfirmada,
    cetoseConfirmada, setCetoseConfirmada,
    sodio, setSodio,
    potassio, setPotassio,
    aguardoKIniciadoEm, setAguardoKIniciadoEm,
    bolus, setBolus,
    insulinaIniciada, setInsulinaIniciada,
    medidas, setMedidas,
    proximoHGTSeconds, setProximoHGTSeconds,
    resolucaoHgt, setResolucaoHgt,
    resolucaoHco3, setResolucaoHco3,
    resolucaoAg, setResolucaoAg,
    iniciais, setIniciais,
    
    // Derived values
    isPediatric,
    isCriticalPediatric,
    modoLabel,
    modoKey,
    criteriosAtendidosCount,
    isDiagnosisConfirmed,
    sodioCorrigido,
    isInsulinBlocked,
    calculatedInsulinDose,
    
    resetProtocol
  };
}
