import { TAB_KEYS, TAB_LABELS } from "../singleProductConstants";
import "./ProductTabsNav.css";

const ProductTabsNav = ({ navRef, activeTab, scrollTo, rcount }) => {
  const label = (key) =>
    key === "recenzii" && rcount > 0 ? `${TAB_LABELS[key]} (${rcount})` : TAB_LABELS[key];

  return (
    <nav className="sp-tabs-bar" ref={navRef}>
      <div className="sp-tabs-inner">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            className={`sp-tab${activeTab === key ? " sp-tab--active" : ""}`}
            onClick={() => scrollTo(key)}
          >
            {label(key)}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ProductTabsNav;
