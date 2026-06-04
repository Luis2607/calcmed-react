import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import { AIResponseRenderer, SuggestionChips } from '../../shared/components/ai';
import { Toast } from '../../shared/components/molecules/Toast';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { respond, STARTERS } from './iaData';
import styles from './IAScreen.module.css';

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const nowTs = () => Date.now();
const truncate = (s, n = 42) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;

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
 * IAScreen — assistente clínico do protótipo.
 *
 * Fluxo: a aba IA abre DIRETO num chat novo (pronto pra digitar). O histórico de
 * conversas fica atrás do ícone de relógio no header (não é o foco). Respostas
 * são estruturadas (AIResponseRenderer, variante plain). O roteiro (iaData) faz
 * o papel do backend nesta demo.
 *
 * "Digitando" é estado EFÊMERO por conversa (nunca persiste).
 */
export function IAScreen({ onBack }) {
  const [conversations, setConversations] = usePersistedState('ia_conversations', []);
  const [activeId, setActiveId] = useState('new'); // 'new' = chat novo · id = conversa salva
  const [historyOpen, setHistoryOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [showJump, setShowJump] = useState(false);
  const [pending, setPending] = useState({}); // { [convId]: count } — efêmero
  const [toast, setToast] = useState(null);
  const scrollerRef = useRef(null); // a área de mensagens (único elemento que rola)
  const inputRef = useRef(null);
  const timers = useRef({});
  const toastTimer = useRef(null);
  const activeIdRef = useRef(activeId);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const active = activeId !== 'new' ? conversations.find((c) => c.id === activeId) : null;
  const messages = active?.messages ?? [];
  const pendingActive = active ? pending[active.id] || 0 : 0;

  const isNearBottom = () => {
    const el = scrollerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  const scrollToBottom = (behavior = 'smooth') => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    setShowJump(false);
  };

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => () => {
    Object.values(timers.current).forEach(clearTimeout);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Sanitiza dados legados: remove placeholders "pending" persistidos por versões antigas.
  useEffect(() => {
    setConversations((prev) => {
      if (!prev.some((c) => c.messages.some((m) => m.pending))) return prev;
      return prev.map((c) => ({ ...c, messages: c.messages.filter((m) => !m.pending) }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Foco no input ao abrir/trocar de chat (só em ponteiro fino p/ não forçar teclado no mobile).
  // Em conversa com histórico, rola pro fim.
  useEffect(() => {
    if (historyOpen) return;
    requestAnimationFrame(() => scrollToBottom('auto'));
    if (finePointer()) inputRef.current?.focus();
  }, [activeId, historyOpen]);

  const openHistory = () => setHistoryOpen(true);
  const newChat = () => { setActiveId('new'); setHistoryOpen(false); setDraft(''); setShowJump(false); };
  const openConv = (id) => { setActiveId(id); setHistoryOpen(false); setShowJump(false); };
  const deleteConv = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setPending((p) => { const n = { ...p }; delete n[id]; return n; });
    if (activeId === id) setActiveId('new');
  };

  const send = (displayText, lookup) => {
    const now = nowTs();
    const convId = active ? active.id : uid();
    const isNew = !active;
    const userMsg = { id: uid(), role: 'user', text: displayText };

    setConversations((prev) => {
      if (isNew) {
        return [{ id: convId, title: truncate(displayText), messages: [userMsg], createdAt: now, updatedAt: now }, ...prev];
      }
      const updated = prev.map((c) =>
        c.id === convId
          ? { ...c, title: c.title || truncate(displayText), messages: [...c.messages, userMsg], updatedAt: now }
          : c,
      );
      const target = updated.find((c) => c.id === convId);
      return [target, ...updated.filter((c) => c.id !== convId)];
    });
    setActiveId(convId);
    setPending((p) => ({ ...p, [convId]: (p[convId] || 0) + 1 }));
    requestAnimationFrame(() => scrollToBottom('smooth'));
    if (finePointer()) inputRef.current?.focus();

    const response = respond(lookup ?? displayText);
    // Velocidade onde importa: dose/crítico respondem rápido; o resto "pensa" um pouco.
    const fast = response.intent === 'dose' || response.intent === 'critico';
    const delay = fast ? 450 : Math.min(1300, 600 + (response.blocks?.length || 1) * 160);
    const tid = uid();
    timers.current[tid] = setTimeout(() => {
      const viewing = activeIdRef.current === convId;
      const stick = viewing && isNearBottom();
      const aiMsg = { id: uid(), role: 'ai', response };
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, aiMsg], updatedAt: nowTs() } : c)),
      );
      setPending((p) => {
        const n = { ...p };
        n[convId] = Math.max(0, (n[convId] || 1) - 1);
        if (!n[convId]) delete n[convId];
        return n;
      });
      if (viewing && stick) requestAnimationFrame(() => scrollToBottom('smooth'));
      else if (viewing) setShowJump(true);
      delete timers.current[tid];
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    send(text, text);
    setDraft('');
  };

  // -------------------- HISTÓRICO --------------------
  if (historyOpen) {
    return (
      <div className={styles.screen}>
        <header className={styles.appbar}>
          <button type="button" className={styles.iconBtn} onClick={() => setHistoryOpen(false)} aria-label="Voltar ao chat">
            <Icon name="voltar" size={22} />
          </button>
          <div className={styles.titleWrap}>
            <span className={styles.brandRow}>Conversas</span>
            <span className={styles.subtitle}>Seu histórico de IA</span>
          </div>
          <button type="button" className={styles.newBtn} onClick={newChat}>
            <Icon name="adicionar" size={18} /> Nova
          </button>
        </header>

        <div className={styles.listScroll}>
          {conversations.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyMark}><Icon name="tempo" size={28} /></span>
              <h2 className={styles.emptyTitle}>Nenhuma conversa ainda</h2>
              <p className={styles.emptyText}>Suas conversas com a IA aparecem aqui. Comece uma nova.</p>
              <button type="button" className={styles.newBtnLarge} onClick={newChat}>
                <Icon name="adicionar" size={18} /> Nova conversa
              </button>
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
                        <span className={styles.convPreview}>{pending[c.id] ? 'Digitando…' : previewOf(c)}</span>
                      </span>
                      <span className={styles.convTime}>{relativeTime(c.updatedAt ?? c.createdAt)}</span>
                    </button>
                    <button type="button" className={styles.convDelete} onClick={() => deleteConv(c.id)} aria-label="Apagar conversa">
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

  // -------------------- CHAT (padrão) --------------------
  const empty = messages.length === 0;
  return (
    <div className={styles.screen}>
      <header className={styles.appbar}>
        <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Voltar ao app">
          <Icon name="voltar" size={22} />
        </button>
        <div className={styles.titleWrap}>
          <span className={styles.brandRow}><Icon name="sparkles" size={16} /> IA · CalcMed</span>
          <span className={styles.subtitle}>Assistente clínico · demonstração</span>
        </div>
        <button type="button" className={styles.iconBtn} onClick={openHistory} aria-label="Ver conversas anteriores" title="Conversas">
          <Icon name="tempo" size={22} />
        </button>
      </header>

      {toast && (
        <div className={styles.toastHost}>
          <Toast type="success" message={toast} />
        </div>
      )}

      <div className={styles.conversation} ref={scrollerRef} onScroll={() => setShowJump(!isNearBottom())}>
        {empty ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark}><Icon name="sparkles" size={28} /></span>
            <h2 className={styles.emptyTitle}>Como posso ajudar no plantão?</h2>
            <p className={styles.emptyText}>
              Pergunte uma dose, descreva um caso, mande um exame ou peça um resumo — a resposta vem
              estruturada e com o próximo passo.
            </p>
            <SuggestionChips label="Comece por" items={STARTERS} onSelect={(item) => send(item.label, item.value)} />
          </div>
        ) : (
          <div className={styles.thread} role="log" aria-live="polite">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className={styles.userRow}>
                  <div className={styles.userBubble}>{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className={styles.aiRow}>
                  <AIResponseRenderer
                    response={m.response}
                    variant="plain"
                    onSelect={(value, meta) => send(meta?.label ?? value, value)}
                    onCopied={showToast}
                  />
                </div>
              ),
            )}
            {pendingActive > 0 && <TypingDots />}
          </div>
        )}
      </div>

      {showJump && (
        <div className={styles.jumpDock}>
          <button type="button" className={styles.jump} onClick={() => scrollToBottom()} aria-label="Ir para o fim">
            <Icon name="chevronDown" size={20} />
          </button>
        </div>
      )}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Pergunte algo clínico…"
          aria-label="Mensagem para a IA"
          enterKeyHint="send"
        />
        <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Enviar">
          <Icon name="executar" size={20} />
        </button>
      </form>
    </div>
  );
}
