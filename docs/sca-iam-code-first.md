# SCA/IAM code-first

Registro para sincronizar depois no Figma.

## SCA-IAM-01 - Fluxo nativo SCA/IAM

- **Tela/fluxo:** `features/sca/SCAFlow` substitui o iframe `GoldenProtocolFrame` para `protocol.id === 'sca'`.
- **O que no codigo:** fluxo completo 5 steps (Triagem, ECG, Estratificar, Conduzir, Reavaliar) + 3 tabs (Executar, Historico, Teoria), com `ProtocolHeader` + `ProtocolSteps`, `ActionFooter`, `TabBar`, `Timeline` e `PatientDetail`.
- **Conteudo clinico implementado:** OMI/IAM como frame principal, porta-ECG 10 min, sinais OMI (T hiperaguda, De Winter, Wellens, Aslanger, posterior, Sgarbossa), HEART/TIMI + troponina, duvida diagnostica, locks de seguranca (SAA/AAS, PDE5/nitrato, AVC/prasugrel), reperfusao PPCI/fibrinolise e desfecho por tipo de IAM.
- **Divergencia:** nao veio de frame Figma; foi construido a partir do SSOT `CalcMed Urgencia/oca/sca_arquitetura.md` + `sca_02_telas.md` para demo Gustavo. Precisa virar tela/componentes no Figma depois.
- **Acao no Figma:** criar secao SCA/IAM com 5 telas mobile + historico + teoria; portar os blocos code-first como componentes ou variantes do kit Central de Urgencia.
- **QA:** abrir `/?route=sca`; deep links de demo `/?route=sca&step=2`, `/?route=sca&step=5`, `/?route=sca&tab=historico`, `/?route=sca&tab=teoria`.
- **Status:** aberto para sincronizar no Figma; codigo demo validado com lint, build, React Doctor e screenshots mobile.
