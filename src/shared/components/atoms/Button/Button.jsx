import { forwardRef } from 'react';
import { Icon } from '../Icon';
import styles from './Button.module.css';

export const Button = forwardRef(({
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'text-link'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  children,
  className = '',
  leftIcon,
  rightIcon,
  showLeftIcon = false,
  showRightIcon = false,
  ...props
}, ref) => {
  const buttonClass = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className
  ].filter(Boolean).join(' ');

  // Icon size scales proportionally to button size: SM (16px), MD (20px), LG (24px)
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <button
      ref={ref}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {showLeftIcon && leftIcon && (
        <Icon name={leftIcon} size={iconSize} className={styles.leftIcon} />
      )}
      {children}
      {showRightIcon && rightIcon && (
        <Icon name={rightIcon} size={iconSize} className={styles.rightIcon} />
      )}
    </button>
  );
});

Button.displayName = 'Button';

