import './Card.css';

const Card = ({
    children,
    glass = false,
    hoverable = false,
    backgroundImage,
    className = '',
    onClick,
    style = {},
    ...props
}) => {
    const classNames = [
        'card',
        glass && 'card-glass',
        hoverable && 'card-hoverable',
        backgroundImage && 'card-has-bg',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const cardStyle = {
        ...style,
        ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
    };

    return (
        <div className={classNames} onClick={onClick} style={cardStyle} {...props}>
            {children}
        </div>
    );
};

export default Card;
