import { useState } from "react";
import "./SearchBar.css";
import { SearchIcon, CloseIcon } from "../icons";
import { useHeaderSearch } from "../useHeaderSearch";

const SearchBar = ({ mobileOpen, onCloseMobile }) => {
  const [query, setQuery] = useState("");
  const searchNavigate = useHeaderSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchNavigate(query);
    setQuery("");
    onCloseMobile();
  };

  return (
    <>
      <form className={`search-bar${mobileOpen ? " search-bar--mobile-open" : ""}`} onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Caută smartphone, brand sau model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={mobileOpen}
        />
        <button type="submit" className="search-btn" aria-label="Caută"><SearchIcon /></button>
      </form>

      <form className={`mob-search-bar${mobileOpen ? " mob-search-bar--visible" : ""}`} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Caută smartphone, brand sau model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={mobileOpen}
        />
        <button type="submit"><SearchIcon /></button>
        <button type="button" className="mob-search-close" onClick={onCloseMobile}><CloseIcon /></button>
      </form>
    </>
  );
};

export default SearchBar;
