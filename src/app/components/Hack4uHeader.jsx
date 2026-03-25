"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hack4uHeader() {
	const headerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// ------------------------------------------------
			// 1. INITIAL ENTRY ANIMATION
			// ------------------------------------------------

			gsap.from(headerRef.current, {
				y: 50,
				opacity: 0,
				duration: 1,
				ease: "power3.out",
				delay: 0.2,
			});
		}, headerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div className="absolute top-0 left-0 w-full z-50 pointer-events-none p-10 md:pl-24">
			<div ref={headerRef} className="origin-bottom-left">
				<h1
					className="text-white font-bold leading-none tracking-tight drop-shadow-2xl"
					style={{ fontSize: "5.5rem" }}
				>
					Hack4U
				</h1>

				{/* Subtext */}
				<div>
					<p className="text-4xl text-gray-300 mt-4 font-light drop-shadow-md">
						Let's set things up
					</p>
				</div>
			</div>
		</div>
	);
}
