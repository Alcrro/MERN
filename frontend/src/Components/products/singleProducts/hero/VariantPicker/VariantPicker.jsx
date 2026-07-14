import { COLOR_MAP, isLightHex } from "../../../../../utils/colorUtils";
import "./VariantPicker.css";

const VariantPicker = ({ attrKeys, options, selected, isValid, onSelect }) => {
	if (!attrKeys.length) return null;

	return (
		<div className="">
			{attrKeys.map((key) => (
				<div
					key={key}
					className="vp__group"
				>
					<span className="vp__label">
						{key}
						{selected[key] && (
							<strong className="vp__selected-val">: {selected[key]}</strong>
						)}
					</span>

					{key === "Culoare" ? (
						<div className="vp__swatches">
							{options[key]?.map((val) => {
								const hex = COLOR_MAP[val];
								const on = selected[key] === val;
								const invalid = !isValid(key, val);
								const light = hex ? isLightHex(hex) : false;
								return (
									<button
										key={val}
										type="button"
										title={val}
										aria-label={val}
										aria-pressed={on}
										disabled={invalid}
										className={`vp__swatch${on ? " vp__swatch--on" : ""}${invalid ? " vp__swatch--disabled" : ""}${light ? " vp__swatch--light" : ""}`}
										style={{ background: hex || "#9ca3af" }}
										onClick={() => onSelect(key, val)}
									/>
								);
							})}
						</div>
					) : (
						<div className="vp__chips">
							{options[key]?.map((val) => {
								const on = selected[key] === val;
								const invalid = !isValid(key, val);
								return (
									<button
										key={val}
										type="button"
										aria-pressed={on}
										disabled={invalid}
										className={`vp__chip${on ? " vp__chip--on" : ""}${invalid ? " vp__chip--disabled" : ""}`}
										onClick={() => onSelect(key, val)}
									>
										{val}
									</button>
								);
							})}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default VariantPicker;
