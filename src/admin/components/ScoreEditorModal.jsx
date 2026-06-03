import { useEffect, useMemo, useRef, useState } from 'react';
import { DesktopModal } from './DesktopModal';
import { PreviewScore } from './PreviewScore';
import { Button } from '../../shared/components/atoms/Button';
import { Icon } from '../../shared/components/atoms/Icon';
import { CategoryDropdown } from './CategoryDropdown';
import { categoryOptions } from '../data/categories';
import { emptyScore, normalizeScore, serializeScore, validateScore } from '../data/scoreSchema';
import { scoresStore } from '../data/scoresStore';
import { toastStore } from '../data/toastStore';
import styles from './ScoreEditorModal.module.css';

// "Sem categoria" no topo + as 5 categorias (single-select: o escore tem 1 categoria).
const CATEGORY_OPTIONS = [{ value: '', label: 'Sem categoria' }, ...categoryOptions];

/**
 * Editor de 1 escore (adicionar OU editar). Fonte única = o texto JSON.
 * Esquerda: categoria (select amigável, reescreve o JSON) + JSON (colar/editar/upload) + validação.
 * Direita: preview ao vivo. Salvar bloqueado enquanto houver erro.
 */
export function ScoreEditorModal({ open, score, onClose }) {
  const [jsonText, setJsonText] = useState('');
  const fileRef = useRef(null);
  const lastValid = useRef(null);

  useEffect(() => {
    if (open) {
      lastValid.current = null;
      setJsonText(serializeScore(score || emptyScore()));
    }
  }, [open, score]);

  const parsed = useMemo(() => {
    try {
      return { ok: true, value: JSON.parse(jsonText) };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [jsonText]);

  const validation = parsed.ok
    ? validateScore(parsed.value)
    : { errors: [`JSON inválido: ${parsed.error}`], warnings: [] };

  const previewScore = useMemo(() => {
    if (parsed.ok) {
      const n = normalizeScore(parsed.value);
      lastValid.current = n;
      return n;
    }
    return lastValid.current;
  }, [parsed]);

  const currentCategory = parsed.ok ? parsed.value.category || '' : '';
  const setCategory = (cat) => {
    if (!parsed.ok) return;
    setJsonText(serializeScore({ ...parsed.value, category: cat }));
  };

  const canSave = parsed.ok && validation.errors.length === 0;

  const handleSave = () => {
    if (!canSave) return;
    scoresStore.upsert(normalizeScore(parsed.value));
    toastStore.show({ message: score ? 'Escore salvo' : 'Escore adicionado' });
    onClose?.();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setJsonText(text);
    e.target.value = '';
  };

  return (
    <DesktopModal
      open={open}
      onClose={onClose}
      size="wide"
      title={score ? 'Editar escore' : 'Adicionar escore'}
      description={score ? score.name : 'Cole o JSON do escore, ajuste a categoria e veja o resultado ao vivo.'}
      closeOnBackdrop={false}
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" size="lg" onClick={handleSave} disabled={!canSave}>Salvar Escore</Button>
        </>
      }
    >
      <div className={styles.grid}>
        <div className={styles.editor}>
          <div className={styles.field}>
            <span className={styles.label}>Categoria</span>
            <CategoryDropdown
              block
              options={CATEGORY_OPTIONS}
              value={currentCategory}
              onChange={setCategory}
              disabled={!parsed.ok}
              placeholder="Sem categoria"
              ariaLabel="Categoria"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>JSON do escore</span>
              <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                <Icon name="adicionar" size={16} />
                Carregar arquivo .json
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFile}
                className={styles.fileInput}
              />
            </div>
            <span className={styles.hint}>Cole o JSON de um escore (formato do banco) ou ajuste direto aqui.</span>
            <textarea
              className={styles.textarea}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              aria-label="JSON do escore"
            />
          </div>

          <ValidationPanel errors={validation.errors} warnings={validation.warnings} />
        </div>

        <div className={styles.previewPane}>
          <span className={styles.previewLabel}>Pré-visualização</span>
          <div className={styles.previewScroll}>
            {previewScore ? (
              <PreviewScore score={previewScore} />
            ) : (
              <p className={styles.previewEmpty}>Corrija o JSON para ver a pré-visualização.</p>
            )}
          </div>
        </div>
      </div>
    </DesktopModal>
  );
}

function ValidationPanel({ errors, warnings }) {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className={`${styles.validation} ${styles.validationOk}`}>
        <Icon name="sucesso" size={18} />
        <span>Tudo certo — pronto pra salvar.</span>
      </div>
    );
  }
  return (
    <div className={styles.validation}>
      {errors.map((msg, i) => (
        <div key={`e${i}`} className={styles.msgError}>
          <Icon name="critico" size={18} />
          <span>{msg}</span>
        </div>
      ))}
      {warnings.map((msg, i) => (
        <div key={`w${i}`} className={styles.msgWarn}>
          <Icon name="atencao" size={18} />
          <span>{msg}</span>
        </div>
      ))}
    </div>
  );
}
