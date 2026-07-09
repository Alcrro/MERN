import { Fragment } from "react";
import { CheckIcon } from "./cartIcons";

const STEPS = ["Coș", "Livrare", "Plată"];

const Steps = () => (
  <div className="ct-steps">
    {STEPS.map((label, i) => (
      <Fragment key={label}>
        <div className={`ct-step${i === 0 ? " ct-step--active" : ""}`}>
          <span className="ct-step__dot">{i === 0 ? <CheckIcon /> : i + 1}</span>
          <span className="ct-step__label">{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`ct-step__line${i === 0 ? " ct-step__line--done" : ""}`} />
        )}
      </Fragment>
    ))}
  </div>
);

export default Steps;
