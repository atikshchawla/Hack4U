"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { Suspense } from "react";
import SetupLayout from "../../components/SetupLayout";
import CustomButton from "../../components/CustomButton";
import Hack4uHeader from "@/app/components/Hack4uHeader";

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

function JoinTeamContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { status } = useSession();
	const containerRef = useRef(null);
	const stripRef = useRef(null);
	const [teamCode, setTeamCode] = useState("");
	const [isJoining, setIsJoining] = useState(false);
	const [error, setError] = useState("");

	// Initialize team code from URL
	useEffect(() => {
		const codeFromUrl = searchParams.get("code");
		if (codeFromUrl) {
			setTeamCode(codeFromUrl);
		}
	}, [searchParams]);

	// Redirect if not authenticated
	useEffect(() => {
		if (status === "unauthenticated") {
			const callbackUrl = encodeURIComponent(window.location.href);
			router.push(`/login?callbackUrl=${callbackUrl}`);
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
				}
			} catch (error) {
				console.error("Error checking team status:", error);
			}
		};

		checkTeam();
	}, [status, router]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".gsap-entry", {
				y: 50,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
				delay: 0.2,
			});
			if (stripRef.current) {
				gsap.to(stripRef.current, {
					yPercent: -66.66,
					duration: 2.5,
					ease: "power3.inOut",
					delay: 0.2,
				});
			}
		}, containerRef);
		return () => ctx.revert();
	}, []);

	const handleJoin = async () => {
		const trimmedCode = teamCode.trim();
		if (!trimmedCode) {
			setError("Please enter a team code");
			return;
		}

		try {
			setIsJoining(true);
			setError("");

			const response = await fetch("/api/team/join", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ teamCode: trimmedCode }),
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 404) {
					setError("Invalid team code. Please check and try again.");
				} else if (data?.message) {
					setError(data.message);
				} else {
					setError("Failed to join team. Please try again.");
				}
				return;
			}

			// Successfully joined team, go to dashboard
			router.push("/dashboard");
		} catch (err) {
			console.error("Join team error:", err);
		} finally {
			setIsJoining(false);
		}
	};

	return (
		<SetupLayout>
			<div className="h-[30vh] flex flex-col justify-end pb-10">
				<div className="gsap-entry flex items-end">
					<Hack4uHeader />
				</div>
			</div>
			<div ref={containerRef} className="flex flex-col h-full">
				<div className="flex-1 flex flex-col gap-8 pt-10 relative z-20">
					<div className="gsap-entry w-full md:w-1/2">
						<CustomInput
							label="Enter a team code"
							placeholder="uxD34a"
							value={teamCode}
							onChange={(e) => setTeamCode(e.target.value)}
						/>
						{error && <p className="mt-4 text-sm text-red-400">{error}</p>}
					</div>
				</div>

				<div className="gsap-entry h-[20vh] flex items-start pt-6 relative z-10">
					<CustomButton
						size="lg"
						text={isJoining ? "Joining..." : "Join Team"}
						onClick={handleJoin}
						disabled={isJoining}
					/>
				</div>
			</div>
		</SetupLayout>
	);
}

export default function JoinTeamPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<JoinTeamContent />
		</Suspense>
	);
}
