/**
 * pcrModais.jsx — modais PCR (decisão clínica + info).
 * Cada modal é função componente que recebe (state, callbacks).
 * Padrão: BottomSheet via patterns (Confirm/Info/Decision).
 */
import { ConfirmSheet, InfoSheet } from '../../shared/components/overlays/patterns';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { SheetSection, SheetText, SheetList } from '../../shared/components/molecules/sheet';
import { HHTTPills } from '../../shared/components/molecules/HHTTPills';
import { HHTT_ITEMS } from '../../shared/components/molecules/HHTTPills/hhttData';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
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
            description="Fibrilação Ventricular — traçado caótico irregular."
            onClick={() => onSelect('fv')}
          />
          <OptionCard
            title="TV sem pulso"
            meta="CHOCÁVEL"
            tone="critical"
            description="Taquicardia Ventricular sem pulso — traçado largo monomórfico."
            onClick={() => onSelect('tv')}
          />
          <OptionCard
            title="AESP"
            meta="NÃO-CHOCÁVEL"
            tone="warning"
            description="Atividade Elétrica Sem Pulso — QRS estreito, sem pulso central."
            onClick={() => onSelect('aesp')}
          />
          <OptionCard
            title="Assistolia"
            meta="NÃO-CHOCÁVEL"
            tone="warning"
            description="Linha reta — confirmar em 2 derivações."
            onClick={() => onSelect('assistolia')}
          />
          <OptionCard
            title="Não Avaliado"
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

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Confirmar RCE"
      description="Marque os critérios observados (apoio cognitivo · não é gate)."
      footer={{
        primary: { label: 'Confirmar RCE', variant: 'primary', onClick: () => onConfirm(criterios.map((c) => c.key)) },
      }}
    >
      <SheetSection>
        <SheetList items={criterios.map((c) => c.label)} />
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
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Encerrar sem RCE?"
      description="Escolha o desfecho clínico. O caso vai pro histórico."
    >
      <SheetSection>
        <div className={styles.stack}>
          <OptionCard
            title="Óbito declarado"
            tone="critical"
            description="Critério de morte cumprido. Não há indicação de seguir RCP."
            onClick={() => onConfirm('obito')}
          />
          <OptionCard
            title="Suspensa por decisão clínica"
            tone="warning"
            description="Suspensa após avaliação clínica. Não é óbito declarado."
            onClick={() => onConfirm('suspensa')}
          />
        </div>
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
 * 2 opções pós-checagem: tem pulso → confirmar RCE · sem pulso → checar ritmo.
 */
export function CheckarPulsoRitmoSheet({ open, onClose, onComPulso, onSemPulso }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Paciente tem pulso?"
      description="Cheque pulso central (carótida ou femoral) por até 10 segundos."
    >
      <SheetSection>
        <div className={styles.stack}>
          <OptionCard
            title="Tem pulso"
            tone="success"
            description="Confirmar RCE — vai pra tela pós-RCE."
            onClick={onComPulso}
          />
          <OptionCard
            title="Sem pulso"
            tone="warning"
            description="Checar ritmo no monitor — ciclo incrementa."
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
      perigo
      onConfirm={onConfirm}
    />
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
      closeLabel="Já revisei"
    >
      <SheetText>
        Ritmo não-chocável (AESP/Assistolia) exige busca ativa por causas reversíveis. Reveja agora:
      </SheetText>
      <HHTTPills items={HHTT_ITEMS} />
    </InfoSheet>
  );
}
