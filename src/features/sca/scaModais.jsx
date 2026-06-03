/**
 * scaModais.jsx — modais do SCA (decisão clínica + info).
 * Padrão DS: BottomSheet/InfoSheet via patterns · OptionCard · RadioGroup empilhado
 * (nunca Select aninhado · evita sheet-on-sheet). Visual padronizado com os outros protocolos.
 */
import { useState } from 'react';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
import { InfoSheet } from '../../shared/components/overlays/patterns';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { InputField } from '../../shared/components/molecules/InputField';
import { SheetSection, SheetText } from '../../shared/components/molecules/sheet';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import styles from './scaModais.module.css';
import {
  OPCOES_QUEIXA, ONDE_REPERFUNDIR_OPCOES, P2Y12_OPCOES,
  sgarbossaRatio, sgarbossaPositivo, p2y12Sugestao,
} from './scaData';

/** Sheet: selecionar queixa principal (golden abrirSheetQueixa). */
export function SelecionarQueixaSheet({ open, onClose, value, onSelect }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Queixa principal" description="Toque na opção que melhor descreve a apresentação do paciente.">
      <SheetSection>
        <div className={styles.stack}>
          {OPCOES_QUEIXA.map((o) => (
            <OptionCard
              key={o.value}
              title={o.titulo}
              description={o.sub}
              selected={value === o.value}
              onClick={() => onSelect(o.value)}
            />
          ))}
        </div>
      </SheetSection>
    </BottomSheet>
  );
}

/** Sheet: onde reperfundir (golden abrirSheetOndeReperfundir · decisão contextual D-SCA-15). */
export function OndeReperfundirSheet({ open, onClose, onSelect }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Onde vai reperfundir?" description="A escolha define o fluxo · pode mudar entre plantões diferentes, por isso perguntamos no momento.">
      <SheetSection>
        <div className={styles.stack}>
          {ONDE_REPERFUNDIR_OPCOES.map((o) => (
            <OptionCard key={o.value} title={o.titulo} description={o.sub} onClick={() => onSelect(o.value)} />
          ))}
        </div>
      </SheetSection>
    </BottomSheet>
  );
}

/** Sheet: calculadora Sgarbossa-Smith (golden abrirSgarbossa). Positivo se razão ST/S ≥ 0,25. */
export function SgarbossaSheet({ open, onClose }) {
  const [st, setSt] = useState('');
  const [s, setS] = useState('');
  const ratio = sgarbossaRatio(st, s);
  const positivo = sgarbossaPositivo(ratio);
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Calculadora Sgarbossa-Smith"
      description="Em BRE/BRD com dor, 1 critério positivo = OMI (cronologia do BRE é irrelevante · Alencar 2025)."
    >
      <SheetSection>
        <InputField label="Desnivelamento ST (mm)" type="text" mono inputMode="decimal" value={st} onChange={setSt} placeholder="Ex.: 5" />
        <InputField label="Onda S (ou R) precedente (mm)" type="text" mono inputMode="decimal" value={s} onChange={setS} placeholder="Ex.: 15" />
        {ratio != null ? (
          <AlertCard
            level={positivo ? 'critical' : 'info'}
            title={positivo ? 'Sgarbossa-Smith positivo' : 'Sgarbossa-Smith negativo'}
            showValue
            value={ratio.toFixed(2)}
            unit="ST/S"
          >
            {positivo
              ? 'Razão ≥ 0,25 · IAM (OMI) confirmado. Conduzir como STEMI equivalente.'
              : 'Razão < 0,25 · critério não preenchido. Manter vigilância clínica.'}
          </AlertCard>
        ) : (
          <SheetText variant="auxiliary">Preencha os dois campos para calcular a razão ST/S.</SheetText>
        )}
      </SheetSection>
    </BottomSheet>
  );
}

/** Sheet: árvore P2Y12 (golden abrirP2Y12). Sugestão automática + escolha (RadioGroup empilhado). */
export function P2Y12Sheet({ open, onClose, contexto, value, onConfirm }) {
  const [escolha, setEscolha] = useState(value || null);
  const sug = p2y12Sugestao(contexto);
  const opcoes = P2Y12_OPCOES.map((o) => ({
    value: o.value,
    label: o.value === 'prasugrel' && sug.bloqPrasugrel ? `${o.label} · bloqueado` : o.label,
    disabled: o.value === 'prasugrel' && sug.bloqPrasugrel,
  }));
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Qual P2Y12?"
      description="Decisão guiada por cenário + filtros automáticos (Rao 2025)."
      footer={{ primary: { label: 'Confirmar', variant: 'primary', onClick: () => escolha && onConfirm(escolha), disabled: !escolha } }}
    >
      <SheetSection>
        <AlertCard level={sug.tipo === 'sucesso' ? 'result' : sug.tipo === 'atencao' ? 'warning' : 'info'} title={sug.titulo}>
          {sug.corpo}
        </AlertCard>
        <RadioGroup name="sca-p2y12" options={opcoes} value={escolha} onChange={setEscolha} columns={1} />
      </SheetSection>
    </BottomSheet>
  );
}

/** Sheet: info de um sinal OMI (golden modais sinal-*). */
export function SinalOmiInfoSheet({ open, onClose, sinal }) {
  return (
    <InfoSheet open={open} onClose={onClose} title={sinal?.nome || 'Sinal OMI'} acknowledgeLabel="Entendi">
      <SheetText>{sinal?.criterio}</SheetText>
    </InfoSheet>
  );
}

/** Sheet: info genérica (paciente / ECG / etc.). */
export function InfoSCASheet({ open, onClose, titulo, descricao, paragrafos = [] }) {
  return (
    <InfoSheet open={open} onClose={onClose} title={titulo} description={descricao} acknowledgeLabel="Entendi">
      {paragrafos.map((p, i) => <SheetText key={i}>{p}</SheetText>)}
    </InfoSheet>
  );
}
