"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import CustomButton from "./components/CustomButton";

export default function NotFoundPage() {
	const containerRef = useRef(null);
	const bgGroupRef = useRef(null);
	const textRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		const ctx = gsap.context(() => {
			// 1. Entrance: Background Grid
			gsap.from(bgGroupRef.current, {
				opacity: 0,
				scale: 1.1,
				duration: 2,
				ease: "power2.out",
			});

			// 2. Entrance: Text & Button
			gsap.from(".content-entry", {
				y: 50,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
				delay: 0.5,
			});

			// 3. Floating "404" Animation
			gsap.to(textRef.current, {
				y: -15,
				duration: 3,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});

			// 4. Mouse Parallax (Full Screen)
			const handleMouseMove = (e) => {
				const { clientX, clientY } = e;
				const xPos = (clientX / window.innerWidth - 0.5) * -40;
				const yPos = (clientY / window.innerHeight - 0.5) * -40;

				gsap.to(bgGroupRef.current, {
					x: xPos,
					y: yPos,
					duration: 1,
					ease: "power2.out",
					overwrite: "auto",
				});
			};

			window.addEventListener("mousemove", handleMouseMove);
			return () => window.removeEventListener("mousemove", handleMouseMove);
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden"
		>
			{/* --- Background Layer (Full Screen Grid) --- */}
			<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
				<div
					className="absolute w-[120vw] h-[120vh] -left-[10vw] -top-[10vh]"
					style={{
						background:
							"radial-gradient(circle at center, rgba(12, 172, 79, 0.15) 0%, #000000 60%)",
					}}
				>
					<div ref={bgGroupRef} className="w-full h-full relative">
						{/* Grid Pattern */}
						<svg
							width="100%"
							height="100%"
							className="absolute inset-0 opacity-20"
						>
							<defs>
								<pattern
									id="notFound-grid"
									width="60"
									height="60"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 60 0 L 0 0 0 60"
										fill="none"
										stroke="white"
										strokeWidth="1"
									/>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#notFound-grid)" />
						</svg>

						{/* 3x3 Vertex Dots */}
						<div className="absolute inset-0">
							{/* Increased loop size for full screen coverage */}
							{Array.from({ length: 30 }).map((_, i) =>
								Array.from({ length: 40 }).map((_, j) => {
									// 3x3 Logic: Only render on every 3rd row AND 3rd column
									if (i % 3 !== 0 || j % 3 !== 0) return null;

									// Randomize alpha slightly for a "glitched/broken" feel
									const spread = 12;
									const alpha = Math.random() * 0.15 + 0.05;

									return (
										<div
											key={`dot-${i}-${j}`}
											className="absolute"
											style={{
												left: `${j * 60}px`,
												top: `${i * 60}px`,
												width: `${spread}px`,
												height: `${spread}px`,
												background: `radial-gradient(circle, rgba(255,255,255,${alpha}) 0%, rgba(255,255,255,0) 70%)`,
												transform: "translate(-50%, -50%)",
											}}
										/>
									);
								}),
							)}
						</div>
					</div>
				</div>
			</div>

			{/* --- Content Layer --- */}
			<div className="relative z-10 flex flex-col items-center text-center px-4">
				{/* 404 Number */}
				<h1
					ref={textRef}
					className="content-entry text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter"
					style={{
						background:
							"linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.1) 100%)",
						backgroundClip: "text",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						color: "transparent",
						textShadow: "0px 10px 30px rgba(12, 172, 79, 0.2)",
					}}
				>
					404
				</h1>

				{/* Subtext */}
				<div className="content-entry -mt-4 md:-mt-10 mb-10 flex flex-col gap-2">
					<h2 className="text-2xl md:text-3xl font-semibold text-white">
						Page Missing.
					</h2>
					<p className="text-gray-400 text-sm md:text-base max-w-md">
						The page you are looking for has been moved, removed, or never
						existed.
					</p>
				</div>

				{/* Go Back Button */}
				<div className="content-entry">
					<CustomButton
						onClick={() => router.back()}
						className="bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center px-8 py-3 text-lg font-semibold shadow-[0_0_20px_rgba(12,172,79,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(12,172,79,0.6)]"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Go Back
					</CustomButton>
				</div>
			</div>
		</div>
	);
}
