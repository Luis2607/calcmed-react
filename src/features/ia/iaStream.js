/* IA — utilidades de streaming e serialização das respostas estruturadas.
 * O streaming "fatia" a resposta em UNITS (palavras nos blocos de texto, itens
 * nas listas, 1 por bloco inteiro) para revelar progressivamente, como se a IA
 * estivesse digitando. responseToText serializa a resposta para copiar. */

const strip = (s) => String(s ?? '')
  .replace(/\*\*(.+?)\*\*/g, '$1') // negrito
  .replace(/\*(.+?)\*/g, '$1');    // itálico
const words = (s) => strip(s).trim().split(/\s+/).filter(Boolean);

// Prosa revela em "blocos de leitura" (CHUNK palavras por tick) em vez de soluço
// palavra-a-palavra. Como a prosa é "quebradinha" (vários parágrafos curtos), o
// limiar é baixo (>12 palavras): qualquer parágrafo de verdade já agrupa, e o
// total de uma explicação de várias linhas fica em ~3s. Frases muito curtas
// (one-liners, primary_action) seguem 1 palavra/tick, preservando a "digitação".
const CHUNK = 3;
const LONG = 12;
const chunkOf = (content) => (words(content).length > LONG ? CHUNK : 1);

function blockUnits(b) {
  if (b.type === 'text' || b.type === 'primary_action') {
    return Math.max(1, Math.ceil(words(b.content).length / chunkOf(b.content)));
  }
  if (b.type === 'heading') return Math.max(1, words(b.text).length);
  if (b.type === 'list') return Math.max(1, (b.items || []).length);
  return 1; // bloco "inteiro" (tabela, dose, alerta…) revela de uma vez
}

/** Total de units de uma resposta (p/ saber quando o streaming terminou). */
export function countUnits(response) {
  return (response?.blocks || []).reduce((sum, b) => sum + blockUnits(b), 0);
}

/** Resposta parcial até `units` (frontier truncada). null = resposta completa. */
export function sliceResponse(response, units) {
  if (units == null || units >= countUnits(response)) return response;
  const out = [];
  let acc = 0;
  for (const b of response.blocks || []) {
    const cost = blockUnits(b);
    if (units >= acc + cost) { out.push(b); acc += cost; continue; }
    const into = units - acc; // units já reveladas dentro deste bloco
    if (into > 0) {
      if (b.type === 'text' || b.type === 'primary_action') out.push({ ...b, content: words(b.content).slice(0, into * chunkOf(b.content)).join(' ') });
      else if (b.type === 'heading') out.push({ ...b, text: words(b.text).slice(0, into).join(' ') });
      else if (b.type === 'list') out.push({ ...b, items: (b.items || []).slice(0, into) });
      else out.push(b);
    }
    break;
  }
  // ações (chips de rodapé) só quando a resposta termina
  return { ...response, blocks: out, actions: [] };
}

/** Serializa a resposta para texto puro (copiar resposta inteira). */
export function responseToText(response) {
  const lines = [];
  if (response.title) lines.push(response.title);
  for (const b of response.blocks || []) {
    switch (b.type) {
      case 'text':
      case 'primary_action':
        lines.push(strip(b.content ?? b.title));
        break;
      case 'heading':
        lines.push(`${b.emoji ? `${b.emoji} ` : ''}${strip(b.text)}`);
        break;
      case 'list':
        (b.items || []).forEach((it) => lines.push(`• ${strip(it)}`));
        break;
      case 'dose':
        lines.push([b.value, b.unit, b.via].filter(Boolean).join(' '));
        break;
      case 'alert':
        lines.push(`${b.title ? `${b.title}: ` : ''}${strip(b.content)}`);
        break;
      case 'checklist':
        if (b.tagLabel) lines.push(strip(b.tagLabel)); // não perde o rótulo da seção
        (b.items || []).forEach((it) => lines.push(`- ${typeof it === 'string' ? it : it.label}`));
        break;
      case 'interpretation': {
        const cols = b.columns || [];
        (b.rows || []).forEach((r) => {
          // serializa pela ORDEM das colunas (não pela ordem das chaves do objeto)
          const cells = (cols.length ? cols.map((c) => r[c.key]) : Object.values(r))
            .filter((v) => typeof v === 'string' && v);
          if (cells.length) lines.push(cells.join('  '));
        });
        if (typeof b.reading === 'string') lines.push(strip(b.reading));
        break;
      }
      case 'stepper':
        (b.steps || []).forEach((s, i) => lines.push(`${i + 1}. ${typeof s === 'string' ? s : s.label}`));
        break;
      case 'copyable':
        lines.push(b.text ?? b.variants?.[0]?.text ?? '');
        break;
      case 'expandable':
        lines.push(`${strip(b.title)} — ${strip(b.content)}`);
        break;
      case 'limitation':
        lines.push(strip(b.content)); // a ressalva clínica entra no texto copiado
        break;
      default:
        break;
    }
  }
  const body = lines.filter(Boolean).join('\n');
  // Proveniência: o que sai do app (prontuário/WhatsApp) carrega a origem.
  return body ? `${body}\n\n— Gerado pela IA do CalcMed.` : body;
}
