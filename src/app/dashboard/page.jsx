"use client";

import React, { useEffect, useState } from "react";
import { Users, LogOut, CheckCircle2, X } from "lucide-react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

// --- Constants & Config ---
import FindTeammates from "../components/FindTeammates";

const REVIEW_SCHEDULE = {
	review1: "2026-02-01T10:00:00",
	review2: "2026-02-10T10:00:00",
	review3: "2026-02-20T10:00:00",
};

const getCurrentReview = () => {
	const now = new Date();
	const review2 = new Date(REVIEW_SCHEDULE.review2);
	const review3 = new Date(REVIEW_SCHEDULE.review3);

	if (now < review2) return 1;
	if (now >= review2 && now < review3) return 2;
	return 3;
};

// --- Reusable UI Components ---

const GlassCard = ({ children, className = "", noPadding = false }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ type: "spring", stiffness: 300, damping: 30 }}
		className={`
      backdrop-blur-md
      border
      border-white/10
      border-t-white/20
      border-l-white/20
      rounded-3xl
      bg-black/20
      overflow-hidden
      ${className}
    `}
		style={{
			boxShadow:
				"0px 4px 8px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px 0px 20px 0px rgba(255, 255, 255, 0.05)",
		}}
	>
		<div
			className={`
    flex flex-col min-h-0
    ${noPadding ? "" : "p-6"}
  `}
		>
			{children}
		</div>
	</motion.div>
);

const AnimatedButton = ({
	onClick,
	disabled,
	className,
	children,
	variant = "primary",
}) => {
	const variants = {
		primary:
			"btn-gradient-border bg-green-600 hover:bg-green-500 text-base font-normal text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-transparent",

		secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
		danger:
			"bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20",
		ghost: "bg-transparent hover:bg-white/5 text-gray-300",
	};

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			disabled={disabled}
			className={`
        relative px-6 py-3 rounded-xl transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
        ${variants[variant]} ${className}
      `}
		>
			{children}
		</motion.button>
	);
};

const AnimatedInput = ({ label, icon, ...props }) => (
	<div className="group">
		{label && (
			<div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
				{label}
			</div>
		)}
		<motion.div
			whileFocus={!props.disabled ? { scale: 1.01 } : {}}
			className="relative"
		>
			{/* Render Iconify Icon if 'icon' prop exists */}
			{icon && (
				<div
					className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${props.disabled ? "text-white/60" : "text-white/40 group-focus-within:text-green-400"} transition-colors duration-200`}
				>
					<Icon icon={icon} width="20" height="20" />
				</div>
			)}

			<input
				{...props}
				className={`
          w-full h-11 rounded-xl text-sm outline-none transition-all duration-200
          border
          ${icon ? "pl-11 pr-4" : "px-4"} 
          ${
						props.disabled
							? "bg-white/5 border-white/5 text-white font-medium cursor-default opacity-100 placeholder:text-transparent"
							: "bg-white/5 hover:bg-white/[0.07] border-white/10 hover:border-white/20 text-gray-100 focus:bg-white/9 focus:border-green-500/50 placeholder:text-white/35"
					}
        `}
			/>
			{!props.disabled && (
				<div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-focus-within:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-shadow duration-300" />
			)}
		</motion.div>
	</div>
);

const AnimatedTextArea = ({ label, style, ...props }) => (
	<div className="group">
		{label && (
			<div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
				{label}
			</div>
		)}
		<motion.div
			whileFocus={!props.disabled ? { scale: 1.01 } : {}}
			className="relative"
		>
			<textarea
				{...props}
				style={style}
				className={`
          w-full h-32 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 resize-none
          border
          ${
						props.disabled
							? "bg-white/5 border-white/5 text-white font-medium cursor-default opacity-100 placeholder:text-transparent"
							: "bg-white/5 hover:bg-white/[0.07] border-white/10 hover:border-white/20 text-gray-100 focus:bg-white/9 focus:border-green-500/50 placeholder:text-white/35"
					}
        `}
			/>
			{!props.disabled && (
				<div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-focus-within:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-shadow duration-300" />
			)}
		</motion.div>
	</div>
);

// --- Main Application ---

export default function App() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// UI State
	const [showProfilePopup, setShowProfilePopup] = useState(false);
	const [currentReview, setCurrentReview] = useState(getCurrentReview);
	const [showQrModal, setShowQrModal] = useState(false);
	const [showResetModal, setShowResetModal] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// Data State
	const [formData, setFormData] = useState({
		track: "",
		title: "",
		github: "",
		figma: "",
		miscLinks: "",
		ppt: "",
		description: "",
		progress: "",
	});
	const [teamData, setTeamData] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [showQrPopup, setShowQrPopup] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState("");
	const [linkCopied, setLinkCopied] = useState(false);
	const [isResetting, setIsResetting] = useState(false);
	const [memberActionLoading, setMemberActionLoading] = useState(false);
	const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState(null);

	// --- Effects ---

	useEffect(() => {
		if (status === "unauthenticated") router.push("/login");
	}, [status, router]);

	useEffect(() => {
		const update = () => setCurrentReview(getCurrentReview());
		update();
		const intervalId = setInterval(update, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const profileRes = await fetch("/api/users/profile");
				if (!profileRes.ok) throw new Error("Failed to fetch profile");
				const profileData = await profileRes.json();

				if (profileData.success && profileData.data) {
					setUserProfile(profileData.data);

					if (profileData.data.vitStudent?.teamId) {
						const teamRes = await fetch("/api/team/get");
						if (!teamRes.ok) throw new Error("Failed to fetch team");
						const teamData = await teamRes.json();

						if (teamData.success && teamData.data) {
							setTeamData(teamData.data);
							setFormData({
								track: teamData.data.track || "",
								title: teamData.data.projectTitle || "",
								github: teamData.data.githubLink || "",
								figma: teamData.data.figmaLink || "",
								miscLinks: teamData.data.otherLinks || "",
								ppt: teamData.data.pptLink || "",
								description: teamData.data.projectDescription || "",
								progress: teamData.data.progressNote || "",
							});

							try {
								const qrRes = await fetch(
									`/api/team/qr?code=${teamData.data.code}`,
								);
								if (qrRes.ok) {
									const qrData = await qrRes.json();
									if (qrData.success && qrData.data?.qrCode)
										setQrCodeUrl(qrData.data.qrCode);
								}
							} catch (qrErr) {
								console.error("Failed to fetch QR code:", qrErr);
							}
						}
					} else {
						setTeamData(null);
						setQrCodeUrl(null);
					}
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		if (session?.user) fetchData();
	}, [session?.user?.email]);

	// --- Handlers ---

	const dashboardData = {
		user: {
			name: userProfile?.name || session?.user?.name || "Participant",
			email:
				userProfile?.email ||
				session?.user?.email ||
				"participant@vitstudent.ac.in",
		},
		team: {
			name: teamData?.name || "No Team",
			id: teamData?.code || "N/A",
			members:
				teamData?.vitStudents?.map((student, index) => {
					const isLeader = teamData.leaderId
						? student.id === teamData.leaderId
						: index === 0;
					return {
						name: student.name || student.user?.name || "Member",
						email: student.user?.email || "Unknown",
						role: isLeader ? "leader" : "member",
					};
				}) || [],
		},
	};

	const isCurrentUserLeader = React.useMemo(() => {
		const me = dashboardData.team.members.find(
			(m) => m.email === (userProfile?.email || session?.user?.email),
		);
		return me?.role === "leader";
	}, [dashboardData.team.members, userProfile?.email, session?.user?.email]);

	const handleRemoveMember = async (memberEmail) => {
		if (!isCurrentUserLeader || !memberEmail) return;
		// Note: Ideally use a custom modal here instead of confirm, but keeping logic as is
		if (!confirm(`Remove ${memberEmail} from the team?`)) return;

		try {
			setMemberActionLoading(true);
			const res = await fetch("/api/team/remove-member", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ memberEmail }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to remove member");

			const teamRes = await fetch("/api/team/get");
			const teamJson = await teamRes.json();
			if (teamRes.ok && teamJson.success && teamJson.data) {
				setTeamData(teamJson.data);
			}

			closeRemoveMemberModal();
		} catch (err) {
			setError(err.message || "Failed to remove member");
			console.error("Remove member error:", err);
			closeRemoveMemberModal();
		} finally {
			setMemberActionLoading(false);
		}
	};

	const openRemoveMemberModal = (member) => {
		if (!isCurrentUserLeader || !member?.email) return;
		setMemberToRemove(member);
		setShowRemoveMemberModal(true);
	};

	const closeRemoveMemberModal = () => {
		setShowRemoveMemberModal(false);
		setMemberToRemove(null);
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!teamData?.id) {
			setError("You must be part of a team to submit");
			return;
		}
		try {
			setIsSubmitting(true);
			setError(null);
			setSuccessMessage(null);

			const response = await fetch("/api/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					teamId: teamData.id,
					projectTitle: formData.title,
					projectDescription: formData.description,
					track: formData.track,
					githubLink: formData.github || null,
					figmaLink: formData.figma || null,
					pptLink: formData.ppt || null,
					otherLinks: formData.miscLinks || null,
					progressNote: formData.progress || null,
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Submission failed");

			setSuccessMessage(data.message || "Submission saved successfully!");
			setIsEditMode(false); // Auto exit edit mode on success
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResetTeam = async () => {
		try {
			setIsResetting(true);
			const response = await fetch("/api/team/leave", { method: "POST" });
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Failed to leave team");
			router.push("/setup/team");
		} catch (err) {
			setError(err.message);
			setShowResetModal(false);
		} finally {
			setIsResetting(false);
		}
	};

	const copyToClipboard = (text, e) => {
		navigator.clipboard.writeText(text);
		const originalValue = e.target.value;
		e.target.value = "Copied!";
		setTimeout(() => {
			e.target.value = originalValue;
		}, 1500);
	};

	useEffect(() => {
		if (dashboardData?.team?.id) {
			// Construct the join URL
			const joinUrl = `http://localhost:3000/setup/join?code=${dashboardData.team.id}`;

			// Generate Data URL
			QRCode.toDataURL(joinUrl, {
				width: 200,
				margin: 2,
				color: {
					dark: "#000000",
					light: "#ffffff",
				},
			})
				.then((url) => {
					setQrCodeUrl(url);
				})
				.catch((err) => {
					console.error("Error generating QR", err);
				});
		}
	}, [dashboardData?.team?.id]);

	// Optional: Close popup when clicking outside (Basic implementation)
	useEffect(() => {
		const handleClickOutside = (event) => {
			// If popup is open and click target is NOT inside the popup container
			if (showQrPopup && !event.target.closest(".qr-popup-container")) {
				setShowQrPopup(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showQrPopup]);

	// --- Loading State ---
	if (status === "loading") {
		return (
			<div className="h-screen flex items-center justify-center bg-[#050705]">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
				/>
			</div>
		);
	}
	if (status === "unauthenticated") return null;

	return (
		<div
			className="h-screen font-sans overflow-hidden relative flex flex-col"
			style={{
				background:
					"radial-gradient(880px 320px at 30% 30%, rgba(34,197,94,0.20), transparent 62%), radial-gradient(760px 320px at 26% 78%, rgba(34,197,94,0.12), transparent 60%), linear-gradient(180deg, #050705, #0b120c)",
			}}
		>
			{/* Floating Team Banner - Bottom Right */}
			<FindTeammates />

			{/* Header */}
			<header className="w-full max-w-350 mx-auto px-6 pt-6 pb-4 shrink-0 z-10">
				<div className="flex items-start justify-between">
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
					>
						<h1 className="text-3xl font-light tracking-tight">
							<span className="text-green-400 font-medium">Hey,</span>{" "}
							<span className="text-white">{dashboardData.user.name}</span>
						</h1>
						<p className="text-gray-400 text-sm mt-1 font-mono tracking-wide opacity-80">
							{dashboardData.team.name}{" "}
							<span className="text-green-500/50 mx-2">//</span>{" "}
							{dashboardData.team.id}
						</p>
					</motion.div>

					<div className="relative">
						{/* Avatar Button - Liquid Glass Style */}
						<motion.button
							onClick={() => setShowProfilePopup(!showProfilePopup)}
							whileHover={{ scale: 1.08, filter: "brightness(1.2)" }}
							whileTap={{ scale: 0.92 }}
							className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 border backdrop-blur-md relative overflow-hidden
                ${
									showProfilePopup
										? "bg-green-500/20 border-green-400/50 text-white shadow-[0_0_20px_rgba(74,222,128,0.3)]"
										: "bg-white/5 border-white/10 border-t-white/20 border-l-white/20 text-gray-300 hover:border-green-500/50"
								}
              `}
						>
							{/* Inner Glow for Avatar when active */}
							{showProfilePopup && (
								<motion.div
									layoutId="avatarGlow"
									className="absolute inset-0 bg-green-400/10 blur-sm"
								/>
							)}
							<span className="relative z-10">
								{(dashboardData.user.name || "U").charAt(0).toUpperCase()}
							</span>
						</motion.button>

						<AnimatePresence>
							{showProfilePopup && (
								<motion.div
									initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: -10 }}
									animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
									exit={{ opacity: 0, y: 15, scale: 0.9, rotateX: -10 }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 22,
									}}
									// transform-gpu for better performance
									className="absolute right-0 top-full mt-4 w-72 rounded-2xl bg-white/3 border border-white/10 border-t-white/20 border-l-white/20 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0px_1px_1px_0px_rgba(255,255,255,0.1)] z-50 backdrop-blur-2xl transform-gpu"
								>
									{/* User Info Header */}
									<div className="px-4 py-4 border-b border-white/5 mb-2 bg-white/2 rounded-t-xl">
										<div className="text-white text-lg font-semibold truncate tracking-tight">
											{dashboardData.user.name}
										</div>
										<div className="text-gray-400 text-sm truncate font-medium opacity-80 mt-0.5">
											{dashboardData.user.email}
										</div>
									</div>

									{/* Menu Items */}
									<div className="space-y-1.5 p-1">
										<motion.button
											whileHover={{
												x: 5,
												backgroundColor: "rgba(255,255,255,0.06)",
											}}
											whileTap={{ scale: 0.98 }}
											onClick={() => router.push("/setup/profile")}
											className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-gray-300 hover:text-white rounded-xl transition-colors text-left group"
										>
											<Icon
												icon="mdi:account-cog-outline"
												width="20"
												className="text-gray-500 group-hover:text-green-400 transition-colors"
											/>
											Update Profile
										</motion.button>

										<motion.button
											whileHover={{
												x: 5,
												backgroundColor: "rgba(239,68,68,0.1)",
											}}
											whileTap={{ scale: 0.98 }}
											onClick={() => signOut({ callbackUrl: "/" })}
											className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-red-400/90 hover:text-red-300 rounded-xl transition-colors text-left group"
										>
											<Icon
												icon="mdi:logout-variant"
												width="20"
												className="text-red-500/50 group-hover:text-red-400 transition-colors"
											/>
											Logout
										</motion.button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</header>

			{/* Main Grid Layout */}
			<div className="flex-1 overflow-hidden w-full max-w-350 mx-auto px-6 pb-6">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 h-full">
					{/* LEFT COLUMN: Main Content */}
					<main className="flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
						{/* Review Timeline Card - Height Reduced */}
						<GlassCard
							noPadding={true}
							className="flex flex-col relative overflow-hidden justify-center min-h-45"
						>
							{/* SVG BACKGROUND - Fixed to Snap & Fill */}
							<div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
								<svg
									width="100%"
									height="100%"
									viewBox="0 0 805 212"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="none"
								>
									<g filter="url(#filter0_f_1751_6224)">
										{/* FIXED: fillOpacity */}
										<ellipse
											cx="371.5"
											cy="-13.5"
											rx="304.5"
											ry="168.5"
											fill="url(#paint0_linear_1751_6224)"
											fillOpacity="0.32"
										/>
									</g>
									<defs>
										{/* FIXED: colorInterpolationFilters */}
										<filter
											id="filter0_f_1751_6224"
											x="-62"
											y="-311"
											width="867"
											height="595"
											filterUnits="userSpaceOnUse"
											colorInterpolationFilters="sRGB"
										>
											{/* FIXED: floodOpacity */}
											<feFlood floodOpacity="0" result="BackgroundImageFix" />
											<feBlend
												mode="normal"
												in="SourceGraphic"
												in2="BackgroundImageFix"
												result="shape"
											/>
											<feGaussianBlur
												stdDeviation="64.5"
												result="effect1_foregroundBlur_1751_6224"
											/>
										</filter>
										<linearGradient
											id="paint0_linear_1751_6224"
											x1="773"
											y1="155"
											x2="421"
											y2="18"
											gradientUnits="userSpaceOnUse"
										>
											{/* FIXED: stopColor */}
											<stop stopColor="#38823E" />
											<stop offset="0.504808" stopColor="#44F553" />
											<stop offset="1" stopColor="#5FD669" />
										</linearGradient>
									</defs>
								</svg>
							</div>

							{/* Reduced Vertical Padding (py-6) */}
							<div className="p-6 py-6 relative z-10">
								<div className="relative">
									{/* --- SEGMENT 1 --- */}
									<div className="absolute top-12 left-[16.666%] w-[33.333%] h-0.75 -translate-y-1/2 z-0">
										<div className="mx-12 h-full bg-white/10 rounded-full" />
										<motion.div
											initial={{ width: "0%" }}
											animate={{ width: currentReview >= 2 ? "100%" : "0%" }}
											transition={{ duration: 1, ease: "circOut" }}
											className="absolute top-0 left-0 h-full bg-green-400 rounded-full mx-12"
											style={{
												boxShadow: "0 0 10px #4ade80, 0 0 20px #22c55e",
											}}
										>
											<motion.div
												animate={{ opacity: [0.3, 1, 0.3] }}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: "linear",
												}}
												className="w-full h-full bg-white blur-[1px]"
											/>
										</motion.div>
									</div>

									{/* --- SEGMENT 2 --- */}
									<div className="absolute top-12 left-[50%] w-[33.333%] h-0.75 -translate-y-1/2 z-0">
										<div className="mx-12 h-full bg-white/10 rounded-full" />
										<motion.div
											initial={{ width: "0%" }}
											animate={{ width: currentReview >= 3 ? "100%" : "0%" }}
											transition={{
												duration: 1,
												ease: "circOut",
												delay: currentReview >= 3 ? 0.2 : 0,
											}}
											className="absolute top-0 left-0 h-full bg-green-400 rounded-full mx-12"
											style={{
												boxShadow: "0 0 10px #4ade80, 0 0 20px #22c55e",
											}}
										>
											<motion.div
												animate={{ opacity: [0.3, 1, 0.3] }}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: "linear",
													delay: 0.5,
												}}
												className="w-full h-full bg-white blur-[1px]"
											/>
										</motion.div>
									</div>

									{/* --- Steps Grid --- */}
									<div className="grid grid-cols-3 relative z-10">
										{[
											{ id: 1, label: "Ideation", sub: "Review 1" },
											{ id: 2, label: "Tech & Design", sub: "Review 2" },
											{ id: 3, label: "Final Polish", sub: "Review 3" },
										].map((step, idx) => {
											const isActive = currentReview >= step.id;
											const isCurrent = currentReview === step.id;

											return (
												<div
													key={step.id}
													className="flex flex-col items-center group cursor-pointer"
												>
													<motion.div
														initial={{ scale: 0.8, opacity: 0 }}
														animate={{ scale: 1, opacity: 1 }}
														whileHover={{
															scale: 1.1,
															filter: "brightness(1.2)",
														}}
														transition={{
															scale: {
																type: "spring",
																stiffness: 400,
																damping: 17,
															},
															opacity: { delay: idx * 0.2, duration: 0.5 },
														}}
														className={`
                              w-24 h-24 rounded-full flex items-center justify-center text-sm font-medium text-center leading-tight transition-colors duration-500 border relative backdrop-blur-md
                              ${
																isActive
																	? "bg-green-500/20 border-green-400/30 border-t-green-300/50 border-l-green-300/50 text-white shadow-[0_0_25px_rgba(34,197,94,0.3),inset_0px_1px_1px_0px_rgba(255,255,255,0.2)]"
																	: "bg-white/5 border-white/10 border-t-white/20 border-l-white/20 text-gray-400 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.1)]"
															}
                            `}
													>
														{isActive && (
															<motion.div
																layoutId="activeGlow"
																className="absolute inset-0 rounded-full bg-green-400/20 blur-md"
															/>
														)}
														<span className="relative z-10">{step.label}</span>
													</motion.div>

													<div
														className={`mt-3 text-xs font-medium tracking-wider uppercase ${isCurrent ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "text-gray-500"}`}
													>
														{step.sub}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</GlassCard>

						{/* Project Submission Card */}
						<GlassCard
							noPadding={true}
							className="flex flex-col h-full relative transform-gpu"
						>
							{/* CSS to hide scrollbar for Chrome, Safari and Opera */}
							<style
								dangerouslySetInnerHTML={{
									__html: `
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `,
								}}
							/>

							{/* Header */}
							<div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 z-10 relative bg-[#0F1210]/30 backdrop-blur-sm border-b border-white/5">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10">
										<Icon
											icon="mdi:file-document-edit-outline"
											width="22"
											className="text-blue-400"
										/>
									</div>
									<h2 className="text-xl font-medium text-white tracking-tight">
										Project Submission
									</h2>
								</div>

								<div className="flex items-center gap-3">
									<AnimatePresence>
										{isEditMode && (
											<motion.div
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: 20 }}
											>
												<AnimatedButton
													onClick={handleSubmit}
													disabled={isSubmitting || !teamData}
													className="h-9 px-4 py-0 text-sm shadow-lg shadow-green-900/20 whitespace-nowrap"
												>
													{isSubmitting ? "Saving..." : "Save Changes"}
												</AnimatedButton>
											</motion.div>
										)}
									</AnimatePresence>

									<AnimatedButton
										variant={isEditMode ? "secondary" : "primary"}
										onClick={() => {
											setIsEditMode(!isEditMode);
											setError(null);
											setSuccessMessage(null);
										}}
										className="h-9 px-4 py-0 text-sm min-w-20"
									>
										{isEditMode ? "Cancel" : "Edit"}
									</AnimatedButton>
								</div>
							</div>

							{/* Status Messages */}
							<AnimatePresence>
								{(error || successMessage) && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										className="flex-shrink-0 px-6 overflow-hidden"
									>
										{error && (
											<div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
												<Icon icon="mdi:alert-circle-outline" size={16} />{" "}
												{error}
											</div>
										)}
										{successMessage && (
											<div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm flex items-center gap-2">
												<Icon icon="mdi:check-circle-outline" size={16} />{" "}
												{successMessage}
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Scroll Container (Scrollbar Hidden) */}
							<div
								className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 pb-6 max-h-137.5"
								style={{
									WebkitOverflowScrolling: "touch",
									willChange: "scroll-position",
									maskImage:
										"linear-gradient(to bottom, black 95%, transparent 100%)",
									transform: "translateZ(0)",
									scrollbarWidth: "none", // For Firefox
									msOverflowStyle: "none", // For IE and Edge
								}}
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
									{/* Left Column */}
									<div className="space-y-5">
										<div>
											<div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 ml-1">
												Track
											</div>
											<div className="relative group">
												<select
													className={`
                            w-full h-11 rounded-xl text-sm outline-none transition-all duration-200 border appearance-none px-4
                            ${
															!isEditMode
																? "bg-white/5 border-white/5 text-white font-medium cursor-default opacity-100"
																: "bg-white/5 hover:bg-white/[0.07] border-white/10 hover:border-white/20 text-gray-100 focus:bg-white/9 focus:border-green-500/50"
														}
                            [&>option]:bg-neutral-900 [&>option]:text-gray-200
                          `}
													value={formData.track}
													onChange={(e) =>
														setFormData((p) => ({
															...p,
															track: e.target.value,
														}))
													}
													disabled={!isEditMode}
												>
													<option value="">Select a track</option>
													<option value="Impact & Sustainability">
														Impact & Sustainability
													</option>
													<option value="Dev Tools & Productivity">
														Dev Tools & Productivity
													</option>
													<option value="AI & Emerging Tech">
														AI & Emerging Tech
													</option>
												</select>
												{isEditMode && (
													<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-focus-within:text-green-400 transition-colors">
														<Icon icon="mdi:chevron-down" width="20" />
													</div>
												)}
											</div>
										</div>

										<AnimatedInput
											label="Project Title"
											value={formData.title}
											onChange={(e) =>
												setFormData((p) => ({ ...p, title: e.target.value }))
											}
											disabled={!isEditMode}
											placeholder="Your project name"
										/>
										<AnimatedTextArea
											label="Progress Update"
											value={formData.progress}
											onChange={(e) =>
												setFormData((p) => ({ ...p, progress: e.target.value }))
											}
											disabled={!isEditMode}
											placeholder="What have you achieved since the last review?"
											style={{ height: "140px" }}
										/>
									</div>

									{/* Right Column */}
									<div className="space-y-5">
										<AnimatedTextArea
											label="Description"
											value={formData.description}
											onChange={(e) =>
												setFormData((p) => ({
													...p,
													description: e.target.value,
												}))
											}
											disabled={!isEditMode}
											placeholder="Briefly describe what you're building..."
											style={{ height: "120px" }}
										/>

										<div>
											<div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">
												Project Links
											</div>
											<div className="grid grid-cols-2 gap-3">
												<AnimatedInput
													icon="mdi:github"
													value={formData.github}
													onChange={(e) =>
														setFormData((p) => ({
															...p,
															github: e.target.value,
														}))
													}
													disabled={!isEditMode}
													placeholder="GitHub"
												/>
												<AnimatedInput
													icon="ion:logo-figma"
													value={formData.figma}
													onChange={(e) =>
														setFormData((p) => ({
															...p,
															figma: e.target.value,
														}))
													}
													disabled={!isEditMode}
													placeholder="Figma"
												/>
												<AnimatedInput
													icon="mdi:presentation-play"
													value={formData.ppt}
													onChange={(e) =>
														setFormData((p) => ({ ...p, ppt: e.target.value }))
													}
													disabled={!isEditMode}
													placeholder="Slides"
												/>
												<AnimatedInput
													icon="mdi:link-variant"
													value={formData.miscLinks}
													onChange={(e) =>
														setFormData((p) => ({
															...p,
															miscLinks: e.target.value,
														}))
													}
													disabled={!isEditMode}
													placeholder="Other"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</GlassCard>
					</main>

					{/* RIGHT COLUMN: Sidebar */}
					<aside className="flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
						{/* Team Members */}
						{/* Team Squad Card - Merged Backend Logic with Liquid Glass Frontend */}
						<GlassCard
							noPadding={true}
							className="flex flex-col relative h-full transform-gpu"
						>
							{/* Header: Font Size UNTOUCHED (text-xl) */}
							<div className="shrink-0 flex items-center gap-3 p-6 pb-2 z-10 relative">
								<div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/10">
									<Icon
										icon="mdi:account-group-outline"
										width="22"
										className="text-purple-400"
									/>
								</div>
								<h2 className="text-xl font-medium text-white tracking-tight">
									Team Squad
								</h2>
							</div>

							{/* Scroll Container */}
							<div
								className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-5 max-h-70"
								style={{
									WebkitOverflowScrolling: "touch",
									willChange: "scroll-position",
									maskImage:
										"linear-gradient(to bottom, black 85%, transparent 100%)",
									transform: "translateZ(0)",
								}}
							>
								{isLoading ? (
									/* Loading State from Frontend */
									<div className="py-8 flex flex-col items-center justify-center text-center opacity-60">
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: "linear",
											}}
											className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full mb-3"
										/>
										<div className="text-sm font-medium tracking-wide text-purple-200/70">
											Loading...
										</div>
									</div>
								) : dashboardData?.team?.members?.length > 0 ? (
									<div className="space-y-2 pb-2 pt-2">
										<AnimatePresence initial={false} mode="popLayout">
											{dashboardData.team.members.map((member, idx) => (
												<motion.div
													key={member.email || idx}
													layout="position"
													initial={{ opacity: 0, x: -10, scale: 0.98 }}
													animate={{ opacity: 1, x: 0, scale: 1 }}
													exit={{
														opacity: 0,
														scale: 0.95,
														transition: { duration: 0.15 },
													}}
													className="group relative flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors"
													style={{ transform: "translateZ(0)" }}
												>
													<div className="min-w-0 pr-3">
														{/* UPDATED: text-base (16px) */}
														<div className="text-gray-100 text-base font-medium truncate tracking-tight">
															{member.name}
														</div>
														{/* UPDATED: text-sm */}
														<div className="text-gray-500 text-sm truncate font-mono mt-0.5">
															{member.email}
														</div>
													</div>

													<div className="shrink-0">
														{member.role === "leader" ? (
															/* UPDATED: Lead Badge text-xs */
															<div className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
																Lead
															</div>
														) : (
															isCurrentUserLeader && (
																/* Remove Member Logic from Backend attached to Frontend Button */
																<motion.button
																	whileHover={{
																		scale: 1.1,
																		backgroundColor: "rgba(239, 68, 68, 0.2)",
																	}}
																	whileTap={{ scale: 0.9 }}
																	onClick={() =>
																		openRemoveMemberModal
																			? openRemoveMemberModal(member)
																			: handleRemoveMember(member.email)
																	}
																	disabled={memberActionLoading}
																	className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
																>
																	{memberActionLoading ? (
																		<Icon
																			icon="mdi:loading"
																			className="animate-spin"
																			width="16"
																		/>
																	) : (
																		<Icon icon="mdi:close" width="18" />
																	)}
																</motion.button>
															)
														)}
													</div>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								) : (
									/* Empty State from Frontend */
									<div className="flex flex-col items-center justify-center py-8">
										<p className="text-gray-300 text-lg font-medium mb-1">
											No Team Yet
										</p>
										<p className="text-gray-500 text-sm mb-5 text-center">
											Join a squad to compete.
										</p>
										<AnimatedButton
											onClick={() => router.push("/setup/team")}
											className="h-10 px-8 w-auto text-sm font-medium shadow-lg shadow-green-900/10"
										>
											Join / Create
										</AnimatedButton>
									</div>
								)}
							</div>

							{/* Footer: Frontend Layout & Styling */}
							{dashboardData?.team?.members?.length > 0 && (
								<div className="shrink-0 px-5 pb-5 pt-2 z-10 relative">
									<div className="pt-3 border-t border-white/5 flex justify-center">
										<AnimatedButton
											variant="danger"
											className="h-9 px-8 w-auto text-sm font-medium"
											onClick={() => setShowResetModal(true)}
										>
											Leave Team
										</AnimatedButton>
									</div>
								</div>
							)}
						</GlassCard>

						{/* Invites Card - Fixed QR Popup Positioning */}
						<GlassCard
							noPadding={true}
							className="w-full p-6 shrink-0 flex flex-col items-center justify-center relative overflow-visible"
						>
							<div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 text-center w-full">
								Team Code
							</div>

							<div className="grid grid-cols-2 gap-3 w-40">
								{/* --- ROW 1: Team Code --- */}
								<div
									className="col-span-2 relative group cursor-pointer"
									onClick={(e) => copyToClipboard(dashboardData.team.id, e)}
								>
									<AnimatedInput
										value={dashboardData.team.id}
										readOnly
										className="cursor-pointer selection:bg-transparent font-mono text-xl font-bold tracking-widest text-center px-2 h-12"
									/>
								</div>

								{/* --- ROW 2: Icon Buttons --- */}

								{/* 1. Copy Link */}
								<div
									onClick={(e) => {
										if (teamData) {
											copyToClipboard(
												`http://localhost:3000/setup/join?code=${dashboardData.team.id}`,
												e,
											);
											setLinkCopied(true);
											setTimeout(() => setLinkCopied(false), 2000);
										}
									}}
									className={`aspect-square border rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 group
                    ${
											linkCopied
												? "bg-green-500/10 border-green-500/20"
												: "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
										}`}
									title="Copy Invite Link"
								>
									<AnimatePresence mode="wait">
										{linkCopied ? (
											<motion.div
												key="check"
												initial={{ scale: 0.5, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0.5, opacity: 0 }}
											>
												<Icon
													icon="mdi:check"
													width="24"
													className="text-green-400"
												/>
											</motion.div>
										) : (
											<motion.div
												key="link"
												initial={{ scale: 0.5, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												exit={{ scale: 0.5, opacity: 0 }}
											>
												<Icon
													icon="mdi:link-variant"
													width="24"
													className="text-gray-400 group-hover:text-white transition-colors"
												/>
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* 2. Show QR */}
								<div className="relative qr-popup-container aspect-square">
									<div
										onClick={() => setShowQrPopup(!showQrPopup)}
										className={`w-full h-full border rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 group
                      ${
												showQrPopup
													? "bg-white/20 border-white/20"
													: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
											}`}
										title="Show QR Code"
									>
										<Icon
											icon="mdi:qrcode-scan"
											width="24"
											className={`transition-colors ${showQrPopup ? "text-white" : "text-gray-400 group-hover:text-white"}`}
										/>
									</div>

									{/* QR Popup - Repositioned to show ABOVE */}
									<AnimatePresence>
										{showQrPopup && (
											<motion.div
												// y: -10 moves it upward during animation
												initial={{ opacity: 0, scale: 0.95, y: -10 }}
												animate={{ opacity: 1, scale: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95, y: -10 }}
												transition={{ duration: 0.2 }}
												// bottom-full and mb-2 pushes it above the button
												// right-0 ensures it stays within the sidebar width
												className="absolute bottom-full right-0 mb-3 w-48 p-2 bg-[#1A1D1A] border border-white/10 rounded-2xl shadow-2xl z-50 backdrop-blur-xl origin-bottom-right"
											>
												<div className="bg-white p-2 rounded-xl w-full aspect-square flex items-center justify-center overflow-hidden">
													{qrCodeUrl ? (
														<img
															src={qrCodeUrl}
															alt="QR Code"
															className="w-full h-full object-contain"
														/>
													) : (
														<div className="flex items-center justify-center text-black/20">
															<Icon
																icon="mdi:loading"
																width="32"
																className="animate-spin"
															/>
														</div>
													)}
												</div>
												<div className="text-center py-2">
													<span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
														Scan to Join
													</span>
												</div>
												{/* Triangle tip (optional, for that speech bubble look) */}
												<div className="absolute top-full right-5 -mt-1 border-8 border-transparent border-t-[#1A1D1A] w-0 h-0" />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</GlassCard>
					</aside>
				</div>
			</div>

			{/* --- Modals --- */}

			{/* QR Modal */}
			<AnimatePresence>
				{showQrModal && qrCodeUrl && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
						onClick={() => setShowQrModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className="bg-white p-6 rounded-3xl relative max-w-sm w-full shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								onClick={() => setShowQrModal(false)}
								className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors"
							>
								<X size={32} />
							</button>
							<img
								src={qrCodeUrl}
								alt="Team QR"
								className="w-full aspect-square object-contain"
							/>
							<div className="mt-6 text-center">
								<div className="text-3xl font-mono font-bold tracking-widest text-black mb-2">
									{dashboardData.team.id}
								</div>
								<p className="text-gray-500 text-sm">Scan to join team</p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Leave Team Warning Modal */}
			<AnimatePresence>
				{showResetModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
						onClick={() => !isResetting && setShowResetModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className="w-full max-w-md bg-[#0F1210]/90 border border-white/10 border-t-white/20 border-l-white/20 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_50px_rgba(220,38,38,0.15)] backdrop-blur-2xl relative overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Visual Red Glow for Warning */}
							<div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full" />

							<div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 mx-auto relative z-10">
								<Icon
									icon="mdi:logout-variant"
									width="32"
									className="text-red-500"
								/>
							</div>

							<h3 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
								Leave Team?
							</h3>
							<p className="text-gray-400 text-center mb-8 leading-relaxed text-[15px]">
								This action is{" "}
								<span className="text-red-400 font-semibold">irreversible</span>
								. You will lose access to team submissions and need to rejoin
								manually via code.
							</p>

							<div className="flex gap-4 relative z-10">
								<AnimatedButton
									variant="secondary"
									className="flex-1 py-3 h-12 rounded-2xl"
									onClick={() => setShowResetModal(false)}
									disabled={isResetting}
								>
									Cancel
								</AnimatedButton>
								<AnimatedButton
									variant="danger"
									className="flex-1 py-3 h-12 rounded-2xl bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-900/20"
									onClick={handleResetTeam}
									disabled={isResetting}
								>
									{isResetting ? "Leaving..." : "Confirm Leave"}
								</AnimatedButton>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Remove Member Warning Modal */}
			<AnimatePresence>
				{showRemoveMemberModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
						onClick={() => !memberActionLoading && closeRemoveMemberModal()}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className="w-full max-w-md bg-[#0F1210]/90 border border-white/10 border-t-white/20 border-l-white/20 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_50px_rgba(220,38,38,0.15)] backdrop-blur-2xl relative overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Alert Icon & Heading */}
							<div className="flex items-center gap-4 mb-6 relative z-10">
								<div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
									<Icon
										icon="mdi:alert-decagram-outline"
										width="28"
										className="text-red-500"
									/>
								</div>
								<div>
									<h3 className="text-2xl font-bold text-white tracking-tight">
										Warning!
									</h3>
									<p className="text-red-400 text-sm font-semibold uppercase tracking-wider">
										Irreversible Action
									</p>
								</div>
							</div>

							<div className="mb-8 space-y-4 relative z-10">
								<p className="text-gray-300 text-[15px] leading-relaxed">
									You are about to remove{" "}
									<span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
										{memberToRemove?.email || "this member"}
									</span>
									. This will:
								</p>
								<ul className="space-y-3">
									{[
										"Remove the member immediately",
										"Revoke access to team submissions",
										"Require them to join another team",
									].map((text, i) => (
										<li
											key={i}
											className="flex items-center gap-3 text-sm text-gray-400"
										>
											<div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
											{text}
										</li>
									))}
								</ul>
							</div>

							<div className="flex gap-4 relative z-10">
								<AnimatedButton
									variant="secondary"
									className="flex-1 py-3 h-12 rounded-2xl"
									onClick={closeRemoveMemberModal}
									disabled={memberActionLoading}
								>
									Cancel
								</AnimatedButton>
								<AnimatedButton
									variant="danger"
									className="flex-1 py-3 h-12 rounded-2xl bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-900/20"
									onClick={() => handleRemoveMember(memberToRemove?.email)}
									disabled={memberActionLoading}
								>
									{memberActionLoading ? "Removing..." : "Remove Member"}
								</AnimatedButton>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
