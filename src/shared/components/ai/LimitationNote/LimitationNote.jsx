import { AlertCard } from '../../organisms/AlertCard';

/**
 * AI · LimitationNote — nota de segurança/limitação: quando a resposta depende
 * de protocolo local, validação clínica ou contexto ausente. Compõe o AlertCard
 * do DS no nível 'footnote' (rodapé sóbrio), sem criar visual novo.
 *
 * Props:
 *  - title (opcional)
 *  - children: o texto da limitação
 */
export const LimitationNote = ({ title, children }) => (
  <AlertCard level="footnote" title={title}>
    {children}
  </AlertCard>
);
