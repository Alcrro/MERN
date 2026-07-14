import { useState } from "react";

import { useParams } from "react-router-dom";
import { useGetEcosystemQuery } from "../../../features/product/rtkProducts";
import { TIP_SLUG_TO_TIP } from "../../../utils/categorySlugMap";
import EcosystemLevel from "./EcosystemLevel";
import EcosystemTask from "./EcosystemTask";
import "./ProductEcosystem.css";

const Skeleton = () => (
	<div className="ecosystem-skeleton">
		<div className="ecosystem-skeleton__title eco-pulse" />
		<div className="ecosystem-skeleton__line eco-pulse" />
		<div
			className="ecosystem-skeleton__line eco-pulse"
			style={{ width: "75%" }}
		/>
		<div
			className="ecosystem-skeleton__line eco-pulse"
			style={{ width: "85%" }}
		/>
	</div>
);

const ChevronIcon = ({ open }) => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 14 14"
		fill="none"
		className={`ecosystem-expand-btn__chevron${open ? " ecosystem-expand-btn__chevron--open" : ""}`}
	>
		<polyline
			points="2,5 7,9 12,5"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const ProductEcosystem = () => {
	const { tipSlug } = useParams();
	const tip = TIP_SLUG_TO_TIP[tipSlug] || "";
	const [expanded, setExpanded] = useState(false);

	const { data, isLoading } = useGetEcosystemQuery(tip, { skip: !tip });

	if (!tip) return null;
	if (isLoading) return <Skeleton />;
	if (!data?.data) return null;

	const { critical = [], recommended = [], tasks = [] } = data.data;
	const hasMore = recommended.length > 0 || tasks.length > 0;

	return (
		<div className="ecosystem-wrap">
			<h3 className="ecosystem-heading">Accesorii pentru {tip}</h3>

			<EcosystemLevel
				variant="critical"
				items={critical}
			/>

			{hasMore && (
				<>
					<div
						className={`ecosystem-more${expanded ? " ecosystem-more--open" : ""}`}
					>
						<EcosystemLevel
							variant="recommended"
							items={recommended}
						/>

						{tasks.length > 0 && (
							<div className="ecosystem-tasks">
								<p className="ecosystem-tasks__label">Depinde ce vrei să faci</p>
								{tasks.map((task) => (
									<EcosystemTask
										key={task.id}
										task={task}
									/>
								))}
							</div>
						)}
					</div>

					<button
						type="button"
						className="ecosystem-expand-btn"
						onClick={() => setExpanded((e) => !e)}
					>
						<span>{expanded ? "Mai puțin" : "Mai mult"}</span>
						<ChevronIcon open={expanded} />
					</button>
				</>
			)}
		</div>
	);
};

export default ProductEcosystem;
