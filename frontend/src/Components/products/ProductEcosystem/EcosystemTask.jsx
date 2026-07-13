import { useState } from "react";
import EcosystemItem from "./EcosystemItem";

const ChevDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const EcosystemTask = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ecosystem-task">
      <button
        type="button"
        className={`ecosystem-task__header${isOpen ? " ecosystem-task__header--open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <span className="ecosystem-task__icon">{task.icon}</span>
        <span className="ecosystem-task__label">{task.label}</span>
        <span className={`ecosystem-task__chevron${isOpen ? " ecosystem-task__chevron--open" : ""}`}>
          <ChevDown />
        </span>
      </button>
      {isOpen && (
        <div className="ecosystem-task__content">
          <p className="ecosystem-task__context">{task.context}</p>
          <div className="ecosystem-task__items">
            {task.items.map((item) => (
              <EcosystemItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcosystemTask;
