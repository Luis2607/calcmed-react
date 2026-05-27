import { forwardRef } from 'react';
import { Icon } from '../Icon';
import styles from './IconButton.module.css';

export const IconButton = forwardRef(({
  icon,
  size = 'md', // 'sm' | 'md'
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'text' | 'discrete'
  disabled = false,
  onClick,
  className = '',
  darkMode = false,
  ...props
}, ref) => {
  const buttonClass = [
    styles.iconButton,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    darkMode ? styles.darkMode : '',
    className
  ].filter(Boolean).join(' ');

  // Icon size is 16px for SM button (36x36px), 20px for MD button (48x48px)
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <button
      ref={ref}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      aria-label={props['aria-label'] || icon}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize} />}
    </button>
  );
});

IconButton.displayName = 'IconButton';
