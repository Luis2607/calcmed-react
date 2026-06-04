import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import { AIResponseRenderer, SuggestionChips } from '../../shared/components/ai';
import { respond, STARTERS } from './iaData';
import styles from './IAScreen.module.css';

/**
 * IAScreen — tela de IA do protótipo (aba "IA" da navbar). Um "sistema
 * operacional conversacional clínico": o usuário pergunta, a IA reconhece a
 * intenção e responde em blocos estruturados (AIResponseRenderer), conduzindo
 * o próximo passo. O roteiro (iaData) faz o papel do backend nesta demo.
 */
export function IAScreen({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const idRef = useRef(0);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // displayText: o que aparece na bolha do usuário · lookup: token/texto p/ resolver.
  const send = (displayText, lookup) => {
    const userId = ++idRef.current;
    const aiId = ++idRef.current;
    const response = respond(lookup ?? displayText);
    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text: displayText },
      { id: aiId, role: 'ai', response },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    send(text, text);
    setDraft('');
  };

  const empty = messages.length === 0;

  return (
    <div className={styles.screen}>
      <header className={styles.appbar}>
        {onBack && (
          <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Voltar">
            <Icon name="voltar" size={22} />
          </button>
        )}
        <div className={styles.titleWrap}>
          <span className={styles.brandRow}>
            <Icon name="sparkles" size={16} />
            IA · CalcMed
          </span>
          <span className={styles.subtitle}>Assistente clínico · demonstração</span>
        </div>
      </header>

      <main className={styles.conversation}>
        {empty ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark}><Icon name="sparkles" size={28} /></span>
            <h2 className={styles.emptyTitle}>Como posso ajudar no plantão?</h2>
            <p className={styles.emptyText}>
              Pergunte uma dose, descreva um caso, mande um exame ou peça um resumo. A resposta vem
              estruturada e com o próximo passo.
            </p>
            <SuggestionChips
              label="Comece por"
              items={STARTERS}
              onSelect={(item) => send(item.label, item.value)}
            />
          </div>
        ) : (
          <div className={styles.thread}>
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className={styles.userRow}>
                  <div className={styles.userBubble}>{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className={styles.aiRow}>
                  <AIResponseRenderer
                    response={m.response}
                    onSelect={(value, meta) => send(meta?.label ?? value, value)}
                  />
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>
        )}
      </main>

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
