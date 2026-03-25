"use client";
import React, { useEffect, useRef } from "react";
import CustomButton from "./CustomButton";
import { Icon } from "@iconify/react";

export default function Footer() {
	const triggerRef = useRef(null);

	useEffect(() => {
		const trigger = triggerRef.current;
		if (!trigger) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const desktopLine = document.getElementById("line-desktop");
						const mobileLine = document.getElementById("line-mobile");

						if (desktopLine) {
							desktopLine.classList.remove("opacity-0");
							desktopLine.classList.add("animate-draw-line");
						}
						if (mobileLine) {
							mobileLine.classList.remove("opacity-0");
							mobileLine.classList.add("animate-draw-line");
						}

						setTimeout(() => {
							const bear = document.getElementById("anim-bear");
							if (bear) {
								if (window.matchMedia("(min-width: 768px)").matches) {
									bear.classList.add("animate-bear-pop-desktop");
								} else {
									bear.classList.add("animate-bear-pop-mobile");
								}
							}
						}, 300);

						setTimeout(() => {
							const glow = document.getElementById("anim-glow");
							if (glow) glow.classList.add("animate-shockwave");
						}, 600);

						setTimeout(() => {
							const text = document.getElementById("anim-text");
							if (text) text.classList.add("animate-cyber-glitch");
						}, 800);

						setTimeout(() => {
							const item1 = document.getElementById("footer-item-1");
							if (item1) item1.classList.add("animate-fade-up");
						}, 1000);

						setTimeout(() => {
							const item2 = document.getElementById("footer-item-2");
							if (item2) item2.classList.add("animate-fade-up");
						}, 1200);

						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 },
		);

		observer.observe(trigger);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className="bg-[#040704] text-white overflow-hidden h-screen w-screen flex flex-col font-sans">
			<style
				dangerouslySetInnerHTML={{
					__html: `
        .prevent-select {
          -webkit-user-drag: none;
          user-select: none;
        }

        .tray-fade-mask {
          mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }

        .spring-physics {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease, color 0.4s ease;
        }

        .spring-physics:hover {
          transform: translateY(-5px) scale(1.15);
          filter: drop-shadow(0 0 12px rgba(74, 222, 128, 0.6));
        }

        .logo-spring {
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease;
        }

        .logo-spring:hover {
          transform: scale(1.05);
          filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
        }

        .text-spring {
            transition: color 0.3s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .text-spring:hover {
            color: #ffffff;
            transform: translateX(5px);
        }

        .bear-start {
          transform: translateX(-50%) translateY(100%) scale(0.2);
          opacity: 0;
        }

        @keyframes drawLine {
          0% { stroke-dasharray: 0, 2000; opacity: 0.5; }
          100% { stroke-dasharray: 2000, 0; opacity: 1; }
        }
        .animate-draw-line {
          animation: drawLine 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes bearPopMobile {
          0% { transform: translateX(-50%) translateY(100%) scale(0.2); opacity: 0; }
          60% { transform: translateX(-50%) translateY(0) scale(0.55); } 
          100% { transform: translateX(-50%) translateY(0) scale(0.5); opacity: 1; }
        }
        .animate-bear-pop-mobile {
          animation: bearPopMobile 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bearPopDesktop {
          0% { transform: translateX(-50%) translateY(100%) scale(0.5); opacity: 0; }
          60% { transform: translateX(-50%) translateY(0) scale(1.5); }
          100% { transform: translateX(-50%) translateY(0) scale(1.42); opacity: 1; }
        }
        .animate-bear-pop-desktop {
          animation: bearPopDesktop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shockwave {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shockwave {
          animation: shockwave 1s ease-out forwards;
        }

        @keyframes cyberGlitch {
          0% { opacity: 0; transform: scale(1.5) skew(10deg); filter: blur(5px); }
          20% { opacity: 1; transform: scale(1.2) skew(-10deg); }
          40% { transform: scale(0.9) skew(5deg); text-shadow: 2px 0 #ff0000, -2px 0 #00ff00; }
          60% { transform: scale(1.05) skew(0deg); text-shadow: none; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; filter: none; }
        }
        .animate-cyber-glitch {
          animation: cyberGlitch 0.6s steps(2, end) forwards;
        }

        @keyframes fadeUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }
      `,
				}}
			/>

			<div
				id="footer-trigger"
				ref={triggerRef}
				className="relative flex-1 flex flex-col min-h-0"
			>
				<div className="relative w-full flex-1 flex justify-center items-end pointer-events-none">
					<div className="absolute w-full h-full bottom-0 z-10 flex justify-center">
						<div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
							<div
								id="anim-glow"
								className="w-full h-full origin-bottom opacity-0"
							>
								<div
									className="absolute left-1/2 -translate-x-1/2 -bottom-75 md:-bottom-112.5
                                w-150 md:w-300 h-150 md:h-225
                                bg-[radial-gradient(circle,rgba(12,144,67,0.15)_0%,transparent_70%)]
                                blur-[60px] md:blur-[80px]"
								></div>
								<div
									className="absolute left-1/2 -translate-x-1/2 -bottom-50 md:-bottom-87.5
                                w-100 md:w-175 h-100 md:h-175
                                bg-[radial-gradient(closest-side,rgba(46,189,107,0.4)_0%,rgba(12,144,67,0.05)_60%,transparent_100%)]
                                blur-2xl md:blur-[50px]"
								></div>
								<div
									className="absolute left-1/2 -translate-x-1/2 -bottom-25 md:-bottom-50
                                w-62.5 md:w-100 h-62.5 md:h-100
                                bg-[radial-gradient(circle,rgba(46,189,107,0.2)_0%,transparent_70%)]
                                blur-[30px] md:blur-2xl"
								></div>
							</div>
						</div>

						<div className="absolute inset-0 z-20 tray-fade-mask">
							<svg
								className="hidden md:block w-full h-full"
								viewBox="0 0 1440 600"
								preserveAspectRatio="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									id="line-desktop"
									d="M0 450 H375 L425 600 H1015 L1065 450 H1440"
									fill="none"
									stroke="#0C9043"
									strokeWidth="1"
									vectorEffect="non-scaling-stroke"
									className="opacity-0"
									strokeDasharray="2000"
									strokeDashoffset="2000"
								/>
							</svg>
							<svg
								className="block md:hidden w-full h-full"
								viewBox="0 0 390 400"
								preserveAspectRatio="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									id="line-mobile"
									d="M0 300 H20 L50 400 H340 L370 300 H390"
									fill="none"
									stroke="#0C9043"
									strokeWidth="1.5"
									vectorEffect="non-scaling-stroke"
									className="opacity-0"
									strokeDasharray="1000"
									strokeDashoffset="1000"
								/>
							</svg>
						</div>

						<div
							id="anim-bear"
							className="bear-start absolute left-1/2 bottom-[-22vh] md:bottom-[-16vh] w-[170vw] md:w-[30vw] h-[120vh] md:h-[50vh] z-10 origin-bottom"
						>
							<img
								src="/svgs/bear-shape.svg"
								className="prevent-select absolute inset-0 w-full h-full opacity-20 z-0"
								alt="Bear Shape"
							/>

							<div className="absolute inset-0 z-30 flex flex-col justify-center items-center pt-[5vh]">
								<div
									id="anim-text"
									className="opacity-0 flex flex-col items-center"
								>
									<h1 className="text-[10vh] md:text-[14vh] font-sans font-light leading-none drop-shadow-2xl">
										<span className="bg-linear-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
											Hack4u
										</span>
									</h1>
									<p className="mt-[1vh] text-[#A1A1AA] text-[1.5em] md:text-[2vh] font-sans font-medium drop-shadow-md">
										Hack. Build. Ship.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<footer className="relative z-30 bg-[#040704] pb-[4vh] pt-[7vh] px-[5vw] md:px-[8vw] pointer-events-auto flex-none">
					<div className="flex flex-col md:flex-row justify-between items-center gap-[3vh] md:gap-[4vw]">
						<div
							id="footer-item-1"
							className="opacity-0 space-y-[4vh] w-full md:w-auto text-center md:text-left"
						>
							<img
								src="/h4u_white.png"
								className="logo-spring w-[25vw] md:w-[12vw] mx-auto md:mx-0 cursor-pointer"
								alt="Hack4u"
							/>
							<div className="text-[#A1A1AA] text-[1.3vh] md:text-[1.6vh] leading-relaxed cursor-default">
								<p className="text-spring">Hack4u Organizing Team</p>
								<p className="text-spring">Student Innovation Hackathon</p>
								<p className="text-spring">Build, collaborate, and ship</p>
								<p className="text-spring">Contact: hello@hack4u.dev</p>
							</div>
						</div>

						<div
							id="footer-item-2"
							className="opacity-0 flex flex-col items-center md:items-end gap-[4vh] md:gap-[5vh] w-full md:w-auto"
						>
							<div className="flex gap-[8vw] md:gap-[3vw] justify-center items-center">
								{[
									{ href: "#", icon: "mdi:instagram" },
									{ href: "#", icon: "prime:twitter" },
									{ href: "#", icon: "basil:linkedin-outline" },
									{ href: "#", icon: "proicons:github" },
									{ href: "#", icon: "bi:facebook" },
								].map((social, index) => (
									<a
										key={index}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative"
									>
										<Icon
											icon={social.icon}
											width="32"
											height="32"
											className="
                        w-[7vw] h-[7vw] md:w-[2.5vw] md:h-[2.5vw] 
                        text-white 
                        spring-physics
                        hover:text-green-400 
                      "
										/>
									</a>
								))}
							</div>

							<div className="transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95">
								<CustomButton
									text="Let's Connect"
									link="mailto:hello@hack4u.local"
								/>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
