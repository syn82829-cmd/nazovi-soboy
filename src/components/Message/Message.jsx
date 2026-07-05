import './Message.css';

export function Message({ from = 'ai', children }) {
  return <p className={`message message--${from}`}>{children}</p>;
}
