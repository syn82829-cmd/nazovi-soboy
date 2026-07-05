import './InfoHint.css';

export function InfoHint({ isOpen, onOpen, onClose }) {
  return (
    <>
      <button className="info-hint__button" type="button" onClick={onOpen} aria-label="Что здесь">
        ?
      </button>

      {isOpen && (
        <div className="info-hint" role="dialog" aria-modal="true" aria-label="Что здесь">
          <button className="info-hint__backdrop" type="button" onClick={onClose} aria-label="Закрыть" />

          <div className="info-hint__card">
            <p>Здесь не ищут ответ.</p>
            <p>Здесь называют то,<br />с чем пришли.</p>
            <p>Начните с «я…»</p>

            <button className="info-hint__stay" type="button" onClick={onClose}>
              Остаться
            </button>
          </div>
        </div>
      )}
    </>
  );
}
