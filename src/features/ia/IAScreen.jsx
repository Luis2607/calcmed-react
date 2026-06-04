import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader';
import { AIResponseRenderer } from '../../shared/components/ai';
import { Toast } from '../../shared/components/molecules/Toast';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { IAOnboarding } from './IAOnboarding';
import { MessageActions } from './MessageActions';
import { respond, STARTERS } from './iaData';
import { countUnits, sliceResponse, responseToText } from './iaStream';
import styles from './IAScreen.module.css';

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const nowTs = () => Date.now();
const truncate = (s, n = 42) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;

function greetingPrefix() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function relativeTime(ts) {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `${d} d`;
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
 * StreamingMessage — revela a resposta progressivamente (efeito de digitação).
 * Mantém o progresso EFÊMERO (não persiste). Ao parar (stopSignal) ou terminar,
 * chama onDone(units, stopped) para o pai finalizar.
 */
function StreamingMessage({ response, startUnits = 0, onSelect, onProgress, onDone, stopSignal }) {
  // Remonta a cada novo stream (key no pai) → units/refs começam em startUnits
  // (0 num stream novo; revealedUnits ao "Continuar" uma resposta interrompida).
  const [units, setUnits] = useState(startUnits);
  const unitsRef = useRef(startUnits);
  const intervalRef = useRef(null);
  const stopRef = useRef(stopSignal);
  const doneRef = useRef(false);

  useEffect(() => {
    const total = countUnits(response);
    intervalRef.current = setInterval(() => {
      const n = unitsRef.current + 1;
      unitsRef.current = n;
      setUnits(n);
      onProgress?.();
      if (n >= total) {
        clearInterval(intervalRef.current);
        if (!doneRef.current) { doneRef.current = true; onDone?.(n, false); }
      }
    }, 26);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stopSignal === stopRef.current) return;
    stopRef.current = stopSignal;
    clearInterval(intervalRef.current);
    if (!doneRef.current) { doneRef.current = true; onDone?.(unitsRef.current, true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopSignal]);

  return (
    <AIResponseRenderer response={sliceResponse(response, units)} variant="plain" onSelect={onSelect} />
  );
}

/**
 * IAScreen — assistente clínico do protótipo: chat direto (com streaming),
 * histórico, onboarding de 1º acesso e ações por mensagem.
 */
export function IAScreen({ onBack }) {
  const [conversations, setConversations] = usePersistedState('ia_conversations', []);
  const [onboarded, setOnboarded] = usePersistedState('ia_onboarded', false);
  const [activeId, setActiveId] = useState('new');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [showJump, setShowJump] = useState(false);
  const [pending, setPending] = useState({}); // { [convId]: count } — efêmero
  const [streamingId, setStreamingId] = useState(null); // msg em streaming (efêmero)
  const [streamNonce, setStreamNonce] = useState(0); // key p/ remontar o StreamingMessage
  const [stopSignal, setStopSignal] = useState(0);
  const [toast, setToast] = useState(null);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef({});
  const toastTimer = useRef(null);
  const activeIdRef = useRef(activeId);

  const active = activeId !== 'new' ? conversations.find((c) => c.id === activeId) : null;
  const messages = active?.messages ?? [];
  const pendingActive = active ? pending[active.id] || 0 : 0;
  const busy = pendingActive > 0 || streamingId != null;

  const showToast = (message, undo) => {
    setToast({ message, undo });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // Toasts com "Desfazer" ficam mais tempo (janela de recuperação).
    toastTimer.current = setTimeout(() => setToast(null), undo ? 5000 : 1800);
  };
  const dismissToast = () => { setToast(null); if (toastTimer.current) clearTimeout(toastTimer.current); };

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
  const keepBottom = () => { if (isNearBottom()) scrollToBottom('auto'); };

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => () => {
    Object.values(timers.current).forEach(clearTimeout);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Sanitiza dados legados (placeholders pending de versões antigas).
  useEffect(() => {
    setConversations((prev) => {
      if (!prev.some((c) => c.messages.some((m) => m.pending))) return prev;
      return prev.map((c) => ({ ...c, messages: c.messages.filter((m) => !m.pending) }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!onboarded || historyOpen || aboutOpen) return;
    requestAnimationFrame(() => scrollToBottom('auto'));
    if (finePointer()) inputRef.current?.focus();
  }, [activeId, historyOpen, aboutOpen, onboarded]);

  // Ao navegar, encerra o streaming visual (a mensagem já está persistida e
  // reaparece completa). Sem isso, sair da conversa no meio do streaming deixava
  // streamingId preso → busy eterno (composer/Parar travados).
  const openHistory = () => { setStreamingId(null); setHistoryOpen(true); };
  const newChat = () => { setStreamingId(null); setActiveId('new'); setHistoryOpen(false); setDraft(''); setShowJump(false); };
  const openConv = (id) => { setStreamingId(null); setActiveId(id); setHistoryOpen(false); setShowJump(false); };
  const deleteConv = (id) => {
    const idx = conversations.findIndex((c) => c.id === id);
    const removed = idx >= 0 ? conversations[idx] : null;
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setPending((p) => { const n = { ...p }; delete n[id]; return n; });
    if (activeId === id) setActiveId('new');
    if (removed) {
      showToast('Conversa apagada', () => {
        setConversations((prev) => {
          if (prev.some((c) => c.id === removed.id)) return prev; // já restaurada
          const next = [...prev];
          next.splice(Math.min(idx, next.length), 0, removed); // volta na posição original
          return next;
        });
      });
    }
  };

  const updateMessage = (convId, msgId, patch) =>
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: c.messages.map((m) => (m.id === msgId ? { ...m, ...patch } : m)) } : c)),
    );

  const send = (displayText, lookup, forceNew = false) => {
    if (busy && !forceNew) return; // forceNew (nova conversa) nunca é bloqueado por outra ocupada
    const now = nowTs();
    const target = forceNew ? null : active; // forceNew: começa SEMPRE uma conversa nova
    const convId = target ? target.id : uid();
    const isNew = !target;
    const userMsg = { id: uid(), role: 'user', text: displayText, lookup: lookup ?? displayText };

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
    const think = response.intent === 'dose' || response.intent === 'critico' ? 280 : 460;
    const tid = uid();
    timers.current[tid] = setTimeout(() => {
      const viewing = activeIdRef.current === convId;
      const aiId = uid();
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, { id: aiId, role: 'ai', response }], updatedAt: nowTs() } : c)),
      );
      setPending((p) => {
        const n = { ...p };
        n[convId] = Math.max(0, (n[convId] || 1) - 1);
        if (!n[convId]) delete n[convId];
        return n;
      });
      if (viewing) {
        setStreamingId(aiId); // inicia o streaming dessa mensagem
        setStreamNonce((n) => n + 1);
        requestAnimationFrame(() => scrollToBottom('smooth'));
      }
      delete timers.current[tid];
    }, think);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    send(text, text);
    setDraft('');
  };

  // Composer do histórico: começa uma conversa NOVA e já abre o chat.
  const handleSubmitNew = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setHistoryOpen(false);
    send(text, text, true);
    setDraft('');
  };

  const handleStop = () => {
    if (streamingId) {
      setStopSignal((s) => s + 1); // o StreamingMessage finaliza no ponto atual
      return;
    }
    // ainda "pensando": cancela a resposta pendente
    Object.keys(timers.current).forEach((tid) => { clearTimeout(timers.current[tid]); delete timers.current[tid]; });
    setPending((p) => { const n = { ...p }; if (active) delete n[active.id]; return n; });
  };

  const finishStream = (msgId, units, stopped) => {
    // Parado → guarda até onde revelou (resposta interrompida). Concluído → limpa
    // revealedUnits para a resposta aparecer completa (inclusive após "Continuar").
    if (active) updateMessage(active.id, msgId, { revealedUnits: stopped ? units : undefined });
    setStreamingId(null);
    requestAnimationFrame(() => scrollToBottom('auto'));
  };

  // Retoma uma resposta interrompida do ponto em que parou (revealedUnits).
  const continueStream = (m) => {
    if (busy) return;
    setStreamingId(m.id);
    setStreamNonce((n) => n + 1);
    requestAnimationFrame(() => scrollToBottom('smooth'));
  };

  const setFeedback = (msgId, value) => {
    if (active) updateMessage(active.id, msgId, { feedback: value });
    if (value) showToast('Anotado.');
  };
  const regenerate = (m) => {
    if (busy || !active) return;
    const idx = messages.findIndex((x) => x.id === m.id);
    const prevUser = messages.slice(0, idx).reverse().find((x) => x.role === 'user');
    // clone p/ nova identidade → o StreamingMessage reinicia o streaming
    const response = { ...respond(prevUser?.lookup ?? prevUser?.text ?? '') };
    updateMessage(active.id, m.id, { response, revealedUnits: undefined, feedback: undefined });
    setStreamingId(m.id);
    setStreamNonce((n) => n + 1);
    requestAnimationFrame(() => scrollToBottom('smooth'));
  };

  const renderAi = (m, isLast) => {
    if (m.id === streamingId) {
      return (
        <StreamingMessage
          key={`stream-${streamNonce}`}
          response={m.response}
          startUnits={m.revealedUnits ?? 0}
          onSelect={(value, meta) => send(meta?.label ?? value, value)}
          onProgress={keepBottom}
          onDone={(units, stopped) => finishStream(m.id, units, stopped)}
          stopSignal={stopSignal}
        />
      );
    }
    const interrupted = m.revealedUnits != null;
    const resp = interrupted ? sliceResponse(m.response, m.revealedUnits) : m.response;
    return (
      <>
        <AIResponseRenderer
          response={resp}
          variant="plain"
          onSelect={(value, meta) => send(meta?.label ?? value, value)}
        />
        {interrupted && (
          <div className={styles.interrupted}>
            <span className={styles.interruptedLabel}>
              <Icon name="atencao" size={14} /> Resposta interrompida
            </span>
            <button type="button" className={styles.continueBtn} onClick={() => continueStream(m)} disabled={busy}>
              <Icon name="play" size={14} /> Continuar
            </button>
          </div>
        )}
        <MessageActions
          copyText={() => responseToText(resp)}
          feedback={m.feedback ?? null}
          onFeedback={(v) => setFeedback(m.id, v)}
          onRegenerate={isLast && !busy ? () => regenerate(m) : undefined}
        />
      </>
    );
  };

  // -------------------- HISTÓRICO --------------------
  if (historyOpen) {
    return (
      <div className={styles.screen}>
        <ProtocolHeader
          onBack={() => setHistoryOpen(false)}
          title="Conversas"
          subtitle="Seu histórico de IA"
          actions={[{ icon: 'plus', label: 'Nova conversa', onClick: newChat }]}
        />

        {toast && (
          <div className={styles.toastHost}>
            <Toast
              type="success"
              message={toast.message}
              onUndo={toast.undo ? () => { toast.undo(); dismissToast(); } : undefined}
            />
          </div>
        )}

        <div className={styles.listScroll}>
          {conversations.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyMark}><Icon name="tempo" size={28} /></span>
              <h2 className={styles.emptyTitle}>Nenhuma conversa ainda</h2>
              <p className={styles.emptyText}>Escreva abaixo pra começar — suas conversas com a IA ficam aqui.</p>
            </div>
          ) : (
            <>
              <span className={styles.listLabel}>Conversas recentes</span>
              <ul className={styles.convList}>
                {conversations.map((c) => (
                  <li key={c.id} className={styles.convItem}>
                    <button type="button" className={styles.convOpen} onClick={() => openConv(c.id)}>
                      <span className={styles.convText}>
                        <span className={styles.convTitle}>{c.title || 'Nova conversa'}</span>
                        <span className={styles.convDate}>{relativeTime(c.updatedAt ?? c.createdAt)}</span>
                      </span>
                    </button>
                    <button type="button" className={styles.convDelete} onClick={() => deleteConv(c.id)} aria-label="Apagar conversa">
                      <Icon name="excluir" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button type="button" className={styles.aboutLink} onClick={() => setAboutOpen(true)}>
            <Icon name="informacao" size={16} /> Sobre a IA · avisos
          </button>
        </div>

        <form className={styles.composer} onSubmit={handleSubmitNew}>
          <input
            className={styles.input}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Começar uma nova conversa…"
            aria-label="Nova mensagem para a IA"
            enterKeyHint="send"
          />
          <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Começar">
            <Icon name="executar" size={20} />
          </button>
        </form>

        <IAOnboarding open={aboutOpen} onClose={() => setAboutOpen(false)} ctaLabel="Fechar" />
      </div>
    );
  }

  // -------------------- CHAT (padrão) --------------------
  const empty = messages.length === 0;
  return (
    <div className={styles.screen}>
      <ProtocolHeader
        onBack={onBack}
        title="IA · CalcMed"
        subtitle="Assistente clínico"
        actions={[{ icon: 'clock', label: 'Conversas anteriores', onClick: openHistory }]}
      />

      {toast && (
        <div className={styles.toastHost}>
          <Toast
            type="success"
            message={toast.message}
            onUndo={toast.undo ? () => { toast.undo(); dismissToast(); } : undefined}
          />
        </div>
      )}

      <div className={styles.conversation} ref={scrollerRef} onScroll={() => setShowJump(!isNearBottom())}>
        {empty ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark}><Icon name="sparkles" size={28} /></span>
            <span className={styles.greeting}>{greetingPrefix()}</span>
            <h2 className={styles.emptyTitle}>Como posso ajudar no plantão?</h2>
            <p className={styles.emptyText}>
              Dose, conduta, interpretação de exame ou um resumo pra evolução. É só perguntar.
            </p>
          </div>
        ) : (
          <div className={styles.thread} role="log" aria-live="polite" aria-busy={busy || undefined}>
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={m.id} className={styles.userRow}>
                  <div className={styles.userBubble}>{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className={styles.aiRow}>
                  {renderAi(m, i === messages.length - 1)}
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

      {empty && (
        <div className={styles.suggestStrip} role="group" aria-label="Sugestões para começar">
          {STARTERS.map((s) => (
            <button
              key={s.value}
              type="button"
              className={styles.suggestChip}
              onClick={() => send(s.label, s.value)}
            >
              <Icon name={s.icon} size={16} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Dose, conduta, exame…"
          aria-label="Mensagem para a IA"
          enterKeyHint="send"
        />
        {busy ? (
          <button type="button" className={styles.stop} onClick={handleStop} aria-label="Parar">
            <span className={styles.stopSquare} />
          </button>
        ) : (
          <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Enviar">
            <Icon name="executar" size={20} />
          </button>
        )}
      </form>

      <IAOnboarding open={!onboarded} onClose={() => setOnboarded(true)} blocking />
    </div>
  );
}
