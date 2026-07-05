import './InfoHint.css';

export function InfoHint({ isOpen, onOpen, onClose, showButton = true }) {
  return (
    <>
      {showButton && (
        <button className="info-hint__button" type="button" onClick={onOpen} aria-label="Что здесь">
          ?
        </button>
      )}

      {isOpen && (
        <div className="info-hint" role="dialog" aria-modal="true" aria-label="Что здесь">
          <button className="info-hint__backdrop" type="button" onClick={onClose} aria-label="Закрыть" />

          <div className="info-hint__card">
            <p>Здесь не нужно уже быть собой.</p>
            <p>Здесь нет неправильного ответа.</p>

            <button className="info-hint__stay" type="button" onClick={onClose}>
              Остаться
            </button>
          </div>
        </div>
      )}
    </>
  );
}
