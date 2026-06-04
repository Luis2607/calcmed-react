import { useState } from 'react';
import { AIResponse } from '../AIResponse';
import { ResponseHeader } from '../ResponseHeader';
import { PrimaryAction } from '../PrimaryAction';
import { SuggestionChips } from '../SuggestionChips';
import { DoseBlock } from '../DoseBlock';
import { CopyableBlock } from '../CopyableBlock';
import { ExpandableSection } from '../ExpandableSection';
import { ContextSelector } from '../ContextSelector';
import { InterpretationBlock } from '../InterpretationBlock';
import { LimitationNote } from '../LimitationNote';
import { Table } from '../../organisms/Table';
import { AlertCard } from '../../organisms/AlertCard';
import { ChecklistBlock } from '../../organisms/ChecklistBlock';
import { INTENT_LABELS } from '../intents';

/** Checklist com estado local — para o render se sentir vivo (toggle real). */
function ChecklistFromBlock({ block }) {
  const [items, setItems] = useState(
    (block.items || []).map((it) => (typeof it === 'string' ? { label: it, checked: false } : it)),
  );
  const toggle = (i) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, checked: !it.checked } : it)));
  const done = items.filter((it) => it.checked).length;
  return (
    <ChecklistBlock
      tagLabel={block.tagLabel}
      tagTone={block.tagTone || 'critico'}
      subtitle={block.subtitle}
      count={`${done}/${items.length}`}
      items={items}
      onToggle={toggle}
    />
  );
}

/** Mapeia um bloco do payload → componente do DS. `onSelect(value)` torna
 *  seletor de contexto e chips interativos (continuação da conversa). */
function renderBlock(block, i, onSelect) {
  switch (block.type) {
    case 'primary_action':
      return (
        <PrimaryAction key={i} label={block.label} tone={block.tone}>
          {block.content ?? block.title}
        </PrimaryAction>
      );
    case 'dose':
      return <DoseBlock key={i} value={block.value} unit={block.unit} via={block.via} copyText={block.copyText} />;
    case 'table':
      return <Table key={i} columns={block.columns} rows={block.rows} caption={block.caption} getRowTone={block.getRowTone} />;
    case 'interpretation':
      return (
        <InterpretationBlock
          key={i}
          columns={block.columns}
          rows={block.rows}
          reading={block.reading}
          tone={block.tone}
          chips={block.chips}
          getRowTone={block.getRowTone}
        />
      );
    case 'checklist':
      return <ChecklistFromBlock key={i} block={block} />;
    case 'alert':
      return (
        <AlertCard key={i} level={block.level || 'critical'} title={block.title}>
          {block.content}
        </AlertCard>
      );
    case 'context_selector':
      return (
        <ContextSelector
          key={i}
          question={block.question}
          options={block.options}
          onSelect={onSelect ? (value, opt) => onSelect(value, opt) : undefined}
        />
      );
    case 'copyable':
      return <CopyableBlock key={i} text={block.text} variants={block.variants} />;
    case 'expandable':
      return (
        <ExpandableSection key={i} title={block.title} hint={block.hint} defaultOpen={block.defaultOpen}>
          {block.content}
        </ExpandableSection>
      );
    case 'limitation':
      return <LimitationNote key={i} title={block.title}>{block.content}</LimitationNote>;
    case 'chips':
      return (
        <SuggestionChips
          key={i}
          label={block.label}
          items={block.items}
          onSelect={onSelect ? (item) => onSelect(item.value ?? item.label, item) : undefined}
        />
      );
    case 'text':
      return <p key={i} style={{ fontSize: 'var(--fonte-tamanho-corpo)', lineHeight: '21px', color: 'var(--ds-texto-secundario)' }}>{block.content}</p>;
    default:
      return null;
  }
}

/**
 * AI · AIResponseRenderer — recebe a resposta ESTRUTURADA da IA (não markdown)
 * e renderiza o pattern com os componentes do DS. É a ponte do handoff:
 *   payload → AIResponseRenderer → UI consistente.
 *
 * Props:
 *  - response: {
 *      intent, risk_level, title, context,
 *      blocks: [{ type, ... }],
 *      actions: [{ label, type, value }]   // viram SuggestionChips no rodapé
 *    }
 *  - onSelect(value, meta): continuação da conversa ao tocar seletor/chip/ação
 *    (opcional; sem ele a resposta é apenas visual, como na galeria do DS).
 */
export const AIResponseRenderer = ({ response, onSelect }) => {
  if (!response) return null;
  const { intent, risk_level: risk, title, context, blocks = [], actions = [] } = response;

  return (
    <AIResponse risk={risk}>
      {(title || intent) && (
        <ResponseHeader
          title={title}
          context={context}
          intent={intent}
          intentLabel={intent ? INTENT_LABELS[intent] ?? intent : undefined}
        />
      )}
      {blocks.map((block, i) => renderBlock(block, i, onSelect))}
      {actions.length > 0 && (
        <SuggestionChips
          items={actions.map((a) => ({ label: a.label, value: a.value }))}
          onSelect={onSelect ? (item) => onSelect(item.value ?? item.label, item) : undefined}
        />
      )}
    </AIResponse>
  );
};
