import { useState } from "react";
import { useGetMyVouchersQuery } from "../../../features/voucher/rtkVoucher";
import "./ProfileVouchers.css";

const fmt = (d) => new Date(d).toLocaleDateString("ro-RO");

const VoucherCard = ({ v }) => {
	const [copied, setCopied] = useState(false);

	const copy = () => {
		navigator.clipboard.writeText(v.code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		});
	};

	const expired = v.expiresAt && new Date(v.expiresAt) < new Date();
	const inactive = !v.active || v.isRedeemed || expired;

	return (
		<div className={`pv-card${inactive ? " pv-card--used" : ""}`}>
			<div className="pv-card__top">
				<span className="pv-card__code">{v.code}</span>
				<button
					type="button"
					className="pv-card__copy"
					onClick={copy}
				>
					{copied ? "Copiat!" : "Copiază"}
				</button>
			</div>

			<div className="pv-card__info">
				<span className="pv-card__discount">
					{v.type === "percent" ? `-${v.value}%` : `-${v.value} RON`}
				</span>
				{v.vendorId && (
					<span className="pv-card__vendor">
						{v.vendorId.shopName || v.vendorId.name || "Magazin vendor"}
					</span>
				)}
			</div>

			<div className="pv-card__meta">
				{v.expiresAt && (
					<span className="pv-card__expires">
						{expired ? "Expirat " : "Expiră "}
						{fmt(v.expiresAt)}
					</span>
				)}
				<span
					className={`pv-card__badge pv-card__badge--${inactive ? "used" : "active"}`}
				>
					{v.isRedeemed
						? "Folosit"
						: expired
							? "Expirat"
							: !v.active
								? "Inactiv"
								: "Activ"}
				</span>
			</div>
		</div>
	);
};

const ProfileVouchers = () => {
	const { data, isLoading } = useGetMyVouchersQuery();
	const vouchers = data?.data ?? [];

	if (isLoading)
		return (
			<div className="prf-section">
				<h2 className="prf-sec-title">Voucherele mele</h2>
				<p className="pv-loading">Se încarcă...</p>
			</div>
		);

	return (
		<div className="prf-section">
			<h2 className="prf-sec-title">Voucherele mele</h2>
			{vouchers.length === 0 ? (
				<div className="prf-empty">
					<p>Nu ai primit niciun voucher încă.</p>
				</div>
			) : (
				<div className="pv-grid">
					{vouchers.map((v) => (
						<VoucherCard
							key={v._id}
							v={v}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ProfileVouchers;
