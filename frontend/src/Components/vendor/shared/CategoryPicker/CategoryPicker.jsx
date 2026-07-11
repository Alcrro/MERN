import { VENDOR_CATEGORIES } from "../../../../utils/constants";
import "./CategoryPicker.css";

const CategoryPicker = ({ value, onChange }) => (
	<div className="cat-picker">
		<label
			className="vf-label"
			htmlFor="cat-picker-select"
		>
			Categorie produs
		</label>
		<select
			id="cat-picker-select"
			className="cat-picker__select"
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value)}
		>
			<option
				value=""
				disabled
			>
				Alege categoria...
			</option>
			{VENDOR_CATEGORIES.map((c) => (
				<option
					key={c.value}
					value={c.value}
				>
					{c.label}
				</option>
			))}
		</select>
	</div>
);

export default CategoryPicker;
