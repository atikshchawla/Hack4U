"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import CustomButton from "./CustomButton";

const CARDS = [
	{
		id: 1,
		src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
		alt: "Team collaborating in a workspace",
	},
	{
		id: 2,
		src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
		alt: "Hackathon participants discussing ideas",
	},
	{
		id: 3,
		src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
		alt: "Developers working together on laptops",
	},
	{
		id: 4,
		src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
		alt: "Startup team planning with sticky notes",
	},
	{
		id: 5,
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
		alt: "Group brainstorming during a workshop",
	},
];

// Position configs for each offset from center
const POSITIONS = {
	"-2": {
		left: "18%",
		scale: 0.7,
		rotateY: 60,
		translateZ: -150,
		zIndex: 30,
		opacity: 0.8,
	},
	"-1": {
		left: "34%",
		scale: 0.85,
		rotateY: 38,
		translateZ: -50,
		zIndex: 40,
		opacity: 1,
	},
	0: {
		left: "50%",
		scale: 1.1,
		rotateY: 0,
		translateZ: 100,
		zIndex: 50,
		opacity: 1,
	},
	1: {
		left: "66%",
		scale: 0.85,
		rotateY: -38,
		translateZ: -50,
		zIndex: 40,
		opacity: 1,
	},
	2: {
		left: "82%",
		scale: 0.7,
		rotateY: -60,
		translateZ: -150,
		zIndex: 30,
		opacity: 0.8,
	},
};

// Mobile positions - only show 3 cards, hide outer edges
const MOBILE_POSITIONS = {
	"-2": {
		left: "50%",
		scale: 0,
		rotateY: 0,
		translateZ: -200,
		zIndex: 10,
		opacity: 0,
	},
	"-1": {
		left: "15%",
		scale: 0.75,
		rotateY: 35,
		translateZ: -80,
		zIndex: 40,
		opacity: 0.7,
	},
	0: {
		left: "50%",
		scale: 1,
		rotateY: 0,
		translateZ: 50,
		zIndex: 50,
		opacity: 1,
	},
	1: {
		left: "85%",
		scale: 0.75,
		rotateY: -35,
		translateZ: -80,
		zIndex: 40,
		opacity: 0.7,
	},
	2: {
		left: "50%",
		scale: 0,
		rotateY: 0,
		translateZ: -200,
		zIndex: 10,
		opacity: 0,
	},
};

const WhoAreWe = () => {
	const [activeIndex, setActiveIndex] = useState(2);
	const [hasEnteredView, setHasEnteredView] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const sectionRef = useRef(null);
	const carouselRef = useRef(null);
	const cardRefs = useRef([]);
	const autoPlayIntervalRef = useRef(null);

	// Detect mobile screen
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Get positions based on screen size
	const getPositions = useCallback(() => {
		return isMobile ? MOBILE_POSITIONS : POSITIONS;
	}, [isMobile]);

	// Calculate offset for a card
	const getOffset = useCallback(
		(index) => {
			const length = CARDS.length;
			let offset = (index - activeIndex + length) % length;
			if (offset > length / 2) offset -= length;
			return offset;
		},
		[activeIndex],
	);

	// Animate all cards to their positions using GSAP
	const animateCards = useCallback(
		(instant = false) => {
			const positions = getPositions();
			cardRefs.current.forEach((card, index) => {
				if (!card) return;

				const offset = getOffset(index);
				const pos = positions[offset.toString()];

				if (!pos) {
					// Hidden card
					gsap.to(card, {
						left: "50%",
						xPercent: -50,
						yPercent: -50,
						scale: 0,
						rotateY: 0,
						z: 0,
						opacity: 0,
						zIndex: 0,
						duration: instant ? 0 : 1.2,
						ease: "power3.inOut",
					});
					return;
				}

				// Single animation with all properties including translateZ for smooth depth
				gsap.to(card, {
					left: pos.left,
					xPercent: -50,
					yPercent: -50,
					scale: pos.scale,
					rotateY: pos.rotateY,
					z: pos.translateZ,
					opacity: pos.opacity,
					zIndex: pos.zIndex,
					duration: instant ? 0 : 1.2,
					ease: "power2.inOut",
				});
			});
		},
		[getOffset, getPositions],
	);

	// Intersection Observer - trigger fan-out once when carousel enters view
	useEffect(() => {
		const carousel = carouselRef.current;
		if (!carousel) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isInitialized) {
					setHasEnteredView(true);
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(carousel);

		return () => observer.disconnect();
	}, [isInitialized]);

	// Trigger fan-out and start auto-play when entering view for the first time
	useEffect(() => {
		if (!hasEnteredView || isInitialized) return;

		const positions = getPositions();

		// Set initial state - all cards centered and hidden
		cardRefs.current.forEach((card) => {
			if (!card) return;
			gsap.set(card, {
				left: "50%",
				xPercent: -50,
				yPercent: -50,
				scale: 0.6,
				rotateY: 0,
				z: 0,
				opacity: 0,
				zIndex: 1,
			});
		});

		// Animate each card to its position with stagger
		cardRefs.current.forEach((card, index) => {
			if (!card) return;

			const length = CARDS.length;
			let offset = (index - activeIndex + length) % length;
			if (offset > length / 2) offset -= length;

			const pos = positions[offset.toString()];

			if (!pos) return;

			gsap.to(card, {
				left: pos.left,
				xPercent: -50,
				yPercent: -50,
				scale: pos.scale,
				rotateY: pos.rotateY,
				z: pos.translateZ,
				opacity: pos.opacity,
				zIndex: pos.zIndex,
				duration: 1,
				delay: 0.15 * Math.abs(offset),
				ease: "power3.out",
			});
		});

		setIsInitialized(true);
	}, [hasEnteredView, isInitialized, activeIndex, getPositions]);

	// Animate when activeIndex changes
	useEffect(() => {
		if (isInitialized) {
			animateCards();
		}
	}, [activeIndex, isInitialized, animateCards]);

	// Auto-rotate interval - starts after initialization and runs forever
	useEffect(() => {
		if (!isInitialized) return;

		// Start auto-rotate after fan-out animation completes
		const startTimeout = setTimeout(() => {
			autoPlayIntervalRef.current = setInterval(() => {
				setActiveIndex((prev) => (prev + 1) % CARDS.length);
			}, 3000);
		}, 1200);

		return () => {
			clearTimeout(startTimeout);
			if (autoPlayIntervalRef.current) {
				clearInterval(autoPlayIntervalRef.current);
			}
		};
	}, [isInitialized]);

	return (
		<section
			ref={sectionRef}
			className="relative w-full bg-[#040704] pt-16 pb-24 overflow-hidden flex flex-col items-center font-sans"
		>
			{/* Top green gradient transition */}
			<div
				className="absolute -top-87.5 left-1/2 -translate-x-1/2 w-350 h-175 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(5, 124, 53, 0.45) 0%, rgba(34, 82, 44, 0.3) 30%, transparent 60%)",
					filter: "blur(60px)",
				}}
			></div>

			{/* Green glow effects */}
			<div
				className="absolute top-[20%] -left-37.5 w-100 h-[400px] pointer-events-none opacity-50"
				style={{
					background:
						"radial-gradient(circle at center, rgba(57, 221, 124, 0.4) 0%, rgba(57, 221, 124, 0.15) 40%, transparent 70%)",
					filter: "blur(60px)",
				}}
			></div>
			<div
				className="absolute top-[40%] -right-[150px] w-[350px] h-[350px] pointer-events-none opacity-40"
				style={{
					background:
						"radial-gradient(circle at center, rgba(5, 124, 53, 0.5) 0%, rgba(5, 124, 53, 0.2) 45%, transparent 70%)",
					filter: "blur(50px)",
				}}
			></div>
			<div
				className="absolute bottom-[15%] left-[20%] w-[300px] h-[300px] pointer-events-none opacity-30"
				style={{
					background:
						"radial-gradient(circle at center, rgba(120, 255, 200, 0.5) 0%, rgba(90, 220, 160, 0.2) 50%, transparent 75%)",
					filter: "blur(55px)",
				}}
			></div>
			<div
				className="absolute bottom-[20%] right-[15%] w-[320px] h-[320px] pointer-events-none opacity-35"
				style={{
					background:
						"radial-gradient(circle at center, rgba(57, 221, 124, 0.45) 0%, rgba(57, 221, 124, 0.15) 45%, transparent 70%)",
					filter: "blur(55px)",
				}}
			></div>

			{/* TEXT CONTENT */}
			<div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mb-16">
				<h2 className="text-5xl md:text-[75px] font-normal mb-8 tracking-tight text-gradient-title pb-2 relative z-20 leading-[1.0]">
					What We’re About
				</h2>
				<p className="text-white max-w-[863px] text-lg md:text-[30px] leading-[1.3] mb-12 font-normal antialiased">
					The Hack4u hackathon brings together innovators and problem solvers.
					We're building a community of creators and developers exploring
					cutting-edge technology through hands-on projects and collaborative
					development. We don't just discuss technology, we build with it. Real
					innovation happens when creative ideas meet execution and teamwork.
				</p>
				<CustomButton text="Learn More" link="#" />
			</div>

			{/* --- CAROUSEL CONTAINER --- */}
			<div
				ref={carouselRef}
				className="relative z-10 w-full max-w-[1000px] mx-auto h-[280px] md:h-[350px] mt-4"
				style={{ perspective: "1000px" }}
			>
				{CARDS.map((card, index) => {
					return (
						<div
							key={card.id}
							ref={(el) => (cardRefs.current[index] = el)}
							className="absolute top-1/2 w-[180px] h-[230px] md:w-[260px] md:h-[300px] glass-frame-side"
							style={{
								transformStyle: "preserve-3d",
								backfaceVisibility: "hidden",
								left: "50%",
								transform: "translate(-50%, -50%) scale(0.8)",
								opacity: 0,
							}}
						>
							<div className="relative z-10 w-full h-full overflow-hidden bg-black rounded-[40px] md:rounded-[58px]">
								<Image
									src={card.src}
									alt={card.alt}
									fill
									className="object-cover opacity-90"
									priority={true}
									unoptimized={true}
									loading="eager"
								/>
								<div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
							</div>
						</div>
					);
				})}
			</div>

			{/* Bottom green gradient transition */}
			<div
				className="absolute -bottom-[350px] left-1/2 -translate-x-1/2 w-[1400px] h-[700px] pointer-events-none z-10"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(5, 124, 53, 0.45) 0%, rgba(34, 82, 44, 0.3) 30%, transparent 60%)",
					filter: "blur(60px)",
				}}
			></div>
		</section>
	);
};

export default WhoAreWe;
