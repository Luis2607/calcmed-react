import { useEffect, useState } from 'react';
import { useCADState } from './hooks/useCADState';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { Button } from '../../shared/components/atoms/Button';
import { Checkbox } from '../../shared/components/atoms/Checkbox';
import { InputField } from '../../shared/components/molecules/InputField';
import { ResultDisplay } from '../../shared/components/molecules/ResultDisplay';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { InfoSheet, SelectSheet, ConfirmSheet } from '../../shared/components/overlays/patterns';
import { SheetText } from '../../shared/components/molecules/sheet';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader';
import { ProtocolSteps } from '../../shared/components/molecules/ProtocolSteps';

export function CADFlow({ onBack }) {
  const cadState = useCADState();
  const [historico, setHistorico] = usePersistedState('cad_historico', []);
  const [isKReplenishing, setIsKReplenishing] = useState(false);

  // Sheets state (padronizados via patterns)
  const [potassioSheetOpen, setPotassioSheetOpen] = useState(false);
  const [gateInfoOpen, setGateInfoOpen] = useState(false);
  const [sairOpen, setSairOpen] = useState(false);
  const {
    iniciadoEm,
    setIniciadoEm,
    telaAtual,
    proximoHGTSeconds,
    setProximoHGTSeconds,
    setPotassio,
  } = cadState;

  const [now, setNow] = useState(() => Date.now());

  // Time stamp tracker
  useEffect(() => {
    if (!iniciadoEm) {
      setIniciadoEm(Date.now());
    }
  }, [iniciadoEm, setIniciadoEm]);

  // Stop watch tick
  useEffect(() => {
    let interval = null;
    if (iniciadoEm) {
      interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [iniciadoEm]);

  // CAD Step 4 hourly reevaluation timer tick
  useEffect(() => {
    let interval = null;
    if (telaAtual === 4 && proximoHGTSeconds > 0) {
      interval = setInterval(() => {
        setProximoHGTSeconds(prev => {
          if (prev <= 1) {
            alert('Hora da reavaliação clínica! Colete glicemia capilar e gasometria.');
            return 3600; // Reset
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [telaAtual, proximoHGTSeconds, setProximoHGTSeconds]);

  // Elapsed time formatter
  const getElapsedTimeString = () => {
    const startedAt = Number(iniciadoEm);
    if (!Number.isFinite(startedAt) || startedAt <= 0) return '00:00';
    const diff = Math.max(0, now - startedAt);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (hours > 0) {
      return `${hours}h${String(minutes).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Reevaluation timer formatter
  const getTimerString = () => {
    const min = Math.floor(cadState.proximoHGTSeconds / 60);
    const sec = cadState.proximoHGTSeconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // KCl Replenishment simulation timer
  useEffect(() => {
    let interval = null;
    if (isKReplenishing) {
      interval = setTimeout(() => {
        setIsKReplenishing(false);
        setPotassio('normal'); // Simulate potassio restored to safe level
      }, 5000);
    }
    return () => clearTimeout(interval);
  }, [isKReplenishing, setPotassio]);

  // Handle case final save
  const handleSaveCase = () => {
    if (cadState.iniciais.trim() === '') {
      alert('Por favor, insira as iniciais do paciente.');
      return;
    }
    const elapsed = Math.max(0, Date.now() - Number(iniciadoEm || Date.now()));
    const elapsedH = Math.floor(elapsed / 3600000);
    const elapsedM = Math.floor((elapsed % 3600000) / 60000);
    const durationStr = elapsedH > 0 ? `${elapsedH}h ${elapsedM}m` : `${elapsedM} min`;

    const newCase = {
      id: Date.now().toString(),
      disease: 'CAD',
      initials: cadState.iniciais.toUpperCase(),
      date: new Date().toLocaleDateString('pt-BR'),
      duration: durationStr,
      status: 'Alta'
    };

    setHistorico([newCase, ...historico]);
    cadState.resetProtocol();
    onBack();
  };

  // D26 Weight chip visibility rule
  const shouldShowWeightChip = cadState.peso !== '' && (
    cadState.isPediatric || cadState.telaAtual >= 3
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', boxSizing: 'border-box' }}>
      
      <ProtocolHeader
        onBack={() => {
          const temDados = cadState.iniciadoEm || cadState.idade || cadState.peso;
          if (temDados) setSairOpen(true);
          else onBack();
        }}
        title="Protocolo CAD"
        subtitle="Cetoacidose Diabética"
        timer={getElapsedTimeString()}
        chips={cadState.idade !== '' ? [
          { label: cadState.modoLabel, tone: cadState.isCriticalPediatric ? 'critico' : cadState.isPediatric ? 'pediatria' : 'primario' },
          { label: `${cadState.idade}a`, mono: true },
          ...(shouldShowWeightChip ? [{ label: `${cadState.peso}kg`, mono: true }] : []),
        ] : []}
      />

      <ProtocolSteps
        steps={['Diagnóstico', 'Exames', 'Insulina', 'Controle', 'Alta', 'Fim']}
        current={cadState.telaAtual}
        onStepClick={(num) => cadState.setTelaAtual(num)}
      />

      {/* 📦 CONTEÚDO CLÍNICO DA TELA */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        
        {/* T1 — DIAGNÓSTICO E CRITÉRIOS */}
        {cadState.telaAtual === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionLabel>Dados de Triagem</SectionLabel>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <InputField 
                label="Idade"
                type="number"
                mono
                value={cadState.idade}
                onChange={cadState.setIdade}
                placeholder="Ex: 32"
                unit="anos"
                showUnit
              />
              <InputField 
                label="Peso"
                type="number"
                mono
                value={cadState.peso}
                onChange={cadState.setPeso}
                placeholder="Ex: 70"
                unit="kg"
                showUnit
              />
            </div>

            {/* D22 Pediatric Warnings */}
            {cadState.isCriticalPediatric && (
              <AlertCard level="critical" title="Aviso de Emergência Pediátrica">
                Paciente muito crítico (&lt; 5 anos). Alto risco de edema cerebral clínico. Monitore a escala de coma de Glasgow (GCS) de hora em hora.
              </AlertCard>
            )}

            <SectionLabel>Critérios Clínicos</SectionLabel>
            
            <InputField 
              label="Glicemia Capilar (HGT)"
              type="number"
              mono
              value={cadState.glicemia}
              onChange={cadState.setGlicemia}
              placeholder="Ex: 350"
              unit="mg/dL"
              showUnit
              state={cadState.glicemia !== '' && Number(cadState.glicemia) > 200 ? 'sucesso' : 'default'}
            />

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1.5px solid var(--ds-borda-sutil)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <Checkbox 
                label="Acidose confirmada (pH < 7,3 ou HCO₃ < 15)"
                checked={cadState.acidoseConfirmada}
                onChange={cadState.setAcidoseConfirmada}
              />
              <Checkbox 
                label="Cetose confirmada (BOHB ≥ 3 ou Cetonúria na fita)"
                checked={cadState.cetoseConfirmada}
                onChange={cadState.setCetoseConfirmada}
              />
            </div>

            {cadState.isDiagnosisConfirmed && (
              <AlertCard level="result" title="Diagnóstico de CAD Fechado">
                Critérios clínicos atendidos ({cadState.criteriosAtendidosCount}/3). O soro inicial sugerido é SF 0.9% 15 a 20 mL/kg na primeira hora.
              </AlertCard>
            )}

            <Button 
              disabled={!cadState.isDiagnosisConfirmed}
              onClick={() => cadState.setTelaAtual(2)}
              size="lg"
            >
              Confirmar Diagnóstico ({cadState.criteriosAtendidosCount}/3)
            </Button>
          </div>
        )}

        {/* T2 — EXAMES & GATE K */}
        {cadState.telaAtual === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionLabel>Eletrólitos</SectionLabel>
            
            <InputField 
              label="Sódio Sérico (Na)"
              type="number"
              mono
              value={cadState.sodio}
              onChange={cadState.setSodio}
              placeholder="Ex: 135"
              unit="mEq/L"
              showUnit
              helperText={cadState.sodioCorrigido ? `Sódio corrigido pela glicemia: ${cadState.sodioCorrigido.toFixed(1)} mEq/L` : 'Necessário para definir a diluição do soro subsequente.'}
            />

            <div style={{
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1px solid var(--ds-borda-padrao)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }} id="card-potassio">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ds-input-rotulo)' }}>
                  Potássio Sérico (K)
                </span>
                <button
                  type="button"
                  onClick={() => setGateInfoOpen(true)}
                  aria-label="Por que K bloqueia insulina?"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--ds-borda-padrao)',
                    color: 'var(--ds-texto-secundario)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >?</button>
              </div>

              <button
                type="button"
                onClick={() => setPotassioSheetOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--ds-borda-padrao)',
                  backgroundColor: 'var(--ds-fundo-superficie)',
                  color: cadState.potassio === '' ? 'var(--ds-texto-terciario)' : 'var(--ds-texto-padrao)',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  {cadState.potassio === ''
                    ? 'Escolher faixa de K…'
                    : cadState.potassio === 'baixo'
                      ? '< 3,5 mEq/L · crítico'
                      : cadState.potassio === 'normal'
                        ? '3,5 – 5,5 mEq/L · seguro'
                        : '> 5,5 mEq/L · monitorar'}
                </span>
                <span aria-hidden="true" style={{ color: 'var(--ds-texto-terciario)' }}>›</span>
              </button>
            </div>

            {/* TRAVA DO GATE K BLOQUEANTE */}
            {cadState.isInsulinBlocked && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AlertCard level="critical" title="NÃO INICIE INSULINA">
                  O potássio sérico está abaixo de 3,5 mEq/L. O início da insulina neste momento pode causar arritmias cardíacas fatais. Inicie a reposição de KCl.
                </AlertCard>

                <Button 
                  variant="danger"
                  onClick={() => setIsKReplenishing(true)}
                  disabled={isKReplenishing}
                >
                  {isKReplenishing ? 'Repondo KCl (Simulando 2h)...' : 'Iniciar Reposição de KCl'}
                </Button>
              </div>
            )}

            {!cadState.isInsulinBlocked && cadState.potassio !== '' && (
              <AlertCard level="result" title="Potássio Seguro">
                Potássio sérico está na faixa segura (&gt; 3.5 mEq/L). Liberado para iniciar infusão de insulina.
              </AlertCard>
            )}

            <Button 
              disabled={cadState.potassio === '' || cadState.isInsulinBlocked}
              onClick={() => cadState.setTelaAtual(3)}
              size="lg"
            >
              Avançar para Insulina
            </Button>
          </div>
        )}

        {/* T3 — PROGRAMAR INSULINA IV */}
        {cadState.telaAtual === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionLabel>Insulinoterapia IV</SectionLabel>
            
            <ResultDisplay 
              value={cadState.calculatedInsulinDose} 
              unit="U/h"
              label="Vazão da Bomba de Infusão"
              level="success"
            />

            <AlertCard level="info" title="Instruções de Preparo">
              Diluir 50 UI de Insulina Regular em 50 mL de SF 0,9% (Concentração de 1 UI/mL). Infundir em bomba na vazão indicada acima.
            </AlertCard>

            <div style={{
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1.5px solid var(--ds-borda-sutil)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <Checkbox 
                label="Dose de ataque (bolus 0.1 U/kg) opcional"
                checked={cadState.bolus}
                onChange={cadState.setBolus}
              />
            </div>

            <Button 
              onClick={() => {
                cadState.setInsulinaIniciada(Date.now());
                // Add event log
                cadState.setMedidas([{
                  id: Date.now().toString(),
                  hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  hgt: cadState.glicemia,
                  insulina: `${cadState.calculatedInsulinDose} U/h`
                }]);
                cadState.setTelaAtual(4);
              }}
              size="lg"
            >
              Iniciar Infusão
            </Button>
          </div>
        )}

        {/* T4 — CONTROLE HORÁRIO */}
        {cadState.telaAtual === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <SectionLabel>Próxima Reavaliação</SectionLabel>
              {/* Dev tools skip button */}
              <button 
                onClick={() => cadState.setProximoHGTSeconds(5)}
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--ds-retorno-atencao)',
                  backgroundColor: 'var(--ds-retorno-atencao-fundo)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                ⚡ Pular Tempo
              </button>
            </div>

            <div style={{
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1.5px solid var(--ds-borda-sutil)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--sombra-cartao)'
            }}>
              <span className="mono" style={{ fontSize: '48px', fontWeight: '700', color: 'var(--ds-texto-padrao)' }}>
                {getTimerString()}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ds-texto-secundario)', marginTop: '8px' }}>
                Colher novo HGT e gasometria ao zerar
              </span>
            </div>

            <SectionLabel>Log de Atendimento</SectionLabel>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cadState.medidas.map((med) => (
                <div 
                  key={med.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--ds-fundo-cartao)',
                    border: '1px solid var(--ds-borda-padrao)',
                    borderRadius: '8px'
                  }}
                >
                  <span className="mono" style={{ fontSize: '13px', fontWeight: '600' }}>{med.hora}</span>
                  <span className="mono" style={{ fontSize: '13px' }}>HGT: {med.hgt} mg/dL</span>
                  <span className="mono" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ds-retorno-sucesso)' }}>
                    Insulina: {med.insulina}
                  </span>
                </div>
              ))}
            </div>

            {/* Simula novo HGT coletado */}
            <Button 
              onClick={() => {
                const novoHgtVal = window.prompt('Insira a nova glicemia (HGT):', '220');
                if (novoHgtVal) {
                  const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  cadState.setMedidas([
                    ...cadState.medidas,
                    {
                      id: Date.now().toString(),
                      hora: nowStr,
                      hgt: novoHgtVal,
                      insulina: `${cadState.calculatedInsulinDose} U/h`
                    }
                  ]);
                  if (Number(novoHgtVal) < 200) {
                    alert('HGT abaixo de 200 mg/dL! O protocolo CAD está pronto para avançar para a resolução.');
                  }
                }
              }}
              variant="secondary"
            >
              Lançar Nova Medida
            </Button>

            <Button 
              onClick={() => cadState.setTelaAtual(5)}
              size="lg"
            >
              Avançar para Alta/Resolução
            </Button>
          </div>
        )}

        {/* T5 — CRITÉRIOS DE RESOLUÇÃO */}
        {cadState.telaAtual === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionLabel>Critérios de Resolução da CAD</SectionLabel>
            
            <AlertCard level="info" title="Instruções Clínicas">
              Marque os critérios abaixo para liberar o encerramento do protocolo e a transição para insulina subcutânea.
            </AlertCard>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1.5px solid var(--ds-borda-sutil)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <Checkbox 
                label="Glicemia controlada (HGT < 200 mg/dL)"
                checked={cadState.resolucaoHgt}
                onChange={cadState.setResolucaoHgt}
              />
              <Checkbox 
                label="Bicarbonato de sódio seguro (HCO₃ ≥ 15 mEq/L)"
                checked={cadState.resolucaoHco3}
                onChange={cadState.setResolucaoHco3}
              />
              <Checkbox 
                label="Ânion gap normalizado (AG ≤ 12 mEq/L)"
                checked={cadState.resolucaoAg}
                onChange={cadState.setResolucaoAg}
              />
            </div>

            {cadState.resolucaoHgt && cadState.resolucaoHco3 && cadState.resolucaoAg && (
              <AlertCard level="result" title="CAD Resolvida!">
                Todos os critérios foram preenchidos com segurança. Você está livre para encerrar a bomba e prescrever a dose de transição subcutânea.
              </AlertCard>
            )}

            <Button 
              disabled={!(cadState.resolucaoHgt && cadState.resolucaoHco3 && cadState.resolucaoAg)}
              onClick={() => cadState.setTelaAtual(6)}
              size="lg"
            >
              Concluir Caso
            </Button>
          </div>
        )}

        {/* T6 — ENCERRAMENTO */}
        {cadState.telaAtual === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionLabel>Resumo de Atendimento</SectionLabel>
            
            <div style={{
              backgroundColor: 'var(--ds-fundo-cartao)',
              border: '1px solid var(--ds-borda-padrao)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ds-texto-secundario)' }}>Protocolo:</span>
                <span style={{ fontWeight: '700' }}>Cetoacidose Diabética</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ds-texto-secundario)' }}>Modo:</span>
                <span style={{ fontWeight: '700' }}>{cadState.modoLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ds-texto-secundario)' }}>Medidas lançadas:</span>
                <span style={{ fontWeight: '700' }}>{cadState.medidas.length}</span>
              </div>
            </div>

            <SectionLabel>Registro de Saída</SectionLabel>
            
            <InputField 
              label="Iniciais do Paciente (LGPD)"
              value={cadState.iniciais}
              onChange={cadState.setIniciais}
              placeholder="Ex: T.A.M."
            />

            <Button 
              onClick={handleSaveCase}
              size="lg"
            >
              Salvar Atendimento e Sair
            </Button>
          </div>
        )}

      </div>

      {/* ============ SHEETS PADRONIZADOS (Rafael · DS-first) ============ */}
      <SelectSheet
        open={potassioSheetOpen}
        onClose={() => setPotassioSheetOpen(false)}
        title="Potássio Sérico (K)"
        description="Selecione a faixa do K para liberar (ou bloquear) a insulina."
        value={cadState.potassio}
        onChange={cadState.setPotassio}
        name="Faixa de K"
        options={[
          { value: 'baixo', label: '< 3,5 mEq/L', description: 'NÃO INICIE INSULINA · repor KCl primeiro' },
          { value: 'normal', label: '3,5 – 5,5 mEq/L', description: 'Faixa segura · liberado para insulina' },
          { value: 'alto', label: '> 5,5 mEq/L', description: 'Iniciar insulina e monitorar K seriado' },
        ]}
      />

      <InfoSheet
        open={gateInfoOpen}
        onClose={() => setGateInfoOpen(false)}
        title="Por que o K bloqueia a insulina?"
        description="Gate de segurança CAD · prevenção de arritmia"
        tone="info"
        leadingIcon="i"
      >
        <SheetText>
          A insulina <strong>desloca o potássio</strong> do extracelular para o intracelular. Em pacientes
          com K abaixo de 3,5 mEq/L, esse deslocamento pode causar <strong>hipocalemia grave</strong> e
          arritmias fatais.
        </SheetText>
        <SheetText>
          Conduta padrão: <strong>repor KCl 20-40 mEq/L</strong> no soro de manutenção e só liberar a
          bomba de insulina quando o K estiver ≥ 3,5 mEq/L.
        </SheetText>
      </InfoSheet>

      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do protocolo?"
        description="O CalcMed mantém o protocolo aberto. Você retoma de onde parou pelo hub."
        confirmLabel="Sair (mantém aberto)"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />
    </div>
  );
}
