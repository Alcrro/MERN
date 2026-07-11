import { Fragment } from "react";
import { CLOTHING_SIZES } from "../../../../utils/constants";
import "./CatalogRow.css";
import { SPEC_COLS } from "./catalogCols";
import CatalogVariantTable from "./CatalogVariantTable";

const CatalogRow = ({ entry, isOpen, onToggle, draft, onVariant, onSizes, onPublish }) => {
  const cols = SPEC_COLS[entry.kind] ?? [() => "—", () => "—"];
  const s    = entry.specs || {};
  const name = s.model || s.name || "—";

  return (
    <Fragment>
      <tr className={`vcp__tr${isOpen ? " vcp__tr--open" : ""}`} onClick={onToggle}>
        <td className="vcp__td-toggle">
          <span className="vcp__expand-icon">{isOpen ? "▾" : "▸"}</span>
        </td>
        <td>
          <span className="vcp__td-brand">{entry.brand}</span>
          <span className="vcp__td-model">{name}</span>
          <span className="vcp__td-inline-specs">
            {[cols[0](s), cols[1](s)].filter((v) => v && v !== "—").join(" · ")}
          </span>
        </td>
        <td className="vcp__td-spec">{cols[0](s)}</td>
        <td className="vcp__td-spec">{cols[1](s)}</td>
      </tr>

      {isOpen && (
        <tr className="vcp__tr-expand">
          <td colSpan={4}>
            <div className="vcp__expand-body">
              {entry.kind === "Clothing" && (
                <div className="vcp__expand-col vcp__expand-col--full">
                  <span className="vcp__expand-label">Mărimi disponibile</span>
                  <div className="vcp__size-chips">
                    {CLOTHING_SIZES.map((sz) => (
                      <button key={sz} type="button"
                        className={`vcp__size-chip${draft.sizes.includes(sz) ? " vcp__size-chip--on" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSizes(draft.sizes.includes(sz)
                            ? draft.sizes.filter((x) => x !== sz)
                            : [...draft.sizes, sz]);
                        }}>
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <CatalogVariantTable
                entry={entry} draft={draft}
                onVariant={onVariant} onPublish={onPublish}
              />
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default CatalogRow;
