import RuleCard from "./RuleCard";
import TeamCompositionIcon from "@/public/svgs/people_alt.svg";
import FreshCodeIcon from "@/public/svgs/code.svg";
import SubmissionIcon from "@/public/svgs/backup.svg";
import CodeOfConductIcon from "@/public/svgs/new_releases.svg";
import IntellectualPropertyIcon from "@/public/svgs/copyright.svg";
import DemoRequiredIcon from "@/public/svgs/slow_motion_video.svg";

export default function RulesSection() {
  const rules = [
    {
      icon: TeamCompositionIcon.src,
      title: "Team Composition",
      desc: "Teams can consist of 1 to 4 members. Collaboration is key, but ensure every member contributes.",
    },
    {
      icon: FreshCodeIcon.src,
      title: "Fresh Code Policy",
      desc: "All code must be written during the event. Pre-built templates are allowed, but core logic must be new.",
    },
    {
      icon: SubmissionIcon.src,
      title: "Submission",
      desc: "Final projects must be submitted via the platform before the deadline.",
    },
    {
      icon: CodeOfConductIcon.src,
      title: "Code of Conduct",
      desc: "Respect fellow hackers. Harassment or plagiarism will result in immediate disqualification.",
    },
    {
      icon: IntellectualPropertyIcon.src,
      title: "Intellectual Property",
      desc: "You own what you build. The event organizers claim no ownership over your project.",
    },
    {
      icon: DemoRequiredIcon.src,
      title: "Demo Required",
      desc: "Submissions must include a 2–3 minute demo explaining the problem and solution.",
    },
  ];

  return (
    <section className="relative py-16 px-6 overflow-hidden isolate bg-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="
            absolute left-1/2 top-[-50px] md:top-[-80px] -translate-x-1/2 mt-20
            w-[600px] md:w-[1300px] 
            h-[400px] md:h-[800px]
          "
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 60%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 60%)',
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
              filter: 'blur(clamp(20px, 5vw, 40px))',
              opacity: 0.8,
              transform: 'translateZ(0)',
              willChange: 'filter'
            }}
          />
        </div>
      </div>

      <div className="pt-0.5 max-w-6xl mx-auto my-[10vw] text-center">
        <h1 className="text-5xl font-semibold mt-6 text-white">
          Rules of Engagement
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          To ensure a fair and exciting competition, please ensure your team
          adheres to the following guidelines.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {rules.map((rule, i) => (
            <RuleCard key={i} {...rule} 
              disableHoverScale
               />
          ))}
        </div>
      </div>
    </section>
  );
}