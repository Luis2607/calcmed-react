import { useState } from 'react';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
import { Chip } from '../../shared/components/molecules/Chip';
import { Textarea } from '../../shared/components/molecules/Textarea';
import styles from './IAFeedbackSheet.module.css';

/**
 * IAFeedbackSheet — coleta o MOTIVO de um 👍/👎 numa resposta (BottomSheet do DS).
 * Transforma o sinal binário em retorno estruturado (motivos + detalhe livre),
 * em vez de só marcar o polegar. Multi-seleção de motivos; enviar exige ≥1 motivo
 * ou algum texto.
 *
 * Props:
 *  - open · value ('up'|'down') · onClose() · onSubmit({ reasons, detail })
 */
const REASONS = {
  up: ['Ajudou na conduta', 'Direto ao ponto', 'Fácil de entender', 'Outro'],
  down: ['Informação incorreta', 'Conduta arriscada', 'Incompleta', 'Não entendeu', 'Outro'],
};

export function IAFeedbackSheet({ open, value, onClose, onSubmit }) {
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState('');

  const reasons = REASONS[value] || [];
  const toggle = (r) =>
    setSelected((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  const canSend = selected.length > 0 || detail.trim().length > 0;

  // Cada avaliação começa limpa: reseta ao fechar/enviar (sem setState em effect).
  const reset = () => { setSelected([]); setDetail(''); };
  const handleClose = () => { reset(); onClose(); };
  const handleSend = () => { onSubmit({ reasons: selected, detail: detail.trim() }); reset(); };

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title={value === 'down' ? 'O que faltou?' : 'O que ajudou?'}
      description="Seu retorno ajusta a IA do CalcMed."
      footer={{
        primary: {
          label: 'Enviar',
          disabled: !canSend,
          onClick: handleSend,
        },
      }}
    >
      <div className={styles.chips}>
        {reasons.map((r) => (
          <Chip key={r} state={selected.includes(r) ? 'active' : 'default'} onClick={() => toggle(r)}>
            {r}
          </Chip>
        ))}
      </div>

      <Textarea
        value={detail}
        onChange={setDetail}
        rows={3}
        maxLength={300}
        label="Detalhes (opcional)"
        placeholder="O que poderia ser melhor?"
      />

      <p className={styles.fineprint}>Não inclua nada que identifique o paciente.</p>
    </BottomSheet>
  );
}
