import { useState } from "react";
import { useGetPublicVendorProductsQuery } from "../../../../features/vendor/rtkVendor";
import Cards from "../../../products/cards/Cards";
import CardSkeleton from "../../../products/cards/CardSkeleton";
import "./VendorPageProducts.css";

const LIMIT = 12;
const SKEL = Array.from({ length: 6 });

const VendorPageProducts = ({ vendorId }) => {
	const [page, setPage] = useState(1);
	const { data, isLoading, isError } = useGetPublicVendorProductsQuery(
		{ vendorId, page, limit: LIMIT },
		{ skip: !vendorId },
	);

	const products = data?.products ?? [];
	const totalPages = data?.totalPages ?? 1;

	if (isError)
		return (
			<p className="vpp__msg vpp__msg--err">Eroare la încărcarea produselor.</p>
		);

	return (
		<section className="vpp">
			<h2 className="vpp__title">Produse disponibile</h2>

			{products.length === 0 && !isLoading ? (
				<p className="vpp__msg">
					Momentan niciun produs disponibil de la acest vânzător.
				</p>
			) : (
				<div className="card-collection card-v2-grid">
					{isLoading
						? SKEL.map((_, i) => <CardSkeleton key={i} />)
						: products.map((p) => (
								<Cards
									key={p._id}
									products={p}
								/>
							))}
				</div>
			)}

			{!isLoading && totalPages > 1 && (
				<div className="vpp__pagination">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
						<button
							key={n}
							type="button"
							className={`vpp__page-btn${n === page ? " vpp__page-btn--active" : ""}`}
							onClick={() => setPage(n)}
						>
							{n}
						</button>
					))}
				</div>
			)}
		</section>
	);
};

export default VendorPageProducts;
