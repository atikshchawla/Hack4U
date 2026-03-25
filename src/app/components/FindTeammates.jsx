import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const FindTeammates = () => {
	return (
		<motion.a
			href="/setup/team"
			// Entrance Animation (No loop)
			initial={{ opacity: 0, y: 20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
			}}
			// Interactive States
			whileHover={{
				scale: 1.05,
				y: -4,
				transition: { type: "spring", stiffness: 400, damping: 10 },
			}}
			whileTap={{ scale: 0.96 }}
			className="fixed bottom-8 right-8 z-50 group"
		>
			<div
				className={`
          flex items-center gap-3 px-6 py-3.5 rounded-full 
          backdrop-blur-xl border border-white/10
          border-t-white/20 border-l-white/20
          shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0px_1px_1px_0px_rgba(255,255,255,0.1)]
          transition-all duration-300
          hover:border-green-400/50 hover:shadow-green-500/20
        `}
				style={{
					background:
						"linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
				}}
			>
				{/* Subtle Glow Background */}
				<div className="absolute inset-0 rounded-full bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

				{/* Icon Container */}
				<motion.div
					whileHover={{ rotate: [-10, 10, 0] }}
					className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 relative z-10"
				>
					<Icon
						icon="heroicons:user-group-20-solid"
						width="22"
						className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
					/>
				</motion.div>

				{/* Text Content */}
				<div className="flex flex-col relative z-10">
					<span className="text-white text-[15px] font-semibold tracking-tight leading-none">
						Find Teammates
					</span>
					<span className="text-green-400/60 text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 leading-none group-hover:text-green-400 transition-colors">
						Team Matching Hub
					</span>
				</div>

				{/* Micro-detail Arrow */}
				<Icon
					icon="heroicons:arrow-up-right-20-solid"
					width="14"
					className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ml-1"
				/>
			</div>
		</motion.a>
	);
};

export default FindTeammates;
