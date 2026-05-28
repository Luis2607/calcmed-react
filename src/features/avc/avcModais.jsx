import { SheetText } from '../../shared/components/molecules/sheet/SheetText';
import { SheetList } from '../../shared/components/molecules/sheet/SheetList';
import { NIHSS_DOMINIOS } from './avcData';

/**
 * Conteúdo dos modais info/teoria do AVC — porte 1:1 do dict `modais` do golden avc.js.
 * Cada modal = { title, blocks:[{p}|{list}|{helper}|{section}] }. Render genérico via AvcModalBody.
 * Aberto pelo flow num InfoSheet (BottomSheet). Zero-loss: todo texto do golden preservado.
 * Fonte clínica: AHA/ASA Stroke Guideline 2026, estudos WAKE-UP/DAWN/DEFUSE-3/ELAN/SELECT2.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AVC_MODAIS = {
  'por-que-horario': {
    title: 'Por que o horário?',
    blocks: [
      { p: <>A janela terapêutica determina elegibilidade pra trombólise e trombectomia. Use o último momento em que o paciente foi visto normal (não o momento em que foi achado).</> },
      { list: [
        <><strong>&lt; 4.5h</strong> · janela padrão · trombólise IV direta.</>,
        <><strong>4.5 a 9h</strong> · janela estendida · perfusão por TC/RM mostrando mismatch.</>,
        <><strong>Wake-up &lt; 9h do ponto médio</strong> · RM com mismatch DWI-FLAIR.</>,
        <><strong>&gt; 24h</strong> · fora de janela aguda.</>,
      ] },
    ],
  },
  'wake-up-info': {
    title: 'Wake-up stroke · RM DWI-FLAIR',
    blocks: [
      { p: <>Paciente que acordou com sintomas e a última vez visto normal foi há mais de 4,5h ainda pode ser elegível à trombólise — desde que a RM mostre mismatch DWI-FLAIR.</> },
      { section: 'Critério estendido WAKE-UP (NEJM 2018)' },
      { p: <>Janela <strong>até 9h do ponto médio do sono</strong>: RM de crânio com <strong>mismatch DWI-FLAIR</strong> (lesão aguda visível em difusão · FLAIR completamente normal) sugere início recente · candidato a trombólise.</> },
      { section: 'Como usar este app' },
      { list: [
        'Informe o horário da última vez visto normal · usaremos como referência.',
        'Janela < 4,5h: trombólise IV direta após TC sem contraste (sem necessidade de RM).',
        'Janela 4,5h – 9h do ponto médio: solicite RM DWI-FLAIR · trombolise apenas se houver mismatch.',
        'Janela > 9h: avalie trombectomia se LVO.',
        'Decisão final exige discussão com neurologia.',
      ] },
    ],
  },
  'cincinnati-info': {
    title: 'Escala de Cincinnati',
    blocks: [
      { p: <>Triagem pré-hospitalar validada · 3 sinais cardinais. <strong>1 alterado já abre Código AVC</strong> se sintomas &lt; 24h.</> },
      { section: 'Como avaliar cada sinal' },
      { list: [
        <><strong>Face:</strong> sorrir ou mostrar os dentes · observe assimetria, apagamento do sulco nasolabial, canto da boca caído.</>,
        <><strong>Braço:</strong> olhos fechados, braços estendidos por 10s (90° sentado / 45° deitado) · observe deriva, queda ou pronação.</>,
        <><strong>Fala:</strong> repetir "O Brasil é o país do futebol" · observe disartria (arrastar), afasia (trocar/omitir) ou mutismo.</>,
      ] },
      { section: 'Performance' },
      { list: [
        <><strong>Sensibilidade ~88%</strong> em circulação anterior.</>,
        <><strong>Limitação:</strong> subestima circulação posterior (vertigem, ataxia axial, disfagia).</>,
      ] },
    ],
  },
  'pa-gate-info': {
    title: 'Gates de pressão arterial',
    blocks: [
      { list: [
        <><strong>Pré-trombólise:</strong> sistólica ≤ 185 e diastólica ≤ 110.</>,
        <><strong>Pós-trombólise (24h):</strong> sistólica &lt; 180 e diastólica &lt; 105.</>,
        <><strong>Sem reperfusão:</strong> sistólica ≤ 220 e diastólica ≤ 120 · só tratar se acima.</>,
        <><strong>Hemorrágico:</strong> sistólica 130-140 · agressiva.</>,
      ] },
    ],
  },
  'peso-info': {
    title: 'Peso · trava de segurança',
    blocks: [
      { list: [
        <>Faixa fisiológica permitida: <strong>10 a 250 kg</strong>.</>,
        <>Dose máxima TNK: <strong>25 mg</strong> (≥ 100 kg).</>,
        <>Dose máxima Alteplase: <strong>90 mg</strong> (≥ 100 kg).</>,
        <>Se peso desconhecido, estime por biotipo (Pequeno 60 / Médio 75 / Grande 95) e ajuste depois.</>,
      ] },
    ],
  },
  'tnk-vs-alteplase': {
    title: 'TNK vs Alteplase',
    blocks: [
      { list: [
        <><strong>TNK (Tenecteplase):</strong> preferencial AHA/ASA 2026. 0,25 mg/kg · bolus único 5-10s · máx 25 mg.</>,
        <><strong>Alteplase (rt-PA):</strong> clássico. 0,9 mg/kg · bolus 10% em 1 min + infusão 90% em 60 min · máx 90 mg.</>,
        <>TNK ganha em operacionalidade · não exige bomba de infusão.</>,
      ] },
    ],
  },
  'glicemia-info': {
    title: 'Glicemia capilar',
    blocks: [
      { list: [
        <>Meta no AVC: <strong>140 a 180 mg/dL</strong>.</>,
        <>&lt; 50 mg/dL não corrigida · contraindica trombólise (mimetiza AVC).</>,
        <>Hiperglicemia &gt; 180 piora penumbra · iniciar insulina conforme protocolo.</>,
      ] },
    ],
  },
  'disfagia-info': {
    title: 'Teste de deglutição (50 mL)',
    blocks: [
      { list: [
        'Paciente sentado 90°.',
        'Ofereça 50 mL de água em pequenos goles.',
        <>Observe: <strong>tosse</strong>, <strong>engasgo</strong>, <strong>voz molhada</strong>.</>,
        'Se qualquer sinal · falha · dieta zero · avaliar fonoaudiologia.',
      ] },
      { helper: 'Gate obrigatório antes de prescrição de dieta oral.' },
    ],
  },
  'pa-meta-info': {
    title: 'Meta atual de PA',
    blocks: [
      { p: <>A meta varia conforme o cenário: pré-trombólise (≤ 185/110), pós-trombólise (&lt; 180/105), sem reperfusão (≤ 220/120), hemorrágico (130-140 PAS).</> },
    ],
  },
  // ── TEORIA ──────────────────────────────────────────────────
  'teoria-nihss': {
    title: 'NIHSS · National Institutes of Health Stroke Scale',
    blocks: [
      { p: <>Escala central para quantificar gravidade do déficit neurológico no AVC. 11 domínios · 15 itens · 0 a 42 pontos.</> },
      { section: 'Gravidade clínica' },
      { list: [
        <><strong>0</strong> · sem déficit</>,
        <><strong>1-4</strong> · AVC leve (Minor)</>,
        <><strong>5-15</strong> · AVC moderado</>,
        <><strong>16-20</strong> · AVC moderadamente grave</>,
        <><strong>21-42</strong> · AVC grave</>,
      ] },
      { section: 'Limitações' },
      { p: <>Subestima circulação posterior (não avalia ataxia axial, disfagia, vertigem). Hemisfério direito tem volume maior pro mesmo escore.</> },
      { helper: 'Aplicar sempre na ordem oficial · registrar primeira impressão.' },
    ],
  },
  'teoria-cincinnati': {
    title: 'Cincinnati · triagem pré-hospitalar',
    blocks: [
      { p: <>3 sinais cardinais. 1 alterado abre Código AVC se sintomas &lt; 24h.</> },
      { list: [
        <><strong>Face:</strong> sorrir · assimetria?</>,
        <><strong>Braço:</strong> braços estendidos 10s · queda?</>,
        <><strong>Fala:</strong> repetir frase · disartria/afasia?</>,
      ] },
      { helper: 'Sensibilidade ~88% pra circulação anterior · subestima posterior.' },
    ],
  },
  'teoria-janelas': {
    title: 'Janelas terapêuticas',
    blocks: [
      { list: [
        <><strong>&lt; 4.5h padrão:</strong> trombólise IV direta após TC normal.</>,
        <><strong>4.5 a 9h estendida:</strong> perfusão TC ou RM com mismatch core-penumbra (DAWN/DEFUSE 3).</>,
        <><strong>Wake-up &lt; 9h ponto médio do sono:</strong> RM com mismatch DWI-FLAIR.</>,
        <><strong>Trombectomia até 24h:</strong> ACI/M1/M2/basilar com mismatch.</>,
        <><strong>&gt; 24h:</strong> fora de janela aguda.</>,
      ] },
    ],
  },
  'teoria-pa': {
    title: 'Gates de pressão arterial',
    blocks: [
      { list: [
        <><strong>Pré-trombólise:</strong> ≤ 185/110.</>,
        <><strong>Pós-trombólise (24h):</strong> &lt; 180/105 · monitorar 15/15 min em 2h.</>,
        <><strong>Sem reperfusão:</strong> ≤ 220/120 · não tratar exceto se acima.</>,
        <><strong>Hemorrágico:</strong> PAS 130-140 · agressivo (INTERACT-3).</>,
      ] },
      { section: 'Anti-hipertensivo IV de escolha' },
      { list: [
        <><strong>Labetalol, Nicardipina ou Clevidipina</strong> · 1ª linha AHA/ASA.</>,
        <><strong>Evitar Nitroprussiato</strong> · pode elevar pressão intracraniana (PIC). Reserva como 2ª linha.</>,
      ] },
    ],
  },
  'teoria-trombec': {
    title: 'Trombectomia mecânica',
    blocks: [
      { list: [
        <><strong>Circulação anterior (&lt; 6h):</strong> ACI ou M1 · NIHSS ≥ 6 · ASPECTS ≥ 6 · mRS 0-1.</>,
        <><strong>Janela estendida (6-24h):</strong> DAWN/DEFUSE 3 · mismatch clínico-radiológico.</>,
        <><strong>Basilar:</strong> até 24h · PC-ASPECTS ≥ 6 · NIHSS ≥ 10 · mRS 0-1.</>,
        <><strong>AVC extenso (ASPECTS 0-5):</strong> recomendado (SELECT2, ANGEL-ASPECT).</>,
        <><strong>M2 dominante:</strong> até 6h · NIHSS ≥ 6.</>,
      ] },
    ],
  },
  'teoria-abcd2': {
    title: 'ABCD² · AIT/Minor não cardioembólicos',
    blocks: [
      { p: <>Estratificação de risco em 48h após AIT.</> },
      { list: [
        <><strong>A · Idade ≥ 60:</strong> 1 pt</>,
        <><strong>B · PA ≥ 140/90:</strong> 1 pt</>,
        <><strong>C · Clínica:</strong> 2 pts se hemiplegia · 1 pt se afasia isolada</>,
        <><strong>D · Duração:</strong> 2 pts ≥ 60 min · 1 pt 10-59 min · 0 pt &lt; 10 min</>,
        <><strong>D · Diabetes:</strong> 1 pt</>,
      ] },
      { section: 'DAPT 21 dias (ABCD² ≥ 4 ou NIHSS ≤ 5)' },
      { list: [
        <><strong>Dia 1:</strong> AAS 300 mg + Clopidogrel 300 mg VO</>,
        <><strong>Dias 2-21:</strong> AAS 100 mg + Clopidogrel 75 mg/dia</>,
        <><strong>Após dia 21:</strong> só AAS 100 mg vitalício</>,
      ] },
      { helper: 'Contraindicado se trombólise nas últimas 24h. INSPIRES sugere janela até 72h.' },
    ],
  },
  'teoria-elan': {
    title: 'ELAN 2023 · retorno do DOAC',
    blocks: [
      { p: <>AVC cardioembólico por fibrilação atrial · quando reiniciar anticoagulação.</> },
      { list: [
        <><strong>AVC leve (NIHSS &lt; 5 ou lesão &lt; 1.5 cm):</strong> dia 1-2 · após afastar sangramento.</>,
        <><strong>AVC moderado (NIHSS 5-15 ou ramo cortical):</strong> dia 3-4 · após TC controle.</>,
        <><strong>AVC grave (NIHSS &gt; 15 ou território completo):</strong> dia 6-7 · obrigatório novo TC/RM.</>,
      ] },
      { section: 'Ajustes obrigatórios' },
      { list: [
        <><strong>Função renal (CrCl):</strong> ajustar dose. Apixaban 2,5 mg 12/12h se 2 de 3 critérios (idade ≥ 80, peso ≤ 60 kg, creatinina ≥ 1,5). Dabigatrana e Edoxabana têm cortes próprios por CrCl.</>,
        <><strong>Aplicabilidade:</strong> ELAN testou apenas DOAC (apixaban/rivaroxabana/dabigatrana/edoxabana). Pacientes em varfarina seguem regra clássica 1-2-3-4 semanas (transitória ou estabelecida, leve/moderado/grave).</>,
      ] },
    ],
  },
  'teoria-hemorragico': {
    title: 'AVC hemorrágico · desvio',
    blocks: [
      { p: <>Se TC mostrar sangramento, abortar trombólise/trombectomia imediatamente.</> },
      { list: [
        <><strong>Meta PA:</strong> sistólica 130-140 mmHg · agressiva nas primeiras horas (INTERACT-3).</>,
        <><strong>Reverter anticoagulante</strong> se em uso · Vit K + PCC (varfarina), Idarucizumabe (dabigatrana), Andexanet (anti-Xa).</>,
        <><strong>Plaquetas:</strong> NÃO transfundir rotineiramente em paciente sob antiagregante (estudo PATCH 2016 mostrou dano). Considerar apenas se contagem &lt; 50.000 e neurocirurgia iminente.</>,
        <><strong>Avaliar neurocirurgia</strong> se efeito de massa, herniação iminente ou hemoventrículo.</>,
      ] },
    ],
  },
};

// NIHSS info modals (gerados dinamicamente · 1:1 golden NIHSS_DOMINIOS.forEach).
NIHSS_DOMINIOS.forEach((d) => {
  AVC_MODAIS[`nihss-info-${d.id}`] = {
    title: `NIHSS · ${d.titulo}`,
    blocks: [
      { p: d.helper },
      { list: d.opcoes.map((o) => <><strong>{o.un ? 'UN' : o.v}</strong> · {o.l}</>) },
    ],
  };
});

/** Render genérico do corpo do modal (blocks → SheetText/SheetList). */
export function AvcModalBody({ blocks = [] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.list) return <SheetList key={i} items={b.list} />;
        if (b.section != null) return <SheetText key={i}><strong>{b.section}</strong></SheetText>;
        if (b.helper != null) return <SheetText key={i} variant="auxiliary">{b.helper}</SheetText>;
        return <SheetText key={i}>{b.p}</SheetText>;
      })}
    </>
  );
}
