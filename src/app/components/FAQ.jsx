"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import "../globals.css";

const FAQ_DATA = {
	General: [
		{
			q: "Do I need prior hackathon experience?",
			a: "No. Beginners are encouraged to join, you can learn and build during the event.",
		},
		{
			q: "Do I need a pre-formed team?",
			a: "You can participate solo or in teams of up to 3–5 members maximum, you can find teammates during the event as well.",
		},
		{
			q: "When is the event happening?",
			a: "7th Feb 8:00 am to 8th Feb 2:00 pm.",
		},
		{
			q: "What should I bring?",
			a: "Laptop, charger, student ID, and anything you need for an overnight build session.",
		},
		{
			q: "Will problem statements/tracks be provided?",
			a: "No, there will be no problem statements or track given to you, you are free to choose it.",
		},
		{
			q: "What should I do for overnight slips?",
			a: "girls hostel- give attendance in the hostel before 9:00 pm and come to the venue. boys hostel- come to the venue before 9:00 pm, attendance will be taken at the venue.",
		},
	],
	Hack4u: [
		{
			q: "What is the theme of Hack4u?",
			a: "Hack4u is an open-innovation hackathon where teams can build in any meaningful tech direction.",
		},
		{
			q: "What is the format of Hack4u?",
			a: "It is a 30-hour intensive hybrid hackathon.",
		},
		{
			q: "Can I join physically?",
			a: "Yes, we have a physical venue for local participants.",
		},
		{
			q: "What is the schedule?",
			a: "The full schedule will be emailed to registered participants.",
		},
		{
			q: "Is there a prize pool?",
			a: "Yes, there are major prizes for top teams and specific track winners.",
		},
	],
	"Event Day": [
		{
			q: "What should I bring?",
			a: "Bring your laptop, chargers, a valid ID, and your passion!",
		},
		{
			q: "I don't have a team!",
			a: "We'll have a team-matching session at the start of the event.",
		},
		{
			q: "I don't have any ideas!",
			a: "We provide mentorship and brainstorming workshops to help.",
		},
	],
	"Sign Up": [
		{
			q: "Where can I register?",
			a: "You can register through the 'Login' button on our page.",
		},
		{
			q: "When is the deadline?",
			a: "Registration closes one week before the event starts.",
		},
		{
			q: "Do I need to be a student?",
			a: "Yes, but we also allow recent graduates and hobbyists.",
		},
	],
};

const springConfig = { type: "spring", stiffness: 500, damping: 30, mass: 1 };

const sweepVariants = {
	enter: (direction) => ({
		x: direction > 0 ? "20%" : "-20%",
		opacity: 0,
		filter: "blur(8px)",
	}),
	center: {
		x: 0,
		opacity: 1,
		filter: "blur(0px)",
	},
	exit: (direction) => ({
		x: direction < 0 ? "20%" : "-20%",
		opacity: 0,
		filter: "blur(8px)",
	}),
};

const FAQ = () => {
	const categories = Object.keys(FAQ_DATA);
	const [[page, direction], setPage] = useState([0, 0]);
	const [openIndex, setOpenIndex] = useState(null);

	const activeTab = categories[page];

	const paginate = (newPageIndex) => {
		const newDirection = newPageIndex > page ? 1 : -1;
		setOpenIndex(null);
		setPage([newPageIndex, newDirection]);
	};

	return (
		<div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-start md:justify-center font-sans p-4 md:p-8 overflow-hidden">
			<h1 className="relative z-10 text-4xl md:text-7xl font-sans mt-12 mb-6 md:mb-8 text-gray-100">
				FAQS
			</h1>

			{/* Main Container - Width reduced to max-w-5xl */}
			<div className="relative z-10 w-full max-w-5xl overflow-visible mb-12">
				<style jsx>{`
					/* Button Container */
					.faqs-tab-btn {
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						height: 3.5rem;
						width: 100%;
						cursor: pointer;
						background: transparent;
						border: none;
						outline: none;
						z-index: 10;
					}

					@media (min-width: 768px) {
						.faqs-tab-btn {
							height: 4rem;
						}
					}

					/* Text Styling */
					.faqs-tab-text {
						font-family: var(--font-satoshi), sans-serif;
						font-weight: 500;
						font-size: 1.05rem;
						letter-spacing: 0.025rem;
						color: rgba(255, 255, 255, 0.4);
						position: relative;
						z-index: 20;
						transition: color 0.3s ease;
					}

					.faqs-tab-btn:hover .faqs-tab-text {
						color: rgba(255, 255, 255, 0.8);
					}

					.faqs-tab-btn--active .faqs-tab-text {
						color: #ffffff;
						font-weight: 700;
						text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
					}

					/* --- THE SHAPE LAYER --- */
					.faqs-tab-bg {
						position: absolute;
						inset: 0;
						width: 100%;
						height: 100%;
						z-index: 0;
						opacity: 0;
						background: transparent;
						border-top: 3px solid rgba(255, 255, 255, 0.6);
						border-left: 3px solid rgba(255, 255, 255, 0.3);
						border-right: 3px solid rgba(255, 255, 255, 0.3);
						border-bottom: 3px solid rgba(255, 255, 255, 0.3);

						border-top-left-radius: 12px;
						border-top-right-radius: 12px;
						box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
						transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
						transform-style: preserve-3d;
					}

					.faqs-tab-btn--active .faqs-tab-bg {
						opacity: 1;
					}

					/* --- 3D TRANSFORM VARIANTS --- */
					.bg-left {
						transform-origin: bottom left;
						transform: perspective(1000px) rotateY(35deg) scaleX(1.1);
					}

					.bg-right {
						transform-origin: bottom right;
						transform: perspective(1000px) rotateY(-35deg) scaleX(1.1);
					}

					.bg-middle {
						transform-origin: bottom center;
						transform: perspective(1000px) rotateX(25deg) scale(1.05);
					}
				`}</style>

				{/* Navigation Tabs */}
				<div className="relative flex items-end justify-center px-4 z-20 mb-2 gap-2 md:gap-4">
					{categories.map((tab, index) => {
						const isActive = page === index;
						const isFirst = index === 0;
						const isLast = index === categories.length - 1;

						let bgClass = "bg-middle";
						if (isFirst) bgClass = "bg-middle";
						if (isLast) bgClass = "bg-middle";

						return (
							<button
								key={tab}
								onClick={() => paginate(index)}
								className={`
                  faqs-tab-btn 
                  ${isActive ? "faqs-tab-btn--active" : ""}
                `}
							>
								<div className={`faqs-tab-bg ${bgClass}`} />
								<span className="faqs-tab-text">{tab}</span>
							</button>
						);
					})}
				</div>

				{/* FAQ Content Area */}
				<div className="relative z-10 w-full bg-[#FFFFFF]/11 backdrop-blur-md rounded-3xl border-3 border-white/10 shadow-2xl overflow-hidden min-h-125">
					<div className="absolute bottom-0 -right-30  w-full flex justify-center pointer-events-none z-0">
						<svg
							width="876"
							height="466"
							viewBox="0 0 876 466"
							fill="none"
							className="w-full max-w-200 h-auto opacity-70"
						>
							<g filter="url(#filter0_f_1023_9306)">
								<path
									d="M623.069 82.8187C768.131 92.2899 896.802 324.791 943.005 439.857L975.298 654.069L87.2942 606.402C51.6953 565.588 228.148 455.435 228.148 455.435C228.148 455.435 441.742 70.9797 623.069 82.8187Z"
									fill="url(#paint0_linear_1023_9306)"
									fillOpacity="0.24"
								/>
							</g>
							<defs>
								<filter
									id="filter0_f_1023_9306"
									x="3.05176e-05"
									y="0.000152588"
									width="1057.85"
									height="736.62"
									filterUnits="userSpaceOnUse"
									colorInterpolationFilters="sRGB"
								>
									<feFlood floodOpacity="0" result="BackgroundImageFix" />
									<feBlend
										mode="normal"
										in="SourceGraphic"
										in2="BackgroundImageFix"
										result="shape"
									/>
									<feGaussianBlur
										stdDeviation="41.2753"
										result="effect1_foregroundBlur_1023_9306"
									/>
								</filter>
								<linearGradient
									id="paint0_linear_1023_9306"
									x1="443.321"
									y1="82.951"
									x2="-160.315"
									y2="852.314"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#8CFF84" />
									<stop offset="0.149038" stopColor="#0CAC4F" />
									<stop offset="0.360577" stopColor="#0E7739" />
									<stop offset="1" stopColor="#031400" stopOpacity="0" />
								</linearGradient>
							</defs>
						</svg>
					</div>

					<AnimatePresence initial={false} custom={direction} mode="popLayout">
						<motion.div
							key={page}
							custom={direction}
							variants={sweepVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								x: springConfig,
								opacity: { duration: 0.2 },
							}}
							className="relative z-10 w-full p-4 md:p-5"
						>
							<div className="space-y-4">
								{FAQ_DATA[activeTab].map((item, index) => (
									<motion.div
										layout
										key={index}
										onClick={() =>
											setOpenIndex(openIndex === index ? null : index)
										}
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											...springConfig,
											layout: { ...springConfig },
										}}
										style={{
											// 1. Drop Shadow: 0px 4px 8px 1px rgba(0,0,0,0.25)
											// 2. Depth/Dispersion Simulation: 'inset' shadows create the 3D glass depth effect
											boxShadow:
												"0px 4px 8px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px 0px 20px 0px rgba(255, 255, 255, 0.05)",
										}}
										className={`
    group w-full flex flex-col
    px-3 py-3 md:pl-5 md:pr-2 md:py-2
    bg-white/6 hover:bg-white/10
    backdrop-blur-xs
    border border-white/10 border-t-white/20 border-l-white/20
    rounded-[18px] cursor-pointer
    transition-colors duration-300
    ${openIndex === index ? "bg-white/12 border-white/20 shadow-xl" : ""}
  `}
									>
										{/* Question Header */}
										<motion.div
											layout="position"
											className="flex items-center justify-between w-full"
										>
											<motion.span
												layout="position"
												style={{ originX: 0 }}
												animate={{
													scale: openIndex === index ? 1.1 : 1,
													color:
														openIndex === index
															? "#ffffff"
															: "rgba(243, 244, 246, 1)",
												}}
												transition={{ ...springConfig }}
												className="text-lg md:text-xl font-light font-sans text-left pr-6 leading-tight"
											>
												{item.q}
											</motion.span>

											{/* Button */}
											<motion.div
												layout="position"
												className="shrink-0 flex items-center justify-center"
												style={{
													width: "48px",
													height: "48px",
													borderRadius: "10px",
													border: "3px solid transparent",
													background:
														"radial-gradient(60.5% 60.5% at 50% 50%, rgba(25, 149, 75, 0.73) 59.15%, rgba(12, 172, 79, 0.73) 86.65%) padding-box, linear-gradient(to bottom, #8CFF84 0%, #0EB337 27%, #42D774 79%, #85FFB0 100%) border-box",
													boxShadow: "0px 0px 3px #1A8F4B",
												}}
											>
												<ChevronDown
													size={24}
													className={`text-white drop-shadow-md transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
													strokeWidth={2.5}
												/>
											</motion.div>
										</motion.div>

										{/* Answer Section */}
										<AnimatePresence initial={false}>
											{openIndex === index && (
												<motion.div
													key="content"
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{
														...springConfig,
														opacity: { duration: 0.2 },
													}}
													className="overflow-hidden"
												>
													<p className="pt-4 pb-2 text-lg md:text-xl font-sans text-gray-300 leading-relaxed">
														{item.a}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								))}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default FAQ;
