/**
 * Seed do protótipo — transcrição FIEL de escores reais do scores-v2.json (banco do Gui).
 * Mantém UUIDs, textos, pontos (inclusive negativos no RASS) e os typos do backend
 * (`aditionalTexts`, `biggerThen`). No app real, o Gustavo importa o arquivo completo
 * pela tela "Importar JSON"; aqui é só pra demonstrar lista/preview/gestão.
 *
 * Cobre: single-choice, multiple-choice, multi-pergunta, pontos negativos,
 * aditionalTexts, result, e 2 escores "teste" (lixo, category "") pra limpar.
 */
export const SAMPLE_SCORES = [
  {
    id: '03562805-2aee-49e4-a673-43ea56ca9d0e',
    name: 'Escala de Sedação de Ramsay',
    description: 'Sedação',
    category: '560123b4-1377-4a1a-9af9-cd8b32be2fd2',
    aditionalTexts: [
      {
        id: 'e5adad9e-2b6c-43bc-a732-934caa9ebe13',
        title: 'O que é?',
        description:
          'A Escala de Sedação de Ramsay é uma ferramenta utilizada para avaliar o nível de sedação de pacientes em unidades de terapia intensiva ou durante procedimentos anestésicos.',
      },
    ],
    questions: [
      {
        id: 'fd07f81d-88fd-4a36-b2dc-289df9341668',
        name: 'Níveis da Escala',
        type: 'single-choice',
        options: [
          { id: '404e8c92-449c-45a0-985a-9843dd8e85b7', name: '1 - Paciente ansioso, agitado ou inquieto.', points: 1 },
          { id: '31d545fd-cb6a-4e61-bb89-712bc26ee315', name: '2 - Paciente cooperativo, orientado e tranquilo.', points: 2 },
          { id: 'a62bcd6a-3041-4710-8cc5-a79af86eec2b', name: '3 - Paciente responde apenas a comandos.', points: 3 },
          { id: '6f5005ec-d1f1-43e4-935d-5e887ccace0c', name: '4 - Paciente apresenta uma resposta rápida a estímulos leves, como contato ou voz.', points: 4 },
          { id: 'd929da9e-9f1f-4dff-8488-b52a34ab5374', name: '5 - Paciente apresenta uma resposta lenta a estímulos leves.', points: 5 },
          { id: '02ae6869-6ada-4608-b7eb-69e63dd96098', name: '6 - Paciente não apresenta resposta a estímulos leves (sedação profunda ou anestesia).', points: 6 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Resultado',
      variations: [
        { id: '33ec9fd8-aef5-46a4-8a70-66b56f998398', biggerThen: 0, meaning: 'Paciente ansioso, agitado ou inquieto.', title: 'Ramsay I' },
        { id: '082c271a-2276-485d-9175-96de5908ab68', biggerThen: 2, meaning: 'Paciente cooperativo, orientado e tranquilo.', title: 'Ramsay II' },
        { id: '3cf9c4cd-9c23-4702-9da0-9c5b1790dc5b', biggerThen: 3, meaning: 'Paciente responde apenas a comandos.', title: 'Ramsay III' },
        { id: '50f2fdf8-7b0b-424a-97a1-0931203b3e29', biggerThen: 4, meaning: 'Paciente apresenta uma resposta rápida a estímulos leves.', title: 'Ramsay IV' },
        { id: '00366cb8-f94c-48c0-928e-3a580cad5dc1', biggerThen: 5, meaning: 'Paciente apresenta uma resposta lenta a estímulos leves.', title: 'Ramsay V' },
        { id: '28456a18-df21-40bf-a4e5-7755d020b08b', biggerThen: 6, meaning: 'Sedação profunda.', title: 'Ramsay VI' },
      ],
    },
  },
  {
    id: '0e682db0-5ac8-47b8-8665-de32e752d34b',
    name: 'Killip – IAM',
    description: 'Classificação do IAM',
    category: 'c228a2c8-eb52-4713-b89b-d3af2ea0e6ad',
    aditionalTexts: [
      {
        id: '40933bd8-142a-4bef-b6f0-5a7c8e24e41a',
        title: 'Descrição',
        description:
          'A Classificação de Killip é usada para estratificar o risco de mortalidade em pacientes com infarto agudo do miocárdio com base nos sinais clínicos de insuficiência cardíaca.\n\n* Classe I: sem sinais clínicos de congestão pulmonar ou insuficiência cardíaca.\n\n* Classe II: presença de B3 (terceira bulha) e estertores bibasais (indicam congestão leve).\n\n* Classe III: edema agudo de pulmão.\n\n* Classe IV: choque cardiogênico (pressão arterial sistólica < 90 mmHg e sinais de hipoperfusão).',
      },
    ],
    questions: [
      {
        id: 'c8792803-8c76-4f86-b652-fa5e3b3d5046',
        name: 'Classificação clínica (selecione o achado mais compatível)',
        type: 'single-choice',
        options: [
          { id: '83c33180-181c-4967-9b43-3c4687976793', name: 'Classe I – Sem sinais de congestão', points: 0 },
          { id: '7f69bc3b-0998-4cdc-b6c7-c02ebf4b910a', name: 'Classe II – B3 e estertores bibasais', points: 1 },
          { id: '0cdbecfb-7826-42b8-ac31-8f40611cfed2', name: 'Classe III – Edema agudo de pulmão', points: 2 },
          { id: '3b21ee10-9941-4920-a7fe-726da9e0971e', name: 'Classe IV – Choque cardiogênico', points: 3 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Classificação Killip',
      variations: [
        { id: 'a9bf3227-f9e1-4f66-ae0f-a25c38df1dfb', biggerThen: 0, meaning: 'Sem sinais de insuficiência cardíaca – melhor prognóstico.', title: 'Classe I' },
        { id: '1c3a3df6-047e-4af6-9e2e-dc3aed46970e', biggerThen: 1, meaning: 'Congestão pulmonar leve – risco moderado de mortalidade.', title: 'Classe II' },
        { id: '5758151c-9c0c-4298-88ac-0e4c058b517b', biggerThen: 2, meaning: 'Edema agudo de pulmão – risco alto de mortalidade.', title: 'Classe III' },
        { id: '76f04753-ff58-4c8a-8644-d9d593af0ba6', biggerThen: 3, meaning: 'Choque cardiogênico – prognóstico reservado.', title: 'Classe IV' },
      ],
    },
  },
  {
    id: '20a3bff6-45a1-4bbc-ba40-f65e0754aa34',
    name: 'qSOFA',
    description: 'Triagem de sepse',
    category: '0e4e5298-e809-42c3-af12-5606b103194d',
    aditionalTexts: [
      {
        id: 'a51d1636-850b-448f-9a82-321f42363d62',
        title: 'Descrição',
        description:
          'O qSOFA (quick Sequential Organ Failure Assessment) é um escore rápido utilizado para identificar pacientes com suspeita de infecção que estão em risco aumentado de evolução desfavorável, como sepse ou choque séptico.',
      },
    ],
    questions: [
      {
        id: 'c61ee005-7fec-4b93-a7e2-bd2276138800',
        name: 'Sinais clínicos',
        type: 'multiple-choice',
        options: [
          { id: '9a5fcb14-6884-4329-8765-e04bca9bcd90', name: 'Pressão arterial sistólica ≤ 100 mmHg', points: 1 },
          { id: '400779a5-db0f-4411-a018-bd8b959c07ea', name: 'Frequência respiratória ≥ 22 irpm', points: 1 },
          { id: 'b16fe83c-9ec7-4b5e-9925-63fd23152016', name: 'Alteração do nível de consciência (Glasgow <15)', points: 1 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Risco de evolução desfavorável',
      variations: [
        { id: '483d5a43-924c-42b9-912d-16d0eb7ac0e7', biggerThen: 0, meaning: 'Baixo risco de complicações – manter vigilância clínica', title: '0 a 1 ponto' },
        { id: 'eeb69e1e-a3bd-4f92-8aea-697c99e2cd9a', biggerThen: 2, meaning: 'Maior risco de sepse – considerar avaliação em ambiente de maior complexidade', title: '≥2 pontos' },
      ],
    },
  },
  {
    id: '2184257a-cb04-4538-854d-ce25c74e61d5',
    name: 'HAS-BLED',
    description: 'Risco de sangramento',
    category: 'c228a2c8-eb52-4713-b89b-d3af2ea0e6ad',
    aditionalTexts: [
      {
        id: 'be541296-956b-462f-9974-cae4b5ef7057',
        title: 'Descrição',
        description:
          'O escore HAS-BLED é utilizado para estimar o risco de sangramento em pacientes com fibrilação atrial em uso de anticoagulantes orais. Cada fator de risco soma 1 ponto, e a pontuação total vai de 0 a 9.',
      },
    ],
    questions: [
      {
        id: '8338eb0e-b4e6-4fd7-893c-21c144a309b3',
        name: 'Critérios clínicos',
        type: 'multiple-choice',
        options: [
          { id: '93e8bc96-d788-45d0-9157-a86534a66759', name: 'Hipertensão (PA sistólica >160 mmHg)', points: 1 },
          { id: '4aee7b79-9f51-4fa7-b4a8-38193ed2b87c', name: 'Função renal alterada (diálise, transplante renal ou creatinina >2,26 mg/dL)', points: 1 },
          { id: 'be4771e0-817c-4b24-8d97-e470f00f77be', name: 'Função hepática alterada (cirrose ou bilirrubina > 2x o normal com TGO/TGP/FAL >3x o normal)', points: 1 },
          { id: 'a540b4aa-d5ee-4c2a-aa3b-e91e9e463d83', name: 'AVC prévio', points: 1 },
        ],
      },
      {
        id: '1e996acd-cd3f-4b2e-a7a9-32b0defb9675',
        name: 'Comportamento e medicação',
        type: 'multiple-choice',
        options: [
          { id: 'bfb500c8-5919-4e56-8a93-fe83ee98aae9', name: 'Histórico de sangramento maior ou predisposição', points: 1 },
          { id: '01cc0b40-67bb-4465-be85-d884cb11f77e', name: 'INR lábil (em uso de anticoagulante, tempo fora da faixa terapêutica > 60%)', points: 1 },
          { id: '111d3020-1fce-4cd3-ba6b-1667563802b1', name: 'Idade > 65 anos', points: 1 },
          { id: '5bc518c8-31f9-457b-9733-88ec98a30993', name: 'Uso concomitante de fármacos (antiagregantes, AINEs)', points: 1 },
          { id: 'ca6f6cc3-4520-46fc-b58a-5bdfbf744286', name: 'Uso de Álcool (≥8 doses/semana)', points: 1 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Risco de sangramento',
      variations: [
        { id: '11327de8-4617-42fa-ab34-7634c6138669', biggerThen: 0, meaning: 'Baixo risco', title: '0 a 1 pontos' },
        { id: '7bd6067b-146c-4699-85dc-79a6e757c9f4', biggerThen: 2, meaning: 'Risco moderado', title: '2 pontos' },
        { id: 'ea768442-818a-4462-a275-511f28790fd3', biggerThen: 3, meaning: 'Alto risco – considerar medidas para reduzir o risco de sangramento', title: '≥3 pontos' },
      ],
    },
  },
  {
    id: '5246b41e-a70d-4a2b-a61b-d30cb746f51a',
    name: 'Child-Pugh Score - Cirrose',
    description: 'Função hepática',
    category: 'e48b1cbd-28ef-4d75-87f7-d2056afc451c',
    aditionalTexts: [
      {
        id: 'c5b74b5f-5411-4145-b540-44b5bf5266c4',
        title: 'Descrição',
        description:
          'O escore Child-Pugh é utilizado para classificar a gravidade da cirrose hepática e prever o prognóstico dos pacientes com doença hepática crônica.',
      },
    ],
    questions: [
      {
        id: 'd75801a0-a48d-496a-a038-d25edddd5471',
        name: 'Encefalopatia hepática',
        type: 'single-choice',
        options: [
          { id: '7b1ab84b-cf27-432b-92fd-a4af626afe17', name: 'Ausente', points: 1 },
          { id: '9ffbbe08-7850-464f-a3ce-91d944d1dcba', name: 'Grau 1-2 (leve a moderada)', points: 2 },
          { id: 'f96889ec-6996-40ba-aea9-ef4d51da055b', name: 'Grau 3-4 (grave)', points: 3 },
        ],
      },
      {
        id: '5d812e80-bc17-41a0-9389-14f6fb8a135d',
        name: 'Ascite',
        type: 'single-choice',
        options: [
          { id: '5f6916ae-cac0-480f-b196-98ef0c2fa613', name: 'Ausente', points: 1 },
          { id: 'c287fafd-42c4-488e-a533-8f99e00f71d5', name: 'Leve/moderada (controlada)', points: 2 },
          { id: 'aeff7025-bf44-4cbd-bb23-1aca3605e758', name: 'Refratária/intensa', points: 3 },
        ],
      },
      {
        id: '410f9e09-a5b6-4b30-b448-b88e98301c91',
        name: 'Bilirrubina total (mg/dL)',
        type: 'single-choice',
        options: [
          { id: '65c9ca50-c778-4658-8836-1a255c56a70b', name: '< 2', points: 1 },
          { id: 'abbeed93-3f87-49fe-bbe0-8a2d4119f2a4', name: '2 a 3', points: 2 },
          { id: '9ea46f64-c9aa-447c-822a-d10f2f089ab1', name: '> 3', points: 3 },
        ],
      },
      {
        id: '13b8ded3-921a-4a57-8504-ac183fce19e2',
        name: 'Albumina (g/dL)',
        type: 'single-choice',
        options: [
          { id: '2202f03e-929e-4313-a33d-1b3225b14cd6', name: '> 3,5', points: 1 },
          { id: '4112df06-ba0e-49a0-bbfe-80df8f54ad74', name: '2,8 a 3,5', points: 2 },
          { id: '2271f8d4-e7b4-48a0-896e-70dcd9c237b2', name: '< 2,8', points: 3 },
        ],
      },
      {
        id: '8c59473c-5098-4273-a2ed-466f608be5d2',
        name: 'INR',
        type: 'single-choice',
        options: [
          { id: 'a7e81b88-1bef-493a-9581-7ded3d34cd47', name: '< 1,7', points: 1 },
          { id: 'd0daa99e-74c4-4b14-b14f-c03cde43db34', name: '1,7-2,3', points: 2 },
          { id: '281728e7-c00e-4b2c-9b9f-e643eba52a6b', name: '> 2,3', points: 3 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Classificação Child-Pugh',
      variations: [
        { id: '3fd96ae2-4e3d-4dd8-990b-6df155f8e6ef', biggerThen: 5, meaning: 'Classe A – Cirrose compensada (leve)', title: '5-6 pontos' },
        { id: 'dbbb797d-9a48-48b2-ac4c-b104583a2488', biggerThen: 7, meaning: 'Classe B – Cirrose com descompensação moderada', title: '7-9 pontos' },
        { id: '0aee18b7-caca-4fd8-816f-00f4335c2f48', biggerThen: 10, meaning: 'Classe C – Cirrose descompensada (grave)', title: '10-15 pontos' },
      ],
    },
  },
  {
    id: '72a62174-0ee5-4cde-82f8-cba8bbd59431',
    name: 'Escala de RASS',
    description: 'Nível de sedação',
    category: '560123b4-1377-4a1a-9af9-cd8b32be2fd2',
    aditionalTexts: [
      {
        id: 'abd6dbdd-599f-4ced-985f-cc660dc8e5e7',
        title: 'Indicação:',
        description:
          'A RASS é uma escala amplamente utilizada em unidades de terapia intensiva para avaliar o nível de sedação e agitação de pacientes, especialmente aqueles em ventilação mecânica.',
      },
    ],
    questions: [
      {
        id: 'b30f5c59-21f4-46fd-a827-5854dede42ff',
        name: 'Paciente:',
        type: 'single-choice',
        options: [
          { id: '6e8a706e-fd07-4805-8ed0-e548c2914be0', name: 'Agressivo', points: 4 },
          { id: 'c260e4fb-ce93-435e-aa9f-440dd917544f', name: 'Muito agitado', points: 3 },
          { id: '48a654ba-5e90-400a-817b-524942126443', name: 'Agitado', points: 2 },
          { id: 'd48a7353-861a-409e-b468-c414e15be1ab', name: 'Inquieto', points: 1 },
          { id: 'dde900eb-bbe1-406a-abdd-23dcfd1e3ceb', name: 'Alerta e calmo', points: 0 },
          { id: 'f2e681b4-889b-4285-b573-be32257c9bf5', name: 'Sonolento', points: -1 },
          { id: 'd50f70d9-37e9-4e8e-a2ca-e793c0cf9fa2', name: 'Desperta brevemente à voz', points: -2 },
          { id: '8b1b6699-afe6-4f57-8b6d-28f4d8825a87', name: 'Desperta à voz, mas não abre os olhos', points: -3 },
          { id: '41b83093-9a61-41de-943e-901df902df75', name: 'Acorda à dor', points: -4 },
          { id: 'd6379118-e6a9-4851-a2eb-141554b88b07', name: 'Não responsivo', points: -5 },
        ],
      },
    ],
  },
  {
    id: '6fe8ee92-35a0-462c-b910-105694f9398a',
    name: 'CRB-65 (Pneumonia)',
    description: 'Gravidade pneumonia',
    category: 'c47937ba-8556-4ae7-adfc-687520f7401f',
    aditionalTexts: [
      {
        id: '6a860ca2-9f72-4311-89ed-94ddf492a305',
        title: 'Interpretação ',
        description:
          '0: mortalidade baixa (1,2%) – considerar tratamento ambulatorial.\n1-2: mortalidade intermediária (8,15%) – avaliar tratamento hospitalar.\n3-4: mortalidade alta (31%) – hospitalização.',
      },
    ],
    questions: [
      {
        id: '9ffd19bc-9ad0-4091-94c0-9c381fda6043',
        name: 'CRB-65',
        type: 'multiple-choice',
        options: [
          { id: '389bf05d-2354-4468-9c2b-5f210ca5c3e8', name: 'Confusão mental', points: 1 },
          { id: '56d0bac4-c9cf-42cc-9661-293a042a9882', name: 'Frequência respiratória ≥ 30', points: 1 },
          { id: '85cc4ae0-f5e0-4766-af71-1ab47b0d9ae1', name: 'PAS < 90 ou PAD ≤ 60', points: 1 },
          { id: '815e22c3-d975-4dfd-88c4-3db75e7f3db9', name: 'Idade ≥ 65', points: 1 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Resultado',
      variations: [
        { id: 'ada86745-7e02-4d5a-988b-84674b180949', biggerThen: 0, meaning: 'Baixo risco', title: '0 ' },
        { id: '87a791cb-fc0b-4b7a-8404-dbae0645f7f2', biggerThen: 1, meaning: 'Moderado risco', title: '1 a 2' },
        { id: '46a0f16d-0597-4cf7-84d1-6c3bbd57ad77', biggerThen: 3, meaning: 'Alto risco', title: '3 a 4' },
      ],
    },
  },
  {
    id: '963d55b9-8371-465b-9dcb-4c7ccaf53d87',
    name: 'CHA₂DS₂-VASc',
    description: 'Risco de AVC em FA',
    category: 'c228a2c8-eb52-4713-b89b-d3af2ea0e6ad',
    aditionalTexts: [
      {
        id: '2ad97f00-1eb5-4d22-a495-03d46717fb79',
        title: 'Descrição',
        description:
          'O escore CHA₂DS₂-VASc é usado para estimar o risco de AVC em pacientes com fibrilação atrial não valvar. Cada fator de risco contribui com 1 ou 2 pontos, e a pontuação total determina a necessidade de anticoagulação.',
      },
    ],
    questions: [
      {
        id: '383ce439-b393-41b6-8f37-a98e1293016b',
        name: 'Fatores clínicos',
        type: 'multiple-choice',
        options: [
          { id: 'f832f5ce-f235-458a-9bd1-5b6be4ba94c9', name: 'Insuficiência Cardíaca Congestiva', points: 1 },
          { id: '95a9f2b5-b58b-4ba1-a915-9afb21470f8a', name: 'Hipertensão arterial', points: 1 },
          { id: '3ecb0685-46b6-4320-af96-290325bd5f99', name: 'Diabetes mellitus', points: 1 },
          { id: '613bcbc5-8e87-4bd4-95ed-11045d00f450', name: 'Histórico de AVC, AIT ou tromboembolismo', points: 2 },
          { id: '1c247e15-7f44-4eb8-9f44-6ef63d4267b3', name: 'Doença vascular (IAM, DAP, placa aórtica)', points: 1 },
          { id: '1ef80424-3a54-4c59-9e64-8e6257b368fe', name: 'Sexo feminino', points: 1 },
        ],
      },
      {
        id: 'a4207c72-3285-4218-a557-f5876e8121eb',
        name: 'Idade ≥ 75 anos',
        type: 'single-choice',
        options: [
          { id: 'f18d05a0-13a6-43b7-90e4-5f001edfa428', name: '< 65 anos', points: 0 },
          { id: '98bad9d6-5285-41c9-b594-44c5cc7cd53d', name: '65 a 74 anos', points: 1 },
          { id: 'c0b5d6fb-a6b6-4115-861f-39ffaede11e2', name: '≥ 75 anos', points: 2 },
        ],
      },
    ],
    result: {
      meaningTitle: 'Risco de AVC anual',
      variations: [
        { id: '35e04903-1e13-4946-9a3e-71246e5c7a3c', biggerThen: 0, meaning: 'Baixo Risco', title: '0' },
        { id: '5e5c7e31-de16-4c42-806c-480bb6274809', biggerThen: 1, meaning: 'Risco baixo (mulheres) / Risco intermediário (homens)', title: '1' },
        { id: 'a7c2e3e1-1266-4fc2-88ff-4e07b6ce7b3e', biggerThen: 2, meaning: 'Risco intermediário (mulheres) / Risco alto (homens)', title: '2' },
        { id: 'b3533e0a-19c7-481a-8cbb-c55c057c9262', biggerThen: 3, meaning: 'Risco alto (homens e mulheres)', title: '≥3' },
      ],
    },
  },
  {
    id: '14520124-5b8c-4466-9d61-ab4e725dd9bb',
    name: 'teste',
    description: '',
    category: '',
    questions: [
      {
        id: 'e1862c62-f787-4cb0-b179-29ee86872296',
        name: 'teste',
        type: 'single-choice',
        options: [{ id: '8ee79316-680c-4927-9308-cb937fe32026', name: 'teste', points: 1 }],
      },
    ],
  },
  {
    id: '4f2a3a92-122d-41b9-826e-45937cff391f',
    name: 'teste',
    description: '',
    category: '',
    questions: [
      {
        id: 'e1862c62-f787-4cb0-b179-29ee86872297',
        name: 'teste',
        type: 'single-choice',
        options: [{ id: '8ee79316-680c-4927-9308-cb937fe32027', name: 'teste', points: 1 }],
      },
    ],
  },
];
