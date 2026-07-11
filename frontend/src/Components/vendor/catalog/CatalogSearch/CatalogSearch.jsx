import { useRef } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useCatalogSearch from "./useCatalogSearch";
import "./CatalogSearch.css";

const CatalogSearch = ({ kind, onSelect }) => {
  const containerRef = useRef(null);
  const {
    query, open, selected, activeIdx,
    isFetching, isError, results, shouldFetch,
    close, onQueryChange, onFocus,
    handleSelect, handleReset, handleKeyDown,
  } = useCatalogSearch(kind, onSelect);

  useClickOutside(containerRef, close);

  const activeId = activeIdx >= 0 ? `cs-opt-${activeIdx}` : undefined;

  return (
    <div className="catalog-search" ref={containerRef}>
      <label className="vf-label" htmlFor="catalog-q">Caută în catalog (opțional)</label>
      <div className="catalog-search__wrap">
        <input
          id="catalog-q" type="text"
          role="combobox"
          aria-expanded={open && shouldFetch}
          aria-autocomplete="list"
          aria-controls="catalog-search-listbox"
          aria-activedescendant={activeId}
          className="vf-input catalog-search__input"
          placeholder="ex: iPhone 15, Samsung S24…"
          value={query} autoComplete="off"
          onChange={onQueryChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
        />
        {isFetching && <span className="catalog-search__spinner" aria-hidden="true" />}
        {selected && (
          <button type="button" className="catalog-search__clear"
            onClick={handleReset} aria-label="Resetează selecția">
            ×
          </button>
        )}
      </div>

      {isError && (
        <p className="catalog-search__error">Eroare la căutare. Completează câmpurile manual.</p>
      )}

      {open && shouldFetch && (
        <ul id="catalog-search-listbox" className="catalog-search__dropdown" role="listbox">
          {results.length === 0 && !isFetching && (
            <li className="catalog-search__empty">
              Niciun produs găsit. Completează manual câmpurile de mai jos.
            </li>
          )}
          {results.map((entry, idx) => (
            <li key={entry._id} id={`cs-opt-${idx}`}
              className={`catalog-search__item${idx === activeIdx ? " catalog-search__item--active" : ""}`}
              role="option"
              aria-selected={selected?._id === entry._id}
              onMouseDown={() => handleSelect(entry)}>
              <span className="catalog-search__item-brand">{entry.brand}</span>
              <span className="catalog-search__item-model">
                {entry.specs?.model || entry.specs?.name}
              </span>
              {entry.specs?.stocare && (
                <span className="catalog-search__item-tag">{entry.specs.stocare}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CatalogSearch;
