import './SearchLine.css';

export function SearchLine({ value, onChange, onSubmit, onSearchIntent }) {
  return (
    <form className="search-line" onSubmit={onSubmit}>
      <button
        className="search-line__call"
        type="button"
        onClick={onSearchIntent}
        aria-label="Позвать поиск"
      >
        я<span className="search-line__dots">...</span>
      </button>

      <input
        className="search-line__input"
        value={value}
        onChange={onChange}
        onFocus={onSearchIntent}
        aria-label="Продолжить я"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />
    </form>
  );
}
