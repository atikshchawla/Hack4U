"use client";

export default function Guidelines() {
	return (
		<section className="relative w-full bg-black flex items-center justify-center px-6 py-12 overflow-hidden">
			<div
				className="
          absolute 
          bottom-10 
          left-10 
          w-[500px] 
          h-[500px] 
          pointer-events-none 
          -z-10
        "
				style={{
					background: `radial-gradient(circle at center, #8CFF84 0%, #0CAC4F 30%, transparent 70%)`,
					filter: "blur(80px)",
					opacity: 0.5,
				}}
			/>

			{/* a container div to hold shit */}
			<div className="relative w-full max-w-5xl">
				<div className="rounded-2xl bg-[linear-gradient(90deg,#8CFF84,#0EB337,#42D774,#85FFB0)]  relative">
					{/* Mobile button */}
					<button
						className="
                md:hidden
                absolute top-0 right-0
                py-7
                text-white font-semibold
                bg-[linear-gradient(#19954B,#0CAC4F)]
                backdrop-blur-md
                border border-green-300/30
                shadow-[0_6px_30px_rgba(34,197,94,0.45)]
                hover:shadow-[0_0_40px_rgba(34,197,94,0.9)]
                transition-all
                rounded-2xl
                w-20
              "
						style={{
							clipPath: "polygon(0% 0, 100% 0, 100% 100%, 29.5% 100%, 0.8% 0%)",
						}}
					>
						...
					</button>

					{/* Desktop button */}
					<button
						className="
              hidden md:block
              absolute -top-1 right-0
              pl-16 pr-0 py-3
              text-white font-semibold
              bg-[linear-gradient(#19954B,#0CAC4F)]
              backdrop-blur-md
              border border-green-300/30
              shadow-[0_6px_30px_rgba(34,197,94,0.45)]
              hover:shadow-[0_0_40px_rgba(34,197,94,0.9)]
              transition-all
              rounded-2xl
              w-69
            "
						style={{
							clipPath: "polygon(0% 0, 100% 0, 100% 100%, 29.5% 100%, 0.8% 0%)",
						}}
					>
						Explore Tracks
					</button>
				</div>

				<div
					className="
            relative
            text-white
            p-10
            rounded-3xl
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            shadow-2xl
            w-full
          "
					style={{
						clipPath:
							"polygon(0 0, 72% 0, 80% 14%, 100% 14%, 100% 100%, 0 100%)",
					}}
				>
					<h2 className="text-3xl font-semibold mb-6 text-white/90">
						What are the <br /> Guidelines for Hack4u
					</h2>

					<ol className="space-y-4 text-white/70 leading-relaxed list-decimal list-inside">
						<li>
							Hack4u is committed to fostering an inclusive environment.
							Everyone who wants to participate is welcome. All submissions will
							be evaluated fairly and without bias.
						</li>

						<li>
							If you witness any incident that violates community standards,
							please reach out to the organizing team. Core team members can be
							identified by their badges.
						</li>

						<li>
							Reports are treated confidentially, and appropriate action will
							follow confirmed incidents.
						</li>

						<li>
							Remote participants can contact organizers through our community
							channels — they will carry clear organizer identifiers.
						</li>

						<li>
							TL;DR: Be respectful to everyone involved. If conduct slips,
							contact the organizing team immediately.
						</li>
					</ol>
				</div>
			</div>
		</section>
	);
}
