import { useState, Fragment, Component } from 'react';
import { Icon } from '../../atoms/Icon';
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
import { ProtocolStep } from '../ProtocolStep';
import { OpenToolButton } from '../OpenToolButton';
import { Table } from '../../organisms/Table';
import { AlertCard } from '../../organisms/AlertCard';
import { ChecklistBlock } from '../../organisms/ChecklistBlock';
import { INTENT_LABELS } from '../intents';
import styles from './AIResponseRenderer.module.css';

/** Markdown leve inline: **negrito** → <strong>, *itálico* → <em> e \n em quebra
 *  de linha. O itálico serve à prosa longa (ênfase secundária / termo técnico)
 *  sem virar markdown pesado. Negrito é tratado antes do itálico (`**` contém `*`). */
function rich(content) {
  if (content == null) return null;
  if (typeof content === 'number') content = String(content);
  // objeto/array → não renderiza cru (evita crash "Objects are not valid as a React child")
  if (typeof content !== 'string') return null;
  return content.split('\n').map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((seg, i) => {
        if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={i}>{seg.slice(2, -2)}</strong>;
        if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) return <em key={i}>{seg.slice(1, -1)}</em>;
        return seg;
      })}
    </Fragment>
  ));
}

/** Boundary por bloco: um payload malformado falha sozinho, sem branquear a
 *  resposta inteira (o sistema é alimentado por payload de IA, não-confiável). */
class BlockBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
function renderBlock(block, i, onSelect, risk) {
  switch (block.type) {
    case 'primary_action':
      return (
        <PrimaryAction key={i} label={block.label} tone={block.tone}>
          {rich(block.content || block.title)}
        </PrimaryAction>
      );
    case 'heading':
      return (
        <h4 key={i} className={styles.heading}>
          {block.icon ? (
            <span className={styles.headingIcon} aria-hidden="true"><Icon name={block.icon} size={18} /></span>
          ) : (
            block.emoji && <span className={styles.headingEmoji} aria-hidden="true">{block.emoji}</span>
          )}
          {rich(block.text)}
        </h4>
      );
    case 'list':
      return (
        <ul key={i} className={styles.list}>
          {(block.items || []).map((it, j) => <li key={j}>{rich(it)}</li>)}
        </ul>
      );
    case 'divider':
      return <hr key={i} className={styles.divider} />;
    case 'dose':
      return <DoseBlock key={i} value={block.value} unit={block.unit} via={block.via} copyable={block.copyable} copyText={block.copyText} />;
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
          onSelect={onSelect ? (value, meta) => onSelect(value, meta) : undefined}
        />
      );
    case 'checklist':
      return <ChecklistFromBlock key={i} block={block} />;
    case 'alert':
      return (
        <AlertCard key={i} level={block.level || 'critical'} title={block.title}>
          {rich(block.content)}
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
          {rich(block.content)}
        </ExpandableSection>
      );
    case 'stepper':
      return <ProtocolStep key={i} label={block.label} current={block.current} steps={block.steps} />;
    case 'limitation':
      // risco alto → ressalva ganha saliência (tom atenção), em vez de sumir no rodapé.
      return <LimitationNote key={i} tone={risk === 'alto' ? 'atencao' : undefined}>{rich(block.content)}</LimitationNote>;
    case 'chips':
      return (
        <SuggestionChips
          key={i}
          label={block.label}
          items={block.items}
          onSelect={onSelect ? (item) => onSelect(item.value ?? item.label, item) : undefined}
        />
      );
    case 'text': {
      // prosa longa (>40 palavras) ganha conforto de leitura (medida + respiro)
      const long = typeof block.content === 'string' && block.content.trim().split(/\s+/).length > 40;
      return <p key={i} className={styles.text} data-long={long || undefined}>{rich(block.content)}</p>;
    }
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
 *  - onCopied(msg): callback quando um bloco copiável é copiado (ex.: toast).
 */
export const AIResponseRenderer = ({ response, onSelect, variant = 'card' }) => {
  if (!response) return null;
  const { intent, risk_level: risk, title, context, blocks = [], actions = [] } = response;

  return (
    <AIResponse risk={risk} variant={variant}>
      {(title || intent) && (
        <ResponseHeader
          title={title}
          context={context}
          intent={variant === 'card' ? intent : undefined}
          intentLabel={variant === 'card' && intent ? INTENT_LABELS[intent] ?? intent : undefined}
        />
      )}
      {blocks.map((block, i) => (
        <BlockBoundary key={`${block?.type || 'blk'}-${i}`}>
          {renderBlock(block, i, onSelect, risk)}
        </BlockBoundary>
      ))}
      {actions.length > 0 && (() => {
        // deep-links (abrir ferramenta) ≠ chips de continuidade: o renderer não
        // conhece roteamento — sinaliza via meta.type e o IAScreen navega.
        const tools = actions.filter((a) => a.type === 'open_tool');
        const chips = actions.filter((a) => a.type !== 'open_tool');
        return (
          <>
            {chips.length > 0 && (
              <SuggestionChips
                items={chips.map((a) => ({ label: a.label, value: a.value }))}
                onSelect={onSelect ? (item) => onSelect(item.value ?? item.label, item) : undefined}
              />
            )}
            {tools.map((a, i) => (
              <OpenToolButton
                key={`tool-${i}`}
                label={a.label}
                onOpen={onSelect ? () => onSelect(a.route, { type: 'open_tool', route: a.route, label: a.label }) : undefined}
              />
            ))}
          </>
        );
      })()}
    </AIResponse>
  );
};
