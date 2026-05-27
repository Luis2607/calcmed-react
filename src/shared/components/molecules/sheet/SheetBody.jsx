import { forwardRef } from 'react';
import styles from './Sheet.module.css';

export const SheetBody = forwardRef(function SheetBody({ children, className = '' }, ref) {
  return (
    <div ref={ref} className={[styles.body, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
});
