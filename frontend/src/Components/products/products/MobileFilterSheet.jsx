const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MobileFilterSheet = ({ isOpen, onClose, activeFilterCount, productCount, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="mob-filter-backdrop" onClick={onClose} />
      <div className="mob-filter-sheet">
        <div className="mob-filter-sheet__head">
          <span>
            Filtre {activeFilterCount > 0 && <span className="mob-filter-badge">{activeFilterCount}</span>}
          </span>
          <button onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="mob-filter-sheet__body">{children}</div>
        <div className="mob-filter-sheet__foot">
          <button className="mob-filter-apply" onClick={onClose}>
            Vezi {productCount} produse
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterSheet;
