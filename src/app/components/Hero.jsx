"use client";

import { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";

export default function Hero() {
	const cardRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	return (
		<main className="relative w-full bg-[#040704] text-white font-sans overflow-hidden">
			<style jsx>{`
				@keyframes traceEllipseLeft {
					0% {
						stroke-dashoffset: -1;
						opacity: 1;
					}
					100% {
						stroke-dashoffset: -0.5;
						opacity: 1;
					}
				}

				@keyframes traceEllipseRight {
					0% {
						stroke-dashoffset: 0.5;
						opacity: 1;
					}
					100% {
						stroke-dashoffset: 0;
						opacity: 1;
					}
				}

				.ellipse-animate-left {
					stroke-dashoffset: 0;
					stroke-dasharray: 0.5 1;
					animation: traceEllipseLeft 3s ease-out forwards;
				}

				.ellipse-animate-right {
					stroke-dashoffset: 0;
					stroke-dasharray: 0.5 1;
					animation: traceEllipseRight 3s ease-out forwards;
				}

				/* Hide all ellipses by default */
				svg ellipse {
					opacity: 0;
				}

				/* Show ellipses only when animation class is applied */
				svg ellipse.ellipse-animate-left,
				svg ellipse.ellipse-animate-right {
					opacity: 1;
				}
			`}</style>

			{/* Scene root */}
			<div className="relative w-full overflow-hidden">
				{/* Triangle gradient wrapper */}
				<div className="absolute inset-0 z-1 pointer-events-none">
					<div
						className="absolute left-1/2 top-[24vh] -translate-x-1/2 w-264.75 h-183.75 opacity-68"
						style={{ filter: "blur(68px)" }}
					>
						{/* Main center glow */}
						<div
							className="absolute left-[41.3%] top-[42.7%] w-[12.5%] h-[18%]"
							style={{
								background:
									"radial-gradient(60% 60% at 50% 50%, rgba(38,190,102,0.95) 0%, rgba(38,190,102,0.7) 35%, rgba(38,190,102,0.4) 60%, rgba(38,190,102,0.2) 80%, transparent 100%)",
								clipPath: "polygon(100% 0%, 0% 0%, 36% 100%, 78% 100%)",
								mixBlendMode: "plus-lighter",
							}}
						></div>

						{/* Top wing */}
						<div
							className="absolute left-[16%] top-[17%] w-[63%] h-[27.8%]"
							style={{
								background:
									"radial-gradient(120% 100% at 50% 0%, rgba(205,255,226,0.8) 0%, rgba(12,172,79,0.55) 45%, rgba(12,172,79,0.3) 70%, transparent 100%)",
								clipPath:
									'path("M667.238 0H0C0 0 49.034 198.711 304.664 198.711C560.294 198.711 667.238 0 667.238 0Z")',
								mixBlendMode: "plus-lighter",
							}}
						></div>

						{/* Inner wing accent */}
						<div
							className="absolute left-[18%] top-[17%] w-[58%] h-[25.7%] opacity-80"
							style={{
								backgroundColor: "#CDFFE2",
								clipPath:
									'path("M565.935 0H0C0 0 41.59 184.099 258.42 184.099C475.25 184.099 565.935 0 565.935 0Z")',
							}}
						></div>

						{/* Vertical pillar */}
						<div
							className="absolute left-[46.3%] top-[33.4%] w-[4.3%] h-[51.4%] opacity-60"
							style={{
								background:
									"linear-gradient(180deg, rgba(205,255,226,0.9) 0%, rgba(12,172,79,0.6) 35%, rgba(12,172,79,0.35) 60%, rgba(12,172,79,0.15) 80%, transparent 100%)",
								clipPath: "polygon(100% 0%, 0% 0%, 57% 100%)",
								filter: "blur(50px)",
							}}
						></div>

						{/* Bottom glow */}
						<div
							className="absolute left-[41.3%] top-[42.7%] w-[12.5%] h-[18%] opacity-40"
							style={{
								background:
									"radial-gradient(50% 50% at 50% 50%, rgba(5,124,53,0.9) 0%, rgba(5,124,53,0.5) 40%, rgba(5,124,53,0.25) 65%, rgba(5,124,53,0.1) 80%, transparent 100%)",
							}}
						></div>
					</div>
				</div>
				{/* Hero text stack */}
				<div className="relative z-5 text-center pt-24 sm:pt-32 md:pt-[15vh]">
					<h1
						className="text-[clamp(5rem,22vw,10rem)] bg-clip-text text-transparent leading-tight"
						style={{
							background:
								"linear-gradient(180deg, #FFFFFF 63.33%, rgba(213, 213, 213, 0.6) 78.61%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Hack4u
					</h1>
					<p
						className="mt-1 text-[clamp(2.2rem,9vw,4.5rem)] bg-clip-text text-transparent leading-snug"
						style={{
							background:
								"linear-gradient(180deg, #FFFFFF 63.33%, rgba(213, 213, 213, 0.6) 78.61%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Hack. Build. Ship.
					</p>
				</div>
				<div className="flex justify-center mt-24 mb-40 md:mt-24 md:mb-44">
					<CustomButton
						text="Explore Tracks"
						onClick={() => {
							const tracksSection = document.getElementById("tracks");
							if (tracksSection) {
								tracksSection.scrollIntoView({ behavior: "smooth" });
							}
						}}
					/>
				</div>
				{/* Glass morph block wrapper with ellipses */}
				<div className="relative z-6 w-full max-w-225 min-h-118.5 h-auto mx-auto mt-0 md:mt-[24vh] mb-40 px-4 md:px-6 lg:max-w-[87.3%]">
					{/* SVG Ellipses - positioned behind glass card */}
					<div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 z-1 pointer-events-none">
						{/* Layer 1 - tangent at center (top-1/2) */}
						<svg
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
							width="1277"
							height="618"
							style={{ filter: "blur(2px)" }}
						>
							<defs>
								<linearGradient
									id="combinedGradientLeft"
									x1="0%"
									y1="0%"
									x2="0%"
									y2="100%"
								>
									<stop offset="4.81%" stopColor="#0CAC4F" />
									<stop offset="18.27%" stopColor="#0CAC4F" />
									<stop offset="40.87%" stopColor="#0CAC4F" />
									<stop offset="46.63%" stopColor="#FFFFFF" />
									<stop offset="50.96%" stopColor="#FFFFFF" />
								</linearGradient>
								<linearGradient
									id="combinedGradientRight"
									x1="0%"
									y1="100%"
									x2="0%"
									y2="0%"
								>
									<stop offset="4.81%" stopColor="#0CAC4F" />
									<stop offset="18.27%" stopColor="#0CAC4F" />
									<stop offset="40.87%" stopColor="#0CAC4F" />
									<stop offset="46.63%" stopColor="#FFFFFF" />
									<stop offset="50.96%" stopColor="#FFFFFF" />
								</linearGradient>
							</defs>

							{/* LEFT ellipses - ACW from tangent (right side = 0°) */}
							<g transform="translate(638.5, 309)">
								<ellipse
									pathLength="1"
									cx="-104.245"
									cy="0"
									rx="104.25"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientLeft)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-159.625"
									cy="0"
									rx="159.625"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientLeft)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-216.09"
									cy="0"
									rx="216.09"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientLeft)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-269.3"
									cy="0"
									rx="269.3"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientLeft)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-319.25"
									cy="0"
									rx="319.25"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientLeft)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
							</g>

							{/* RIGHT ellipses - CW from tangent (left side = 0°) */}
							<g transform="translate(638.5, 309)">
								<ellipse
									transform="rotate(180, 104.245, 0)"
									pathLength="1"
									cx="104.245"
									cy="0"
									rx="104.245"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientRight)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 159.625, 0)"
									pathLength="1"
									cx="159.625"
									cy="0"
									rx="159.625"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientRight)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 216.09, 0)"
									pathLength="1"
									cx="216.09"
									cy="0"
									rx="216.09"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientRight)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 269.3, 0)"
									pathLength="1"
									cx="269.3"
									cy="0"
									rx="269.3"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientRight)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 319.25, 0)"
									pathLength="1"
									cx="319.25"
									cy="0"
									rx="319.25"
									ry="308.83"
									fill="none"
									stroke="url(#combinedGradientRight)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
							</g>
						</svg>

						{/* Layer 2 - tangent lower (top-64%) */}
						<svg
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
							width="1036"
							height="518"
							style={{ filter: "blur(2px)" }}
						>
							{/* LEFT ellipses - ACW from tangent */}
							<g transform="translate(518, 331.2)">
								<ellipse
									pathLength="1"
									cx="-84.57"
									cy="0"
									rx="84.57"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-129.5"
									cy="0"
									rx="129.5"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-175.31"
									cy="0"
									rx="175.31"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-219.975"
									cy="0"
									rx="219.975"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
								<ellipse
									pathLength="1"
									cx="-259"
									cy="0"
									rx="259"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-left" : ""}
								/>
							</g>

							{/* RIGHT ellipses - CW from tangent */}
							<g transform="translate(518, 331.2)">
								<ellipse
									transform="rotate(180, 84.57, 0)"
									pathLength="1"
									cx="84.57"
									cy="0"
									rx="84.57"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 129.5, 0)"
									pathLength="1"
									cx="129.5"
									cy="0"
									rx="129.5"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 175.31, 0)"
									pathLength="1"
									cx="175.31"
									cy="0"
									rx="175.31"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 219.975, 0)"
									pathLength="1"
									cx="219.975"
									cy="0"
									rx="219.975"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
								<ellipse
									transform="rotate(180, 259, 0)"
									pathLength="1"
									cx="259"
									cy="0"
									rx="259"
									ry="259"
									fill="none"
									stroke="rgba(23, 102, 57, 1)"
									strokeWidth="1"
									className={isVisible ? "ellipse-animate-right" : ""}
								/>
							</g>
						</svg>
					</div>

					{/* Glass morph card - sits on top */}
					<div
						ref={cardRef}
						className={`relative z-2 p-6 px-6 md:p-14 md:px-12 rounded-3xl border border-white/20 transform transition-transform duration-1000 ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-32"}`}
						style={{
							background: "rgba(255, 255, 255, 0.03)",
							backdropFilter: "blur(24px)",
							WebkitBackdropFilter: "blur(24px)",
							boxShadow: `
                0 8px 32px 0 rgba(0, 0, 0, 0.4),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1)
              `,
						}}
					>
						{/* Attached ambients */}
						<div
							className="absolute -top-30 -left-35 w-70 h-70 pointer-events-none opacity-60"
							style={{
								background:
									"radial-gradient(circle at center, rgba(120, 255, 200, 0.85) 0%, rgba(120, 255, 200, 0.45) 35%, rgba(120, 255, 200, 0.2) 55%, transparent 75%)",
								filter: "blur(45px)",
							}}
						></div>

						{/* Glass content */}
						<h2
							className="text-[clamp(2rem,5vw,4rem)] mb-6 text-center bg-clip-text text-transparent"
							style={{
								background:
									"linear-gradient(180deg, #FFFFFF 63.33%, rgba(213, 213, 213, 0.6) 78.61%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							What is Hack4u?
						</h2>

						<p className="text-[clamp(1rem,3vw,1.5rem)] max-w-4xl mx-auto mb-4 text-center bg-clip-text">
							Hack4u is a 36-hour innovative hackathon where ideas turn into
							reality. Join a community of builders, developers, and creators as
							we push the boundaries of technology and innovation together.
						</p>

						<h3
							className="text-[clamp(2rem,5vw,3rem)] mb-6 text-center bg-clip-text text-transparent"
							style={{
								background:
									"linear-gradient(180deg, #FFFFFF 63.33%, rgba(213, 213, 213, 0.6) 78.61%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							Why Join Hack4u?
						</h3>

						<p className="text-[clamp(1rem,3vw,1.5rem)] max-w-4xl mx-auto mb-2 text-center bg-clip-text">
							Hack4u is built for curious minds who want to solve real problems,
							ship bold ideas, and learn by building with teammates under one
							roof.
						</p>
						<p className="text-[clamp(1rem,3vw,1.5rem)] max-w-4xl mx-auto mb-2 text-center bg-clip-text">
							Whether you are into AI, product design, full-stack development,
							or impact-driven projects, this hackathon gives you the space,
							mentorship, and energy to create something meaningful.
						</p>
						<p className="text-[clamp(1rem,3vw,1.5rem)] max-w-4xl mx-auto text-center bg-clip-text">
							Come for the challenge, stay for the people, and leave with a
							project you are proud of.
						</p>
					</div>
				</div>
			</div>

			{/* Bottom green gradient transition */}
			<div
				className="absolute -bottom-87.5 left-1/2 -translate-x-1/2 w-350 h-175 pointer-events-none z-10"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(5, 124, 53, 0.45) 0%, rgba(34, 82, 44, 0.3) 30%, transparent 60%)",
					filter: "blur(60px)",
				}}
			></div>
		</main>
	);
}
