import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full-width',
        loading && 'btn-loading',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
