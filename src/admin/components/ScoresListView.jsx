import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { Icon } from '../../shared/components/atoms/Icon';
import { InputField } from '../../shared/components/molecules/InputField/InputField';
import { Table } from '../../shared/components/organisms/Table/Table';
import { CategoryDropdown } from './CategoryDropdown';
import { DesktopModal } from './DesktopModal';
import { ScoreEditorModal } from './ScoreEditorModal';
import { useScores, scoresStore } from '../data/scoresStore';
import { toastStore } from '../data/toastStore';
import { categoryName, categoryOptions, isKnownCategory } from '../data/categories';
import { serializeMap } from '../data/scoreSchema';
import styles from './ScoresListView.module.css';

const NO_CATEGORY = '__none__';
const FILTER_OPTIONS = [...categoryOptions, { value: NO_CATEGORY, label: 'Sem categoria' }];
const PAGE_SIZE = 8;
const isTestName = (name) => /^\s*teste?\s*$/i.test(name || '');
const hasResult = (s) => !!(s.result && s.result.variations && s.result.variations.length);

function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Cabeçalho de coluna clicável p/ ordenar (passado como `label` da coluna do Table do DS). */
function SortHeader({ label, colKey, sortKey, sortDir, onSort }) {
  const active = sortKey === colKey;
  return (
    <button type="button" className={styles.sortHeader} onClick={() => onSort(colKey)} aria-label={`Ordenar por ${label}`}>
      <span>{label}</span>
      <Icon
        name={active && sortDir === 'asc' ? 'dropdown-up' : 'dropdown'}
        size={14}
        className={active ? styles.sortActive : styles.sortIdle}
      />
    </button>
  );
}

/** Janela de páginas: tudo até 7; senão 1 … vizinhas … última. */
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const wanted = [1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total);
  const sorted = [...new Set(wanted)].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

function Pagination({ page, totalPages, totalItems, pageSize, onPage }) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return (
    <div className={styles.pagination}>
      <span className={styles.range}>
        {start}–{end} de {totalItems}
      </span>
      <div className={styles.pager}>
        <button className={styles.pageBtn} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Página anterior">
          <Icon name="voltar" size={16} />
        </button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ),
        )}
        <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Próxima página">
          <Icon name="seta-direita" size={16} />
        </button>
      </div>
    </div>
  );
}

export function ScoresListView() {
  const scores = useScores();
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState(() => new Set());
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [editor, setEditor] = useState({ open: false, score: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  // Filtro/busca/ordenação mudou → volta pra primeira página.
  useEffect(() => {
    setPage(1);
  }, [search, selectedCats, sortKey, sortDir]);

  const toggleCat = (id) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = scores.filter((s) => {
      const matchSearch = !q || (s.name || '').toLowerCase().includes(q);
      const matchCat =
        selectedCats.size === 0
          ? true
          : s.category
            ? selectedCats.has(s.category)
            : selectedCats.has(NO_CATEGORY);
      return matchSearch && matchCat;
    });
    if (!sortKey) return filtered;
    const cmp = (a, b) => {
      switch (sortKey) {
        case 'nome':
          return (a.name || '').localeCompare(b.name || '', 'pt-BR');
        case 'categoria':
          return (categoryName(a.category) || '￿').localeCompare(categoryName(b.category) || '￿', 'pt-BR');
        case 'perguntas':
          return a.questions.length - b.questions.length;
        case 'resultado':
          return (hasResult(a) ? 1 : 0) - (hasResult(b) ? 1 : 0);
        default:
          return 0;
      }
    };
    return [...filtered].sort((a, b) => (sortDir === 'asc' ? cmp(a, b) : -cmp(a, b)));
  }, [scores, search, selectedCats, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const columns = [
    { key: 'nome', label: <SortHeader label="Nome" colKey="nome" sortKey={sortKey} sortDir={sortDir} onSort={onSort} /> },
    { key: 'categoria', label: <SortHeader label="Categoria" colKey="categoria" sortKey={sortKey} sortDir={sortDir} onSort={onSort} /> },
    { key: 'perguntas', label: <SortHeader label="Perguntas" colKey="perguntas" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />, align: 'center' },
    { key: 'resultado', label: <SortHeader label="Resultado" colKey="resultado" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />, align: 'center' },
    { key: 'acoes', label: '', align: 'right' },
  ];

  const rows = pageItems.map((s) => ({
    nome: (
      <div className={styles.nameCell}>
        <span className={styles.nameText}>{s.name || '(sem nome)'}</span>
        {isTestName(s.name) && <span className={styles.tagTest}>teste</span>}
      </div>
    ),
    categoria:
      s.category && isKnownCategory(s.category) ? (
        <span className={styles.catTag}>{categoryName(s.category)}</span>
      ) : s.category ? (
        <span className={styles.catUnknown}>Categoria desconhecida</span>
      ) : (
        <span className={styles.catNone}>Sem categoria</span>
      ),
    perguntas: s.questions.length,
    resultado: hasResult(s) ? <Icon name="sucesso" size={18} className={styles.okIcon} /> : '—',
    acoes: (
      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Editar" aria-label="Editar" onClick={() => setEditor({ open: true, score: s })}>
          <Icon name="editar" size={18} />
        </button>
        <button
          className={styles.iconBtn}
          title="Duplicar"
          aria-label="Duplicar"
          onClick={() => {
            const copy = scoresStore.duplicate(s.id);
            if (copy) setEditor({ open: true, score: copy });
          }}
        >
          <Icon name="copiar" size={18} />
        </button>
        <span className={styles.actionDivider} aria-hidden="true" />
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Excluir" aria-label="Excluir" onClick={() => setDeleteTarget(s)}>
          <Icon name="excluir" size={18} />
        </button>
      </div>
    ),
  }));

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Escores</h1>
        <p className={styles.desc}>
          Adicione, edite ou remova os escores clínicos que aparecem no app.{' '}
          <span className={styles.count}>{scores.length} cadastrados.</span>
        </p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <InputField value={search} onChange={setSearch} placeholder="Buscar por nome" leftIcon="busca" />
        </div>
        <CategoryDropdown
          multiple
          options={FILTER_OPTIONS}
          selected={selectedCats}
          onToggle={toggleCat}
          onClear={() => setSelectedCats(new Set())}
          placeholder="Todas as categorias"
          ariaLabel="Filtrar por categoria"
        />
        <div className={styles.headerActions}>
          <Button variant="secondary" size="md" showLeftIcon leftIcon="download" onClick={() => download('calcmed-escores-backup.json', serializeMap(scores))}>
            Baixar backup
          </Button>
          <Button variant="primary" size="md" showLeftIcon leftIcon="adicionar" onClick={() => setEditor({ open: true, score: null })}>
            Adicionar Escore
          </Button>
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <div className={styles.tableWrap}>
            <Table columns={columns} rows={rows} />
          </div>
          <Pagination page={safePage} totalPages={totalPages} totalItems={visible.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </>
      ) : (
        <div className={styles.empty}>
          <Icon name="escores" size={32} />
          <p>{scores.length === 0 ? 'Nenhum escore ainda. Importe um JSON ou adicione um escore.' : 'Nenhum escore corresponde ao filtro.'}</p>
        </div>
      )}

      <ScoreEditorModal
        open={editor.open}
        score={editor.score}
        onClose={() => setEditor({ open: false, score: null })}
      />
      <DesktopModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="md"
        title="Excluir escore?"
        footer={
          <>
            <Button variant="secondary" size="lg" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                const removed = deleteTarget;
                scoresStore.remove(removed.id);
                setDeleteTarget(null);
                toastStore.show({ message: 'Escore excluído', undo: () => scoresStore.upsert(removed), duration: 6000 });
              }}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className={styles.confirmText}>
          O escore <strong>{deleteTarget?.name || '(sem nome)'}</strong> será removido da lista. Você ainda pode reimportá-lo de um JSON depois.
        </p>
      </DesktopModal>
    </div>
  );
}
