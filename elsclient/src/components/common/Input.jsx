import { useState } from 'react';
import './Input.css';

const Input = ({
    type = 'text',
    label,
    error,
    helperText,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const [focused, setFocused] = useState(false);

    const hasValue = value && value.length > 0;
    const showLabel = focused || hasValue;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className={`input-label ${showLabel ? 'input-label-active' : ''}`}>
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`input ${error ? 'input-error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...props}
            />
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};

export default Input;
