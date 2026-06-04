import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import { AIResponseRenderer, SuggestionChips } from '../../shared/components/ai';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { respond, STARTERS } from './iaData';
import styles from './IAScreen.module.css';

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const truncate = (s, n = 42) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function relativeTime(ts) {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `${d} d`;
}

function previewOf(conv) {
  const last = conv.messages[conv.messages.length - 1];
  if (!last) return 'Conversa vazia';
  if (last.role === 'user') return last.text;
  if (last.pending) return 'Digitando…';
  return last.response?.title ?? 'Resposta';
}

function TypingDots() {
  return (
    <div className={styles.aiRow}>
      <div className={styles.typingWrap}>
        <span className={styles.typingLabel}><Icon name="sparkles" size={14} /> IA · CalcMed</span>
        <span className={styles.typing} aria-label="IA digitando">
          <i /><i /><i />
        </span>
      </div>
    </div>
  );
}

/**
 * IAScreen — experiência de IA do protótipo: histórico de conversas + chat
 * conversacional clínico. As respostas são estruturadas (AIResponseRenderer,
 * variante plain = largura cheia). O roteiro (iaData) faz o papel do backend.
 */
export function IAScreen({ onBack }) {
  const [conversations, setConversations] = usePersistedState('ia_conversations', []);
  const [activeId, setActiveId] = useState(null); // null = lista · 'new' = chat novo · id = conversa
  const [draft, setDraft] = useState('');
  const [showJump, setShowJump] = useState(false);
  const scrollRef = useRef(null);
  const timers = useRef({});

  const active = activeId && activeId !== 'new' ? conversations.find((c) => c.id === activeId) : null;
  const inChat = activeId != null;
  const messages = active?.messages ?? [];

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  const scrollToBottom = (behavior = 'smooth') => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    setShowJump(false);
  };

  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);

  // Ao abrir/trocar de conversa, vai para a última mensagem.
  useEffect(() => {
    if (inChat) requestAnimationFrame(() => scrollToBottom('auto'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const openNew = () => { setActiveId('new'); setDraft(''); setShowJump(false); };
  const openConv = (id) => { setActiveId(id); setShowJump(false); };
  const backToList = () => { setActiveId(null); setShowJump(false); };
  const deleteConv = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  // Envia uma mensagem; cria a conversa se ainda não existir (chat novo).
  const send = (displayText, lookup) => {
    const userMsg = { id: uid(), role: 'user', text: displayText };
    const aiId = uid();
    const aiMsg = { id: aiId, role: 'ai', pending: true };
    const convId = active ? active.id : uid();
    const isNew = !active;

    setConversations((prev) =>
      isNew
        ? [{ id: convId, title: truncate(displayText), messages: [userMsg, aiMsg], createdAt: Date.now() }, ...prev]
        : prev.map((c) =>
            c.id === convId
              ? { ...c, title: c.title || truncate(displayText), messages: [...c.messages, userMsg, aiMsg] }
              : c,
          ),
    );
    setActiveId(convId);
    requestAnimationFrame(() => scrollToBottom('smooth'));

    const response = respond(lookup ?? displayText);
    timers.current[aiId] = setTimeout(() => {
      const stick = isNearBottom();
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: c.messages.map((m) => (m.id === aiId ? { id: aiId, role: 'ai', response } : m)) }
            : c,
        ),
      );
      if (stick) requestAnimationFrame(() => scrollToBottom('smooth'));
      else setShowJump(true);
      delete timers.current[aiId];
    }, 650);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    send(text, text);
    setDraft('');
  };

  // -------------------- LISTA --------------------
  if (!inChat) {
    return (
      <div className={styles.screen}>
        <header className={styles.appbar}>
          {onBack && (
            <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Voltar">
              <Icon name="voltar" size={22} />
            </button>
          )}
          <div className={styles.titleWrap}>
            <span className={styles.brandRow}><Icon name="sparkles" size={16} /> IA · CalcMed</span>
            <span className={styles.subtitle}>Assistente clínico · demonstração</span>
          </div>
          <button type="button" className={styles.newBtn} onClick={openNew}>
            <Icon name="adicionar" size={18} /> Nova
          </button>
        </header>

        <div className={styles.listScroll}>
          {conversations.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyMark}><Icon name="sparkles" size={28} /></span>
              <h2 className={styles.emptyTitle}>Como posso ajudar no plantão?</h2>
              <p className={styles.emptyText}>
                Pergunte uma dose, descreva um caso, mande um exame ou peça um resumo. A resposta vem
                estruturada e com o próximo passo.
              </p>
              <SuggestionChips label="Comece por" items={STARTERS} onSelect={(item) => send(item.label, item.value)} />
            </div>
          ) : (
            <>
              <span className={styles.listLabel}>Conversas recentes</span>
              <ul className={styles.convList}>
                {conversations.map((c) => (
                  <li key={c.id} className={styles.convItem}>
                    <button type="button" className={styles.convOpen} onClick={() => openConv(c.id)}>
                      <span className={styles.convIcon}><Icon name="sparkles" size={18} /></span>
                      <span className={styles.convText}>
                        <span className={styles.convTitle}>{c.title || 'Nova conversa'}</span>
                        <span className={styles.convPreview}>{previewOf(c)}</span>
                      </span>
                      <span className={styles.convTime}>{relativeTime(c.createdAt)}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.convDelete}
                      onClick={() => deleteConv(c.id)}
                      aria-label="Apagar conversa"
                    >
                      <Icon name="excluir" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    );
  }

  // -------------------- CHAT --------------------
  const empty = messages.length === 0;
  return (
    <div className={styles.screen}>
      <header className={styles.appbar}>
        <button type="button" className={styles.iconBtn} onClick={backToList} aria-label="Voltar para conversas">
          <Icon name="voltar" size={22} />
        </button>
        <div className={styles.titleWrap}>
          <span className={styles.brandRow}>{active?.title || 'Nova conversa'}</span>
          <span className={styles.subtitle}>IA · CalcMed</span>
        </div>
        <button type="button" className={styles.iconBtn} onClick={openNew} aria-label="Nova conversa">
          <Icon name="adicionar" size={22} />
        </button>
      </header>

      <div className={styles.conversation} ref={scrollRef} onScroll={() => setShowJump(!isNearBottom())}>
        {empty ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark}><Icon name="sparkles" size={28} /></span>
            <h2 className={styles.emptyTitle}>Como posso ajudar?</h2>
            <p className={styles.emptyText}>Pergunte uma dose, descreva um caso ou mande um exame.</p>
            <SuggestionChips label="Comece por" items={STARTERS} onSelect={(item) => send(item.label, item.value)} />
          </div>
        ) : (
          <div className={styles.thread}>
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className={styles.userRow}>
                  <div className={styles.userBubble}>{m.text}</div>
                </div>
              ) : m.pending ? (
                <TypingDots key={m.id} />
              ) : (
                <div key={m.id} className={styles.aiRow}>
                  <AIResponseRenderer
                    response={m.response}
                    variant="plain"
                    onSelect={(value, meta) => send(meta?.label ?? value, value)}
                  />
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {showJump && (
        <button type="button" className={styles.jump} onClick={() => scrollToBottom()} aria-label="Ir para o fim">
          <Icon name="chevronDown" size={20} />
        </button>
      )}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Pergunte algo clínico…"
          aria-label="Mensagem para a IA"
        />
        <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Enviar">
          <Icon name="executar" size={20} />
        </button>
      </form>
    </div>
  );
}
