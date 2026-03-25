import RuleCard from "./RuleCard";
import TeamCompositionIcon from "@/public/svgs/people_alt.svg";
import FreshCodeIcon from "@/public/svgs/code.svg";
import SubmissionIcon from "@/public/svgs/backup.svg";

export default function RulesSection() {
	const rules = [
		{
			icon: TeamCompositionIcon.src,
			title: "Impact & Sustainability: Build What Matters",
			desc: "Build solutions for real-world challenges in sustainability, healthcare, governance, accessibility, and social impact. Turn strong ideas into meaningful outcomes.",
		},
		{
			icon: FreshCodeIcon.src,
			title: "Dev Tools & Productivity: Build for Builders",
			desc: "Create tools, platforms, workflows, or integrations that help developers and teams ship faster, collaborate better, and build with confidence.",
		},
		{
			icon: SubmissionIcon.src,
			title: "AI & Emerging Tech: Build the Future",
			desc: "Use AI and other emerging technologies to create intelligent apps, assistants, automation systems, and creative products that solve practical problems.",
		},
	];

	return (
		<section
			id="tracks"
			className="relative pt-24 pb-20 px-6 overflow-hidden isolate bg-black"
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
				<div
					className="
            absolute left-1/2 top-[-50px] md:top-[-80px] -translate-x-1/2 mt-20
            w-[600px] md:w-[1300px] 
            h-[400px] md:h-[800px]
          "
					style={{
						WebkitMaskImage:
							"linear-gradient(to bottom, black 0%, black 40%, transparent 60%)",
						maskImage:
							"linear-gradient(to bottom, black 0%, black 40%, transparent 60%)",
					}}
				>
					<div
						className="w-full h-full"
						style={{
							background: `radial-gradient(ellipse at 50% 50%, 
                transparent 40%, 
                #8CFF84 52%, 
                #0E773999 45%, 
                #0CAC4F 50%, 
                transparent 65%
              )`,
							filter: "blur(clamp(20px, 5vw, 40px))",
							opacity: 0.8,
							transform: "translateZ(0)",
							willChange: "filter",
						}}
					/>
				</div>
			</div>
			<div className="max-w-6xl mx-auto text-center">
				<h1 className="text-5xl font-semibold mt-[10vw] text-white pt-2">
					Tracks
				</h1>

				<p className="text-gray-400 mt-4 max-w-2xl mx-auto">
					You can choose any of these tracks to compete in.
				</p>

				<div className="group/grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-12 max-w-6xl mx-auto justify-items-center">
					{rules.map((rule, i) => (
						<div
							key={i}
							className="
                group/card
                relative w-full max-w-[420px] md:max-w-[480px]
                transition-all duration-300 ease-out
                group-hover/grid:[&:not(:hover)]:blur-[2px]
                group-hover/grid:[&:not(:hover)]:opacity-80
                hover:blur-0 hover:opacity-100 hover:scale-[1.1]
                before:pointer-events-none before:absolute before:inset-[-10px]
                before:rounded-[28px] before:opacity-0 before:transition-opacity before:duration-300
                group-hover/grid:[&:not(:hover)]:before:opacity-70 hover:before:opacity-0
                before:blur-[18px] before:bg-[radial-gradient(circle_at_50%_30%,rgba(12,172,79,0.35),transparent_70%)]
              "
						>
							<RuleCard
								{...rule}
								height="clamp(300px, 32vw, 380px)"
								viewBoxHeight={360}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
