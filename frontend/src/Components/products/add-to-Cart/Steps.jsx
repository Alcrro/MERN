import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { CheckIcon } from "./cartIcons";

const STEPS = ["Coș", "Detalii comandă", "Confirmare"];

const getActiveStep = (pathname) => {
  if (pathname.includes("checkout")) return 1;
  return 0;
};

const Steps = () => {
  const { pathname } = useLocation();
  const active = getActiveStep(pathname);

  return (
    <div className="ct-steps">
      {STEPS.map((label, i) => (
        <Fragment key={label}>
          <div className={`ct-step${i === active ? " ct-step--active" : ""}`}>
            <span className="ct-step__dot">
              {i < active ? <CheckIcon /> : i + 1}
            </span>
            <span className="ct-step__label">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`ct-step__line${i < active ? " ct-step__line--done" : ""}`} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Steps;
