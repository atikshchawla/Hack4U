"use client";

export default function CustomButton({
	children,
	text = "Read more",
	className = "",
	onClick,
	link,
	...props
}) {
	const handleClick = (e) => {
		if (link) {
			window.open(link, "_blank");
		}
		if (onClick) {
			onClick(e);
		}
	};

	return (
		<button
			className={`px-6.25 py-3 btn-gradient-border text-base font-normal text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] ${className}`}
			onClick={handleClick}
			{...props}
		>
			{children || text}
		</button>
	);
}
