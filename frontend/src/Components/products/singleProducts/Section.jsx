import { useState } from "react";

const Section = ({ id, sectionRef, collapsedH = 160, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="sp-section" id={id} ref={sectionRef}>
      <div className="sp-section-body" style={{ "--ch": `${collapsedH}px` }} data-expanded={expanded}>
        {children}
        {!expanded && <div className="sp-section-fade" />}
      </div>
      <button className="sp-expand-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Arată mai puțin ▲" : "Citește mai mult ▼"}
      </button>
    </div>
  );
};

export default Section;
