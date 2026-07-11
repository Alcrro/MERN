import { useState, useEffect, useCallback } from "react";
import { useSearchCatalogQuery } from "../../../../features/catalog/rtkCatalog";
import useDebounce from "../../../../hooks/useDebounce";

const useCatalogSearch = (kind, onSelect) => {
  const [query,     setQuery]     = useState("");
  const [open,      setOpen]      = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const debouncedQ  = useDebounce(query, 300);
  const shouldFetch = debouncedQ.trim().length >= 2;

  const { data, isFetching, isError } = useSearchCatalogQuery(
    { q: debouncedQ.trim(), kind, limit: 10 },
    { skip: !shouldFetch }
  );

  const results = data?.results ?? [];

  useEffect(() => { setActiveIdx(-1); }, [data]);

  const handleSelect = useCallback((entry) => {
    setSelected(entry);
    setQuery(`${entry.brand} ${entry.specs?.model || entry.specs?.name || ""}`.trim());
    setOpen(false);
    setActiveIdx(-1);
    onSelect(entry);
  }, [onSelect]);

  const handleReset = () => {
    setSelected(null);
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
    onSelect(null);
  };

  const handleKeyDown = (e) => {
    if (!open || !results.length) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return {
    query, open, selected, activeIdx,
    isFetching, isError, results, shouldFetch,
    close:        ()  => setOpen(false),
    onQueryChange: (e) => { setQuery(e.target.value); setOpen(true); setSelected(null); },
    onFocus:       ()  => { if (shouldFetch) setOpen(true); },
    handleSelect, handleReset, handleKeyDown,
  };
};

export default useCatalogSearch;
