import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup/ScoreCriterionGroup';
import { ScoreRangeTable } from '../../shared/components/molecules/ScoreRangeTable/ScoreRangeTable';
import { Checkbox } from '../../shared/components/atoms/Checkbox/Checkbox';
import { formatPoints, QUESTION_TYPES } from '../data/scoreSchema';
import styles from './PreviewScore.module.css';

/**
 * Preview ao vivo do escore — renderiza como aparece no app, reusando os componentes
 * reais do DS. single-choice usa ScoreCriterionGroup (DS); multiple-choice usa um card
 * de checkboxes harmônico; result usa ScoreRangeTable. Read-only (sem seleção real).
 */
export function PreviewScore({ score }) {
  if (!score) return null;
  const { name, description, aditionalTexts = [], questions = [], result } = score;

  return (
    <div className={styles.preview}>
      <header className={styles.head}>
        <h1 className={styles.title}>{name || 'Escore sem nome'}</h1>
        {description && <p className={styles.subtitle}>{description}</p>}
      </header>

      {aditionalTexts.map((t) => (
        <section key={t.id} className={styles.infoCard}>
          {t.title && <h3 className={styles.infoTitle}>{t.title}</h3>}
          {t.description && <p className={styles.infoText}>{t.description}</p>}
        </section>
      ))}

      {questions.map((q) =>
        q.type === QUESTION_TYPES.multiple ? (
          <div key={q.id} className={styles.card}>
            <div className={styles.qHeader}>
              <span>{q.name || 'Pergunta sem nome'}</span>
              <span className={styles.qTag}>Marque todas que se aplicam</span>
            </div>
            <div className={styles.optList}>
              {q.options.map((o) => (
                <div key={o.id} className={styles.optRow}>
                  <span className={styles.optMain}>
                    <Checkbox checked={false} label={o.name || '(opção sem nome)'} readOnly />
                  </span>
                  <span className={styles.pts}>{formatPoints(o.points)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ScoreCriterionGroup
            key={q.id}
            systemName={q.name || 'Pergunta sem nome'}
            alwaysOpen
            showSelectedCriterion={false}
            options={q.options.map((o) => ({ label: o.name || '(opção sem nome)', points: formatPoints(o.points) }))}
            value={null}
          />
        ),
      )}

      {result && result.variations && result.variations.length > 0 && (
        <ScoreRangeTable
          title={result.meaningTitle || 'Interpretação'}
          rows={result.variations.map((v) => ({ points: v.title, label: v.meaning }))}
        />
      )}
    </div>
  );
}
