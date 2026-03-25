"use client";

import CardsRow from "./components/CardsRow";
import FAQ from "./components/FAQ";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhoAreWe from "./components/WhoAreWe";
import Footer from "./components/Footer";
import RulesSection from "./components/RulesSection.jsx";
import GuidlinesSection from "./components/Guidelines.jsx";
import Tracks from "./components/Tracks.jsx";
import FindTeammates from "./components/FindTeammates";

export default function Home() {
	return (
		<main className="bg-[#040704]">
			<Navbar />

			{/* Home Section */}
			<section id="home">
				<Hero />
			</section>

			{/* About Section */}
			<section id="about">
				<WhoAreWe />
			</section>

			{/* Timeline Section */}
			<section id="timeline" className="relative overflow-visible">
				<CardsRow />
			</section>

			{/* FAQ Section */}
			<section
				id="faq"
				className="relative overflow-hidden bg-[#040704] z-10"
				style={{ marginTop: "-10px" }}
			>
				<RulesSection />
				<GuidlinesSection />
				<Tracks />
				<FAQ />
				<Footer />
			</section>

			<FindTeammates />
		</main>
	);
}
