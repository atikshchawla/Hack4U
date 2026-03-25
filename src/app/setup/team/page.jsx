"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { Plus, Link2 } from "lucide-react";
import SetupLayout from "../../components/SetupLayout";
import Button from "../../components/CustomButton";
import Hack4uHeader from "@/app/components/Hack4uHeader";

const TeamOptionCard = ({
	icon: Icon,
	title,
	description,
	selected,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			style={{
				boxShadow:
					"0px 4px 8px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px 0px 20px 0px rgba(255, 255, 255, 0.05)",
			}}
			className={`
        cursor-pointer
        w-full md:w-72 h-72
        flex flex-col items-center justify-center gap-6

        backdrop-blur-xs
        border
        border-white/10
        border-t-white/20
        border-l-white/20

        bg-[#1a3a1a]/60 hover:bg-[#1a3a1a]/80
        border-2 transition-all duration-300
        rounded-2xl p-8 text-center

        ${selected ? "border-green-400 bg-[#1a3a1a]/80" : "border-white/20 hover:border-white/40"}
      `}
		>
			<div
				className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${selected ? "bg-green-400" : "bg-white"}
          transition-colors duration-300
        `}
			>
				<Icon className="w-8 h-8 text-black" />
			</div>

			<h3 className="text-2xl font-bold text-white">{title}</h3>

			<p className="text-gray-300 text-base leading-relaxed">{description}</p>
		</div>
	);
};

export default function TeamPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const containerRef = useRef(null);
	const stripRef = useRef(null);
	const [selectedOption, setSelectedOption] = useState(null);
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

	// --- ANIMATIONS ---
	useEffect(() => {
		// Only run when the loading screen is gone and DOM is ready
		if (status === "loading" || isCheckingTeam) return;

		const ctx = gsap.context(() => {
			// 1. Entry Animations (Fade In)
			gsap.from(".gsap-entry", {
				y: 50,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
			});

			// 2. Card Animations
			gsap.from(".team-card", {
				y: 30,
				opacity: 0,
				duration: 0.8,
				stagger: 0.2,
				ease: "power3.out",
				delay: 0.2,
			});

			// 3. LOGO ROLL (Fixed: Immediate & Robust)
			// We use fromTo to guarantee it starts at 0 and rolls to the end immediately
			if (stripRef.current) {
				gsap.fromTo(
					stripRef.current,
					{ yPercent: 0 }, // Force start at '1'
					{
						yPercent: -66.66, // Rolls to '3'
						duration: 2.5,
						ease: "power2.inOut", // Smooth mechanical roll
						delay: 0, // No delay, starts immediately
					},
				);
			}
		}, containerRef);

		return () => ctx.revert();
	}, [status, isCheckingTeam]);

	const handleNextStep = () => {
		if (selectedOption === "create") {
			router.push("/setup/create");
		} else if (selectedOption === "join") {
			router.push("/setup/join");
		}
	};

	if (status === "loading" || isCheckingTeam) {
		return (
			<SetupLayout>
				<div className="flex items-center justify-center h-full">
					<div className="text-white text-xl">Loading...</div>
				</div>
			</SetupLayout>
		);
	}

	return (
		<SetupLayout>
			{/* Header */}
			<div className="h-[30vh] flex flex-col justify-end pb-10">
				<div className="gsap-entry flex items-end">
					<Hack4uHeader />
				</div>
			</div>
			<div ref={containerRef} className="flex flex-col h-full">
				{/* Team Options */}
				<div className="flex-1 flex flex-col items-start pt-10 relative z-20">
					<div className="flex flex-col md:flex-row gap-6 mb-8">
						<div className="team-card">
							<TeamOptionCard
								icon={Plus}
								title="Create a team"
								description="Start a new team and invite your friends to join the hackathon adventure"
								selected={selectedOption === "create"}
								onClick={() => setSelectedOption("create")}
							/>
						</div>

						<div className="team-card">
							<TeamOptionCard
								icon={Link2}
								title="Join a team"
								description="Already have a team code? Join your friends and start building together"
								selected={selectedOption === "join"}
								onClick={() => setSelectedOption("join")}
							/>
						</div>
					</div>
				</div>

				{/* Footer Button */}
				<div className="gsap-entry h-[20vh] flex items-start pt-6 relative z-10">
					<Button
						size="lg"
						text="Next Step"
						onClick={handleNextStep}
						disabled={!selectedOption}
					/>
				</div>
			</div>
		</SetupLayout>
	);
}
