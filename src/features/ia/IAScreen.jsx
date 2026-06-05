import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader';
import { AIResponseRenderer } from '../../shared/components/ai';
import { Toast } from '../../shared/components/molecules/Toast';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { IAOnboarding } from './IAOnboarding';
import { IAFeedbackSheet } from './IAFeedbackSheet';
import { MessageActions } from './MessageActions';
import { respond, STARTERS } from './iaData';
import { countUnits, sliceResponse, responseToText } from './iaStream';
import styles from './IAScreen.module.css';

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const nowTs = () => Date.now();
const truncate = (s, n = 42) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;

// Composer multilinha: cresce de 1 até ~5 linhas (depois rola). max-height no CSS.
const autoGrow = (el) => {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
};
// Enter envia · Shift+Enter quebra linha · respeita composição IME.
const composerKeyDown = (e, submit) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault();
    submit(e);
  }
};

function greetingPrefix() {
  const h = new Date().getHours();
  if (h < 5) return 'Boa madrugada'; // reconhece quem está de plantão de madrugada
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

// Rótulo do "pensando" por intenção (semântica de estado, não só pontinhos).
const THINK_LABELS = {
  dose: 'Calculando a dose…', critico: 'Avaliando o risco…', exame: 'Interpretando…',
  protocolo: 'Montando o protocolo…', comparacao: 'Comparando…', aprendizado: 'Organizando…',
  explicacao: 'Explicando…',
  resumo: 'Resumindo…', triagem: 'Triando…', operacional: 'Montando a conduta…',
};

function TypingDots({ label = 'Pensando…' }) {
  return (
    <div className={styles.aiRow}>
      <div className={styles.typingWrap}>
        <span className={styles.typingLabel}>
          <span aria-hidden="true"><Icon name="sparkles" size={14} /></span> {label}
        </span>
        <span className={styles.typing} aria-label={label}>
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
  // prefers-reduced-motion: nasce já completo (sem "digitar") — evita setState no effect.
  const reduce = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = countUnits(response);
  const initial = reduce ? total : startUnits;
  // Remonta a cada novo stream (key no pai) → units/refs começam em initial
  // (0 num stream novo; revealedUnits ao "Continuar" uma resposta interrompida).
  const [units, setUnits] = useState(initial);
  const unitsRef = useRef(initial);
  const intervalRef = useRef(null);
  const stopRef = useRef(stopSignal);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(total, false); }
      return;
    }
    intervalRef.current = setInterval(() => {
      const n = unitsRef.current + 1;
      unitsRef.current = n;
      setUnits(n);
      onProgress?.();
      if (n >= total) {
        clearInterval(intervalRef.current);
        if (!doneRef.current) { doneRef.current = true; onDone?.(n, false); }
      }
    }, 48); // revelação mais gradual (antes 26ms) — texto "vem vindo" com calma
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
export function IAScreen({ onBack, onNavigate }) {
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
  const [fbSheet, setFbSheet] = useState({ open: false, msgId: null, value: null });
  const [pendingLabel, setPendingLabel] = useState('Pensando…');
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef({});
  const toastTimer = useRef(null);
  const sendingRef = useRef(false); // trava síncrona contra double-tap (busy é assíncrono)
  const timerConv = useRef({}); // tid → convId (parar/limpar timer só da conversa certa)
  const editLookupRef = useRef(null); // { text, lookup } da pergunta em edição (preserva o token)
  const activeIdRef = useRef(activeId);

  const active = activeId !== 'new' ? conversations.find((c) => c.id === activeId) : null;
  const messages = active?.messages ?? [];
  const pendingActive = active ? pending[active.id] || 0 : 0;
  const busy = pendingActive > 0 || streamingId != null;

  const showToast = (message, undo, type = 'success') => {
    setToast({ message, undo, type });
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
  const newChat = () => { editLookupRef.current = null; setStreamingId(null); setActiveId('new'); setHistoryOpen(false); setDraft(''); setShowJump(false); };
  const openConv = (id) => { editLookupRef.current = null; setStreamingId(null); setActiveId(id); setHistoryOpen(false); setShowJump(false); };
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
    if (sendingRef.current) return; // bloqueia 2º toque antes do busy assíncrono subir
    if (busy && !forceNew) return; // forceNew (nova conversa) nunca é bloqueado por outra ocupada
    sendingRef.current = true;
    requestAnimationFrame(() => { sendingRef.current = false; }); // libera após o render (busy já cobre)
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
    setPendingLabel(THINK_LABELS[response.intent] || 'Pensando…');
    // "Pensar" por intenção: urgência (dose/crítico/protocolo) responde rápido;
    // raciocínio mais longo só onde agrega (comparação/aprendizado).
    const urgent = ['dose', 'critico', 'protocolo'].includes(response.intent);
    const slow = ['comparacao', 'aprendizado', 'explicacao'].includes(response.intent);
    const think = urgent ? 700 : slow ? 2400 : 1500;
    const tid = uid();
    timerConv.current[tid] = convId;
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
      delete timerConv.current[tid];
    }, think);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    // edição: texto inalterado → reenvia pelo token original (não cai no fallback).
    const edit = editLookupRef.current;
    const lookup = edit && edit.text === text ? edit.lookup : text;
    editLookupRef.current = null;
    send(text, lookup);
    setDraft('');
    requestAnimationFrame(() => autoGrow(inputRef.current)); // volta o textarea a 1 linha
  };

  // Seleção de chip/seletor/ação. Deep-link (open_tool) SAI do chat e abre a
  // ferramenta do CalcMed; o resto continua a conversa como nova pergunta. A
  // conversa persiste em localStorage, então voltar pra IA a mantém intacta.
  const handleSelect = (value, meta) => {
    if (meta?.type === 'open_tool' && meta.route) { onNavigate?.(meta.route); return; }
    send(meta?.label ?? value, value);
  };

  // Composer do histórico: começa uma conversa NOVA e já abre o chat.
  const handleSubmitNew = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    editLookupRef.current = null;
    setHistoryOpen(false);
    send(text, text, true);
    setDraft('');
    requestAnimationFrame(() => autoGrow(inputRef.current));
  };

  const handleStop = () => {
    if (streamingId) {
      setStopSignal((s) => s + 1); // o StreamingMessage finaliza no ponto atual
      return;
    }
    // ainda "pensando": cancela a resposta pendente e deixa um marcador (não some
    // a pergunta órfã sem dar caminho de volta).
    // cancela só os timers da conversa ATIVA (não mata gerações de outras conversas)
    Object.keys(timers.current).forEach((tid) => {
      if (!active || timerConv.current[tid] === active.id) {
        clearTimeout(timers.current[tid]);
        delete timers.current[tid];
        delete timerConv.current[tid];
      }
    });
    setPending((p) => { const n = { ...p }; if (active) delete n[active.id]; return n; });
    if (active) {
      const lastUser = [...active.messages].reverse().find((x) => x.role === 'user');
      if (lastUser) {
        const cid = uid();
        setConversations((prev) =>
          prev.map((c) => (c.id === active.id
            ? { ...c, messages: [...c.messages, { id: cid, role: 'ai', cancelled: true, text: lastUser.text, lookup: lastUser.lookup }] }
            : c)),
        );
      }
    }
  };

  // Retoma uma geração cancelada: remove o marcador + a pergunta órfã e reenvia.
  const retry = (m) => {
    if (busy || !active) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c;
        let msgs = c.messages.filter((x) => x.id !== m.id);
        const lui = msgs.map((x) => x.role).lastIndexOf('user');
        if (lui >= 0) msgs = msgs.slice(0, lui);
        return { ...c, messages: msgs };
      }),
    );
    send(m.text, m.lookup);
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
    // Selecionar 👍/👎 abre o sheet de motivo; desmarcar fecha.
    if (value) setFbSheet({ open: true, msgId, value });
    else setFbSheet((s) => (s.msgId === msgId ? { open: false, msgId: null, value: null } : s));
  };

  const submitFeedback = ({ reasons, detail }) => {
    if (active && fbSheet.msgId) {
      updateMessage(active.id, fbSheet.msgId, { feedbackReasons: reasons, feedbackDetail: detail });
    }
    setFbSheet({ open: false, msgId: null, value: null });
    showToast('Anotado.');
  };
  const regenerate = (m) => {
    if (busy || !active) return;
    const convId = active.id;
    const idx = messages.findIndex((x) => x.id === m.id);
    const prevUser = messages.slice(0, idx).reverse().find((x) => x.role === 'user');
    // snapshot p/ desfazer (refazer pode devolver o mesmo conteúdo)
    const prev = { response: m.response, revealedUnits: m.revealedUnits, feedback: m.feedback };
    // clone p/ nova identidade → o StreamingMessage reinicia o streaming
    const response = { ...respond(prevUser?.lookup ?? prevUser?.text ?? '') };
    updateMessage(convId, m.id, { response, revealedUnits: undefined, feedback: undefined });
    setStreamingId(m.id);
    setStreamNonce((n) => n + 1);
    requestAnimationFrame(() => scrollToBottom('smooth'));
    showToast('Resposta refeita', () => {
      setStreamingId(null);
      updateMessage(convId, m.id, prev);
    });
  };

  // Editar/reenviar a própria pergunta: devolve o texto ao composer e remove
  // essa pergunta + o que veio depois (o usuário reformula e manda de novo).
  const editMessage = (m) => {
    if (busy || !active) return;
    const idx = messages.findIndex((x) => x.id === m.id);
    if (idx < 0) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, messages: c.messages.slice(0, idx) } : c)),
    );
    setStreamingId(null);
    setDraft(m.text);
    // guarda o token original: se o texto não mudar, reenvia pelo mesmo nó
    // (sem isso, editar uma pergunta vinda de chip cairia no fallback).
    editLookupRef.current = { text: m.text, lookup: m.lookup };
    requestAnimationFrame(() => {
      autoGrow(inputRef.current);
      inputRef.current?.focus();
    });
  };

  const renderAi = (m, isLast) => {
    if (m.cancelled) {
      return (
        <div className={styles.interrupted}>
          <span className={styles.interruptedLabel}><Icon name="atencao" size={14} /> Resposta cancelada</span>
          <button type="button" className={styles.continueBtn} onClick={() => retry(m)} disabled={busy}>
            <Icon name="executar" size={14} /> Tentar de novo
          </button>
        </div>
      );
    }
    if (m.id === streamingId) {
      // aria-hidden: o leitor de tela anuncia a resposta uma vez ao concluir (não token a
      // token). pointer-events:none: chips/seletores revelados no meio do stream não viram
      // afordância morta (o clique seria engolido por busy).
      return (
        <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
          <StreamingMessage
            key={`stream-${streamNonce}`}
            response={m.response}
            startUnits={m.revealedUnits ?? 0}
            onSelect={handleSelect}
            onProgress={keepBottom}
            onDone={(units, stopped) => finishStream(m.id, units, stopped)}
            stopSignal={stopSignal}
          />
        </div>
      );
    }
    const interrupted = m.revealedUnits != null;
    const resp = interrupted ? sliceResponse(m.response, m.revealedUnits) : m.response;
    return (
      <>
        <AIResponseRenderer
          response={resp}
          variant="plain"
          onSelect={handleSelect}
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
              type={toast.type || 'success'}
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
          <textarea
            ref={inputRef}
            className={styles.input}
            value={draft}
            rows={1}
            onChange={(e) => { setDraft(e.target.value); autoGrow(e.target); }}
            onKeyDown={(e) => composerKeyDown(e, handleSubmitNew)}
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
  const lastUserIdx = messages.map((x) => x.role).lastIndexOf('user');
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
            type={toast.type || 'success'}
            message={toast.message}
            onUndo={toast.undo ? () => { toast.undo(); dismissToast(); } : undefined}
          />
        </div>
      )}

      <div
        className={styles.conversation}
        data-empty={empty || undefined}
        ref={scrollerRef}
        onScroll={() => setShowJump(!isNearBottom())}
      >
        {empty ? (
          <div className={styles.empty}>
            <div className={styles.brand}>
              <span className={styles.brandMark}><Icon name="ia" size={26} /></span>
              <div className={styles.brandText}>
                <strong className={styles.brandName}>CalcMed IA</strong>
                <span className={styles.brandTag}>Assistente clínico</span>
              </div>
            </div>
            <span className={styles.greeting}>{greetingPrefix()}</span>
            <h2 className={styles.emptyTitle}>Como posso ajudar no plantão?</h2>
            <p className={styles.emptyText}>
              Dose, conduta, interpretação de exame ou um resumo pra evolução. É só perguntar.
            </p>
            <p className={styles.evidenceNote}>
              <Icon name="informacao" size={14} aria-hidden="true" />
              Respostas baseadas em evidências. Valide com seu julgamento.
            </p>
          </div>
        ) : (
          <div className={styles.thread} role="log" aria-live="polite" aria-busy={busy || undefined}>
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={m.id} className={styles.userRow}>
                  {i === lastUserIdx && !busy && (
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => editMessage(m)}
                      aria-label="Editar e reenviar"
                      title="Editar"
                    >
                      <Icon name="editar" size={14} />
                    </button>
                  )}
                  <div className={styles.userBubble}>{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className={styles.aiRow}>
                  {renderAi(m, i === messages.length - 1)}
                </div>
              ),
            )}
            {pendingActive > 0 && <TypingDots label={pendingLabel} />}
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
        <section className={styles.suggest} aria-label="Sugestões para começar">
          <h3 className={styles.suggestLabel}>Comece por aqui</h3>
          <div
            className={styles.suggestGrid}
            role="group"
            tabIndex={0}
            aria-label="Sugestões — role para a direita para ver mais"
          >
            {STARTERS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={styles.suggestCard}
                onClick={() => send(s.label, s.value)}
              >
                <span className={styles.cardIcon}><Icon name={s.icon} size={20} aria-hidden="true" /></span>
                <span className={styles.cardLabel}>{s.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={draft}
          rows={1}
          onChange={(e) => { setDraft(e.target.value); autoGrow(e.target); }}
          onKeyDown={(e) => composerKeyDown(e, handleSubmit)}
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

      <IAFeedbackSheet
        open={fbSheet.open}
        value={fbSheet.value}
        onClose={() => setFbSheet({ open: false, msgId: null, value: null })}
        onSubmit={submitFeedback}
      />

      <IAOnboarding open={!onboarded} onClose={() => setOnboarded(true)} blocking />
    </div>
  );
}
