"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { Copy } from "lucide-react";
import SetupLayout from "../../components/SetupLayout";
import Button from "../../components/CustomButton";

// --- Custom Input ---
const CustomInput = ({ label, placeholder, value, onChange }) => {
	const lineRef = useRef(null);
	return (
		<div className="flex flex-col gap-3 w-full group relative">
			<label className="text-3xl font-bold text-white mb-2">{label}</label>
			<input
				type="text"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				onFocus={() =>
					gsap.to(lineRef.current, {
						scaleX: 1,
						duration: 0.4,
						ease: "power2.out",
					})
				}
				onBlur={() =>
					gsap.to(lineRef.current, {
						scaleX: 0,
						duration: 0.3,
						ease: "power2.in",
					})
				}
				className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-white placeholder:text-white/50 focus:outline-none transition-colors"
			/>
			<div
				ref={lineRef}
				className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 origin-left scale-x-0"
			/>
		</div>
	);
};

// --- Glass Code Card Component ---
const CodeCard = ({ code }) => {
	console.log("CodeCard rendered with code:", code);
	return (
		<div
			className="
                code-card-entry
                w-full md:w-125 h-62.5
                flex flex-col justify-center items-center gap-6
                bg-[#617B5F]/30 backdrop-blur-md
                border border-white/20
                rounded-2xl
                text-center
            "
		>
			<p className="text-2xl text-white/90 font-light">
				Your Shareable Team Code
			</p>
			<div className="flex items-center gap-4">
				<span className="text-4xl font-bold text-white border-b-2 border-white pb-1">
					{code || "Loading..."}
				</span>
				<button
					onClick={() => navigator.clipboard.writeText(code)}
					className="text-white/80 hover:text-white transition-colors"
					disabled={!code}
				>
					<Copy size={28} />
				</button>
			</div>
		</div>
	);
};

export default function CreateTeamPage() {
	const router = useRouter();
	const { status } = useSession();
	const containerRef = useRef(null);

	// State
	const [step, setStep] = useState(1); // 1 = Enter Name, 2 = Show Code
	const [teamName, setTeamName] = useState("");
	const [generatedCode, setGeneratedCode] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState(null);
	const [isCheckingTeam, setIsCheckingTeam] = useState(true);

	// Redirect if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	// Check if user already has a team
	useEffect(() => {
		const checkTeam = async () => {
			if (status !== "authenticated") return;

			try {
				const response = await fetch("/api/users/profile");
				const data = await response.json();

				if (response.ok && data.data?.vitStudent?.teamId) {
					// User already has a team, redirect to dashboard
					router.push("/dashboard");
				} else {
					setIsCheckingTeam(false);
				}
			} catch (error) {
				console.error("Error checking team status:", error);
				setIsCheckingTeam(false);
			}
		};

		checkTeam();
	}, [status, router]);

	// Initial Load Animation
	useEffect(() => {
		if (isCheckingTeam) return;

		const ctx = gsap.context(() => {
			gsap.from(".gsap-entry", {
				y: 50,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
				delay: 0.2,
			});
		}, containerRef);
		return () => ctx.revert();
	}, [isCheckingTeam]);

	// Step 2 Transition Handler
	useEffect(() => {
		if (step === 2) {
			const ctx = gsap.context(() => {
				gsap.fromTo(
					".code-card-entry",
					{ opacity: 0, scale: 0.9, y: 20 },
					{ opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" },
				);
			}, containerRef);
			return () => ctx.revert();
		}
	}, [step]);

	const handleAction = async () => {
		if (step === 1) {
			// Create Team
			if (!teamName.trim()) {
				setError("Please enter a team name");
				return;
			}

			try {
				setIsCreating(true);
				setError(null);

				const response = await fetch("/api/team/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						teamName: teamName.trim(),
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to create team");
				}

				console.log("Team created successfully:", data);
				setGeneratedCode(data.data?.teamCode || data.teamCode);

				// Animate Step 1 Out
				const ctx = gsap.context(() => {
					gsap.to(".step-1-content", {
						opacity: 0,
						x: -20,
						duration: 0.4,
						onComplete: () => setStep(2),
					});
				}, containerRef);
			} catch (err) {
				setError(err.message);
				console.error("Team creation error:", err);
			} finally {
				setIsCreating(false);
			}
		} else {
			// Redirect to dashboard
			router.push("/dashboard");
		}
	};

	if (isCheckingTeam) {
		return (
			<SetupLayout step={3}>
				<div className="flex items-center justify-center h-full">
					<div className="text-white text-xl">Loading...</div>
				</div>
			</SetupLayout>
		);
	}

	return (
		<SetupLayout>
			<div ref={containerRef} className="flex flex-col h-full">
				{/* --- Header --- */}
				<div className="h-[30vh] flex flex-col justify-end pb-10">
					<div className="gsap-entry">
						<h1
							className="text-white font-bold leading-none tracking-tight drop-shadow-2xl"
							style={{ fontSize: "5.5rem" }}
						>
							Hack4U
						</h1>
						<p className="text-4xl text-gray-300 mt-4 font-light drop-shadow-md">
							Let's set things up
						</p>
					</div>
				</div>

				{/* --- Content Area --- */}
				<div className="flex-1 flex flex-col pt-10 relative z-20">
					{/* Step 1: Input Name */}
					{step === 1 && (
						<div className="step-1-content w-full md:w-1/2">
							<div className="gsap-entry">
								<CustomInput
									label="Enter a team name"
									placeholder="Team Alpha"
									value={teamName}
									onChange={(e) => setTeamName(e.target.value)}
								/>
							</div>
							{error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
						</div>
					)}

					{/* Step 2: Show Code Card */}
					{step === 2 && (
						<div className="w-full flex justify-start">
							<CodeCard code={generatedCode} />
						</div>
					)}
				</div>

				{/* --- Footer --- */}
				<div className="gsap-entry h-[20vh] flex items-start pt-6 relative z-10">
					<Button
						size="lg"
						text={
							step === 1
								? isCreating
									? "Creating..."
									: "Generate Code"
								: "End Setup"
						}
						onClick={handleAction}
						disabled={isCreating}
					/>
				</div>
			</div>
		</SetupLayout>
	);
}
