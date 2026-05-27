import styles from './InputField.module.css';
import { Icon } from '../../atoms/Icon/Icon';

export const InputField = ({
  label,
  value = '',
  onChange,
  placeholder,
  type = 'text',
  state = 'default', // 'default' | 'filled' | 'error' | 'sucesso'
  showUnit = false,
  unit = '',
  mono = false,
  helperText,
  tagText,
  leftIcon,
  rightIcon,
  disabled = false,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Determine computed state class
  let computedState = state;
  if (state === 'default' && value !== '') {
    computedState = 'filled';
  }

  const wrapperClass = [
    styles.inputWrap,
    styles[`state-${computedState}`],
    disabled ? styles.disabled : ''
  ].filter(Boolean).join(' ');

  const inputClass = [
    styles.input,
    mono ? 'mono' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          {tagText && <span className={styles.tag}>{tagText}</span>}
        </label>
      )}
      <div className={wrapperClass}>
        {leftIcon && <span className={styles.icon}><Icon name={leftIcon} size={20} /></span>}
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {rightIcon && <span className={styles.icon}><Icon name={rightIcon} size={20} /></span>}
        {showUnit && unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {helperText && <span className={styles.helper}>{helperText}</span>}
    </div>
  );
};
