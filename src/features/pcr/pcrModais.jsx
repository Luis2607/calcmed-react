/**
 * pcrModais.jsx — modais PCR (decisão clínica + info).
 * Cada modal é função componente que recebe (state, callbacks).
 * Padrão: BottomSheet via patterns (Confirm/Info/Decision).
 */
import { useState } from 'react';
import { ConfirmSheet, InfoSheet } from '../../shared/components/overlays/patterns';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { SheetSection, SheetText } from '../../shared/components/molecules/sheet';
import { HHTTPills } from '../../shared/components/molecules/HHTTPills';
import { HHTT_ITEMS } from '../../shared/components/molecules/HHTTPills/hhttData';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
import { EventoCardNovo } from '../../shared/components/molecules/EventoCardNovo';
import { InputField } from '../../shared/components/molecules/InputField';
import { RitmoIcon } from '../../shared/components/molecules/RitmoIcon';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { Checkbox } from '../../shared/components/atoms/Checkbox';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { calcPesoPreditoARDSnet, calcTETProfundidade, parseNumber, VENT_PEDIATRIA } from './pcrData';
import styles from './pcrModais.module.css';

/**
 * Modal: SELECIONAR RITMO (5 opções · golden modal `selecionar-ritmo`).
 * §B1 Gustavo · ícones por ritmo (placeholder — substituível por ícones definitivos).
 */
export function SelecionarRitmoSheet({ open, onClose, onSelect }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Ritmo cardíaco"
      description="Identifique o ritmo observado no monitor."
    >
      <SheetSection>
        <div className={styles.stack}>
          <OptionCard
            title="FV"
            meta="CHOCÁVEL"
            tone="critical"
            media={<RitmoIcon ritmo="fv" size={48} />}
            description="Fibrilação Ventricular — traçado caótico irregular."
            onClick={() => onSelect('fv')}
          />
          <OptionCard
            title="TV sem pulso"
            meta="CHOCÁVEL"
            tone="critical"
            media={<RitmoIcon ritmo="tv" size={48} />}
            description="Taquicardia Ventricular sem pulso — QRS largo e rápido, regular ou polimórfico."
            onClick={() => onSelect('tv')}
          />
          <OptionCard
            title="AESP"
            meta="NÃO-CHOCÁVEL"
            tone="warning"
            media={<RitmoIcon ritmo="aesp" size={48} />}
            description="Atividade Elétrica Sem Pulso — ritmo organizado no monitor (QRS estreito ou largo), sem pulso central."
            onClick={() => onSelect('aesp')}
          />
          <OptionCard
            title="Assistolia"
            meta="NÃO-CHOCÁVEL"
            tone="warning"
            media={<RitmoIcon ritmo="assistolia" size={48} />}
            description="Linha reta — confirmar em 2 derivações."
            onClick={() => onSelect('assistolia')}
          />
          <OptionCard
            title="Ritmo organizado c/ pulso"
            meta="RCE"
            tone="success"
            media={<RitmoIcon ritmo="aesp" size={48} />}
            description="QRS organizado + pulso central palpável → Retorno da Circulação Espontânea."
            onClick={() => onSelect('organizado')}
          />
          <OptionCard
            title="Não Avaliado"
            media={<RitmoIcon ritmo="na" size={48} />}
            description="Voltar ao monitor pra avaliar."
            onClick={() => onSelect('na')}
          />
        </div>
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: APLICAR CHOQUE (2 opções · golden `aplicar-choque`).
 */
export function AplicarChoqueSheet({ open, onClose, cargaLabel, onConfirm }) {
  return (
    <ConfirmSheet
      open={open}
      onClose={onClose}
      title="Aplicar choque?"
      description={`Carga sugerida: ${cargaLabel}. Confirme apenas após aplicar.`}
      confirmLabel="Desfibrilado"
      cancelLabel="Não desfibrilado"
      onConfirm={() => onConfirm(true)}
    />
  );
}

/**
 * Modal: CONFIRMAR RCE (3 checkboxes apoio cognitivo · D28 NÃO é gate).
 */
export function ConfirmarRCESheet({ open, onClose, onConfirm }) {
  // §critérios apoio cognitivo · golden `confirmar-rce`
  const criterios = [
    { key: 'pulso', label: 'Pulso central (carótida ou femoral palpável)' },
    { key: 'etco2', label: 'ETCO₂ > 40 mmHg (súbito e mantido)' },
    { key: 'pa', label: 'Onda PA invasiva (pulsátil consistente)' },
  ];
  const [marcados, setMarcados] = useState([]);
  const toggle = (k) => setMarcados((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Confirmar RCE"
      description="Marque os critérios observados (apoio cognitivo · não é gate)."
      footer={{
        primary: { label: 'Confirmar RCE', variant: 'primary', onClick: () => onConfirm(marcados) },
      }}
    >
      <SheetSection>
        {criterios.map((c) => (
          <Checkbox key={c.key} label={c.label} checked={marcados.includes(c.key)} onChange={() => toggle(c.key)} />
        ))}
        <SheetText variant="auxiliary">
          Mesmo critério parcial é evidência. Decida clinicamente.
        </SheetText>
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: ENCERRAR SEM RCE (2 opções · golden `encerrar-sem-rce`).
 */
export function EncerrarSemRCESheet({ open, onClose, onConfirm }) {
  const [escolha, setEscolha] = useState(null);
  const opcoes = [
    { value: 'obito', label: 'Óbito declarado', description: 'Critério de morte cumprido. Não há indicação de seguir RCP.' },
    { value: 'suspensa', label: 'Suspensa por decisão clínica', description: 'Suspensa após avaliação clínica. Não é óbito declarado.' },
  ];
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Encerrar sem RCE?"
      description="Escolha o desfecho clínico. O caso vai pro histórico."
      footer={{
        primary: { label: 'Confirmar desfecho', variant: 'danger', onClick: () => escolha && onConfirm(escolha), disabled: !escolha },
      }}
    >
      <SheetSection>
        <RadioGroup name="encerrar-desfecho" options={opcoes} value={escolha} onChange={setEscolha} columns={1} />
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: PAUSAR (golden `pausar`).
 */
export function PausarSheet({ open, onClose, onConfirm }) {
  return (
    <ConfirmSheet
      open={open}
      onClose={onClose}
      title="Pausar PCR"
      description="Cronômetro continua. Compressões serão interrompidas."
      confirmLabel="Pausar tudo"
      cancelLabel="Continuar"
      onConfirm={onConfirm}
    />
  );
}

/**
 * Modal: CHECAR PULSO/RITMO (gate D41 · golden `checar-pulso-ritmo`).
 * Pergunta única "ritmo organizado + pulso?": SIM → RCE (tela pós-RCE) ·
 * NÃO → reabre Selecionar Ritmo pra registrar o ritmo atual (Luis 2026-05-28).
 */
export function CheckarPulsoRitmoSheet({ open, onClose, onComPulso, onSemPulso }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Ritmo organizado com pulso?"
      description="Cheque o monitor e o pulso central (carótida ou femoral) por até 10 segundos."
    >
      <SheetSection>
        <div className={styles.stack}>
          <OptionCard
            title="Sim · ritmo organizado e pulso"
            meta="RCE"
            tone="success"
            description="Retorno da circulação espontânea — vai pra cuidados pós-PCR."
            onClick={onComPulso}
          />
          <OptionCard
            title="Não · sem pulso"
            tone="warning"
            description="Selecionar o ritmo atual no monitor e seguir o ciclo."
            onClick={onSemPulso}
          />
        </div>
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: ANTI-DOUBLE-TAP ADRENALINA (<30s · golden `confirmarAcao`).
 */
export function AdrenDoubleTapSheet({ open, onClose, segundosDesde, onConfirm }) {
  return (
    <ConfirmSheet
      open={open}
      onClose={onClose}
      title="Aplicar nova dose agora?"
      description={`Última dose foi há ${segundosDesde}s. Aplicar mesmo assim?`}
      confirmLabel="Aplicar"
      cancelLabel="Cancelar"
      destructive
      onConfirm={onConfirm}
    />
  );
}

/**
 * Modal: ADICIONAR EVENTO (golden `adicionar-evento` · golden pcr.js abrirModalAdicionarEvento).
 * 4 grupos: Drogas · Procedimento · Ritmos atípicos · Outro (custom · placeholder).
 */
const EVENTOS_DROGAS = [
  { key: 'amio', nome: 'Amiodarona', dose: '300 mg IV/IO bolus · 2ª dose 150 mg' },
  { key: 'lido', nome: 'Lidocaína', dose: '1-1,5 mg/kg IV/IO · max 3 mg/kg' },
  { key: 'bic', nome: 'Bicarbonato', dose: '1 mEq/kg IV (hipercalemia · acidose)' },
];

const EVENTOS_PROCEDIMENTO = [
  { key: 'iot', nome: 'IOT', dose: 'Intubação orotraqueal' },
];

const EVENTOS_RITMOS_ATIPICOS = [
  { key: 'idio', nome: 'Idioventricular', dose: 'Ritmo de escape' },
  { key: 'torsades', nome: 'Torsades de Pointes', dose: 'Tratar com Magnésio' },
];

export function AdicionarEventoSheet({ open, onClose, contadores = {}, eventosCustom = [], onApply, onOutro }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Adicionar evento"
      description="Registre droga, procedimento ou ritmo atípico observado."
      footer={{ primary: { label: 'Fechar', onClick: onClose } }}
    >
      <SheetSection>
        <SectionLabel>Drogas</SectionLabel>
        <div className={styles.stack}>
          {EVENTOS_DROGAS.map((ev) => (
            <EventoCardNovo
              key={ev.key}
              name={ev.nome}
              dose={ev.dose}
              count={contadores[ev.key] || 0}
              onApply={() => onApply(ev, 'droga')}
            />
          ))}
        </div>
      </SheetSection>

      {eventosCustom.length > 0 && (
        <SheetSection>
          <SectionLabel>Personalizados</SectionLabel>
          <div className={styles.stack}>
            {eventosCustom.map((ev) => (
              <EventoCardNovo
                key={ev.key}
                name={ev.nome}
                dose={ev.dose}
                count={contadores[ev.key] || 0}
                onApply={() => onApply(ev, 'droga')}
              />
            ))}
          </div>
        </SheetSection>
      )}

      <SheetSection>
        <SectionLabel>Procedimento</SectionLabel>
        <div className={styles.stack}>
          {EVENTOS_PROCEDIMENTO.map((ev) => (
            <EventoCardNovo
              key={ev.key}
              name={ev.nome}
              dose={ev.dose}
              count={contadores[ev.key] || 0}
              onApply={() => onApply(ev, '')}
            />
          ))}
        </div>
      </SheetSection>

      <SheetSection>
        <SectionLabel>Ritmos atípicos</SectionLabel>
        <div className={styles.stack}>
          {EVENTOS_RITMOS_ATIPICOS.map((ev) => (
            <EventoCardNovo
              key={ev.key}
              name={ev.nome}
              dose={ev.dose}
              count={contadores[ev.key] || 0}
              onApply={() => onApply(ev, '')}
            />
          ))}
        </div>
      </SheetSection>

      <SheetSection>
        <SectionLabel>Outro</SectionLabel>
        <div className={styles.stack}>
          <EventoCardNovo
            name="Outro evento"
            dose="Vasopressina · Cardioversão · Marca-passo · etc."
            onApply={onOutro}
          />
        </div>
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: OUTRO EVENTO (golden `abrirEventoCustomizado`).
 * Form Nome (obrigatório) + Dose (opcional). Persiste no eventosCustomizados[] do estado.
 */
export function OutroEventoSheet({ open, onClose, onAdd }) {
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');

  // Reset form quando abre (chamado durante render é OK pq derivado de prop · React 19)
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setNome('');
      setDose('');
    }
  }

  const handleAdd = () => {
    const trimmed = nome.trim();
    if (!trimmed) return;
    onAdd({ nome: trimmed, dose: dose.trim() });
    setNome('');
    setDose('');
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Outro evento"
      description="Vai virar um card no Adicionar evento até o fim do caso · pode aplicar de novo sem digitar."
      footer={{
        secondary: { label: 'Cancelar', variant: 'secondary', onClick: onClose },
        primary: { label: 'Adicionar e aplicar', onClick: handleAdd, disabled: !nome.trim() },
      }}
    >
      <SheetSection>
        <InputField
          label="Nome"
          value={nome}
          onChange={setNome}
          placeholder="Ex.: Vasopressina · Cardioversão · Marca-passo"
          maxLength={50}
        />
        <InputField
          label="Dose · detalhe (opcional)"
          value={dose}
          onChange={setDose}
          placeholder="Ex.: 40 U IV · 100 J sincronizado"
          maxLength={60}
        />
      </SheetSection>
    </BottomSheet>
  );
}

const FAIXA_OPCOES = Object.entries(VENT_PEDIATRIA).map(([value, v]) => ({ value, label: v.label }));

/**
 * Modal: VCV (Ventilação Controlada Volume · golden via-aerea-vcv).
 * Adulto: altura + sexo → peso predito ARDSnet → VC 6-8 × pp.
 * Pediátrico: select faixa etária → VENT_PEDIATRIA.
 */
export function VCVSheet({ open, onClose, pediatrico, altura, sexo, onAltura, onSexo }) {
  const [faixa, setFaixa] = useState('lactente');
  const alturaNum = parseNumber(altura);
  const pp = !pediatrico && alturaNum && !isNaN(alturaNum) ? calcPesoPreditoARDSnet(alturaNum, sexo) : null;
  const vent = pediatrico ? VENT_PEDIATRIA[faixa] : null;

  return (
    <BottomSheet open={open} onClose={onClose} title={pediatrico ? 'VCV Pediátrico' : 'VCV · Ventilação Controlada Volume'}>
      <SheetSection>
        {pediatrico ? (
          <>
            <RadioGroup name="faixa-etaria" label="Faixa etária" options={FAIXA_OPCOES} value={faixa} onChange={setFaixa} columns={1} />
            {vent && (
              <AlertCard level="info" title={vent.label}>
                VC {vent.vc} · FR {vent.fr} · PEEP {vent.peep} · Pico {vent.pico} · I:E {vent.ie}
              </AlertCard>
            )}
          </>
        ) : (
          <>
            <InputField label="Altura" type="text" mono inputMode="numeric" value={altura || ''} onChange={onAltura} showUnit unit="cm" />
            <Segmented label="Sexo" block options={[{ value: 'masc', label: 'Masculino' }, { value: 'fem', label: 'Feminino' }]} value={sexo} onChange={onSexo} />
            {pp ? (
              <AlertCard level="info" title="Volume corrente protetor" showValue value={`${Math.round(pp * 6)}-${Math.round(pp * 8)}`} unit="mL">
                Peso predito {pp} kg · VC 6-8 mL/kg · FR 10-12 · PEEP 5 · FiO₂ 100% inicial · I:E 1:2.
              </AlertCard>
            ) : (
              <AlertCard level="warning" title="Preencha altura e sexo">
                O volume corrente protetor depende do peso predito (ARDSnet).
              </AlertCard>
            )}
          </>
        )}
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: PCV (Ventilação Controlada Pressão · golden via-aerea-pcv).
 */
export function PCVSheet({ open, onClose, pediatrico }) {
  const [faixa, setFaixa] = useState('lactente');
  const vent = pediatrico ? VENT_PEDIATRIA[faixa] : null;

  return (
    <BottomSheet open={open} onClose={onClose} title={pediatrico ? 'PCV Pediátrico' : 'PCV · Ventilação Controlada Pressão'}>
      <SheetSection>
        {pediatrico ? (
          <>
            <RadioGroup name="faixa-etaria" label="Faixa etária" options={FAIXA_OPCOES} value={faixa} onChange={setFaixa} columns={1} />
            {vent && (
              <AlertCard level="info" title={vent.label}>
                Pico {vent.pico} · FR {vent.fr} · PEEP {vent.peep} · I:E {vent.ie}
              </AlertCard>
            )}
          </>
        ) : (
          <AlertCard level="info" title="Pressão controlada" showValue value="12-20" unit="cmH₂O">
            Pressão pico 12-20 cmH₂O inicial · FR 10-12 · PEEP 5 · FiO₂ 100% · I:E 1:2 · Trigger 1-3 L/min ou -1 a -3 cmH₂O.
          </AlertCard>
        )}
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: TET Profundidade (golden via-aerea-tet-profundidade · só pediátrico).
 * 3 fórmulas: tubo (diam×3) · altura (alt/10+5) · peso (6+peso).
 */
export function TETProfundidadeSheet({ open, onClose }) {
  const [diam, setDiam] = useState('');
  const [alt, setAlt] = useState('');
  const [peso, setPeso] = useState('');
  const calc = calcTETProfundidade({
    diametro: parseNumber(diam),
    altura: parseNumber(alt),
    peso: parseNumber(peso),
  });

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Profundidade do TET"
      description="Estime a profundidade de fixação na rima labial. Use qualquer um dos três métodos."
    >
      <SheetSection>
        <InputField label="Diâmetro interno do tubo" type="text" mono inputMode="decimal" value={diam} onChange={setDiam} placeholder="Ex.: 4,0" showUnit unit="mm" helperText="Profundidade = diâmetro × 3" />
        {calc.porTubo && <AlertCard level="info" showValue value={calc.porTubo} unit="cm" />}
      </SheetSection>
      <SheetSection>
        <InputField label="Altura" type="text" mono inputMode="numeric" value={alt} onChange={setAlt} placeholder="Ex.: 90" showUnit unit="cm" helperText="Profundidade = altura ÷ 10 + 5" />
        {calc.porAltura && <AlertCard level="info" showValue value={calc.porAltura} unit="cm" />}
      </SheetSection>
      <SheetSection>
        <InputField label="Peso" type="text" mono inputMode="decimal" value={peso} onChange={setPeso} placeholder="Ex.: 12" showUnit unit="kg" helperText="Profundidade = 6 + peso" />
        {calc.porPeso && <AlertCard level="info" showValue value={calc.porPeso} unit="cm" />}
      </SheetSection>
    </BottomSheet>
  );
}

/**
 * Modal: 5H/5T RESUMO (auto-trigger 250ms após AESP/Assist · golden `5h5t-resumo`).
 */
export function HHTTSheet({ open, onClose }) {
  return (
    <InfoSheet
      open={open}
      onClose={onClose}
      title="Causas reversíveis · revise agora"
      description="Ritmo não-chocável (AESP/Assistolia) exige busca ativa por causas reversíveis. Reveja agora:"
      acknowledgeLabel="Já revisei"
    >
      <HHTTPills items={HHTT_ITEMS} />
    </InfoSheet>
  );
}
