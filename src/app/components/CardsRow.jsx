"use client";

import { useState, useRef, useEffect } from "react";
import Card from "./Card";

export default function CardsRow() {
  const cards = [
    {
      index: 1,
      title: "Check-in & Setup",
      date: "Day 1",
      time: "08:00 AM – 09:00 AM",
      description: "Teams arrive, verify registration, setup workspaces.",
      image: "/images/image1.png",
    },
    {
      index: 2,
      title: "Introduction",
      date: "Day 1",
      time: "09:00 AM – 09:30 AM",
      description: "Welcome, event overview, rules, and format.",
      image: "/images/image2.png",
    },
    {
      index: 3,
      title: "Breaking Phase",
      date: "Day 1",
      time: "09:30 AM – 12:30 PM",
      description: "Teams begin work on their projects.",
      image: "/images/image3.png",
    },
    {
      index: 4,
      title: "Lunch Break",
      date: "Day 1",
      time: "12:30 PM – 02:00 PM",
      description: "Lunch break for all participants.",
      image: "/images/image4.png",
    },
    {
      index: 5,
      title: "Building Phase 1",
      date: "Day 1",
      time: "02:00 PM – 05:00 PM",
      description: "Teams continue building their projects.",
      image: "/images/image5.png",
    },
    {
      index: 6,
      title: "Review 1",
      date: "Day 1",
      time: "05:00 PM – 07:00 PM",
      description: "First project review and feedback.",
      image: "/images/image6.png",
    },
    {
      index: 7,
      title: "Dinner Break",
      date: "Day 1",
      time: "07:00 PM – 09:00 PM",
      description: "Dinner break for all participants.",
      image: "/images/image7.png",
    },
    {
      index: 8,
      title: "Night Build Sprint 1",
      date: "Day 1",
      time: "09:00 PM – 12:00 AM",
      description: "Teams continue building into the night.",
      image: "/images/image8.png",
    },
    { index: 9, text: "End of Day 1...", isEnd: true },
    {
      index: 10,
      title: "Jamming, Coffee Pong & Mini Games",
      date: "Day 2",
      time: "12:00 AM – 01:00 AM",
      description: "Fun activities to recharge and bond.",
      image: "/images/image9.png",
    },
    {
      index: 11,
      title: "Night Build Sprint 2",
      date: "Day 2",
      time: "01:00 AM – 03:00 AM",
      description: "Second night sprint for project work.",
      image: "/images/image10.png",
    },
    {
      index: 12,
      title: "Review 2",
      date: "Day 2",
      time: "03:00 AM – 05:00 AM",
      description: "Second project review and feedback.",
      image: "/images/image11.png",
    },
    {
      index: 13,
      title: "Rest (Go to Rooms)",
      date: "Day 2",
      time: "05:00 AM – 06:00 AM",
      description: "Rest and recharge for the final push.",
      image: "/images/image12.png",
    },
    {
      index: 14,
      title: "Final Build Phase",
      date: "Day 2",
      time: "08:00 AM – 10:00 AM",
      description: "Teams finalize their projects.",
      image: "/images/image13.png",
    },
    {
      index: 15,
      title: "Final Review",
      date: "Day 2",
      time: "10:00 AM – 12:00 PM",
      description: "Final project presentations and judging.",
      image: "/images/image14.png",
    },
    {
      index: 16,
      title: "Speaker Session",
      date: "Day 2",
      time: "12:00 PM – 12:40 PM",
      description: "Guest speaker session.",
      image: "/images/image15.png",
    },
    {
      index: 17,
      title: "Ending Ceremony",
      date: "Day 2",
      time: "12:40 PM – 01:00 PM",
      description: "Awards, closing remarks, and celebration.",
      image: "/images/image16.png",
    },
    { index: null, text: "End of Day 2...", isEnd: true },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const isAutoScrolling = useRef(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Initial centering logic on mount/resize
    const handleScroll = () => {
      if (isAutoScrolling.current || !scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportCenter = rect.left + rect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });
      setActiveIndex(closestIndex);
    };

    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow rapid keyboard navigation by removing the isAutoScrolling check
      if (e.key === "ArrowLeft") {
        scrollToIndex(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        scrollToIndex(activeIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // SPRING PHYSICS IMPLEMENTATION (Dynamic Tracking)
  const springScrollTo = (container, targetCardIndex) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Physics Constants
    const tension = 160; 
    const friction = 35; // Higher friction to prevent overshoot

    let velocity = 0;
    let position = container.scrollLeft;
    let lastTime = performance.now();

    const step = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const targetCard = cardRefs.current[targetCardIndex];
      if (!targetCard) {
        isAutoScrolling.current = false;
        return;
      }

      // Dynamic Center Calculation: Recalculate target on every frame
      const containerRect = container.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();
      const currentScroll = container.scrollLeft;
      
      const targetLeft = currentScroll + (cardRect.left - containerRect.left) - (containerRect.width / 2) + (cardRect.width / 2);
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      const clampedTarget = Math.max(0, Math.min(targetLeft, maxScroll));

      const displacement = position - clampedTarget;
      const force = -tension * displacement - friction * velocity;
      
      velocity += force * deltaTime;
      position += velocity * deltaTime;

      container.scrollLeft = position;

      if (Math.abs(velocity) < 1 && Math.abs(displacement) < 0.5) {
        container.scrollLeft = clampedTarget;
        isAutoScrolling.current = false;
        container.style.scrollSnapType = ""; 
      } else {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const scrollToIndex = (index) => {
    if (index < 0 || index >= cards.length) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    isAutoScrolling.current = true;
    container.style.scrollSnapType = "none";

    setActiveIndex(index);
    springScrollTo(container, index);
  };

  return (
    <div className="w-full min-h-screen bg-[#040704] relative overflow-hidden flex flex-col">
      {/* Background Gradient 1 */}
      <div
        className="absolute -top-62.5 left-1/2 -translate-x-1/2 w-350 h-175 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(5, 124, 53, 0.45) 0%, rgba(34, 82, 44, 0.3) 30%, rgba(34, 82, 44, 0.15) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Background Gradient 2 */}
      <div
        className="absolute top-0 left-0 w-full h-75 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(14, 179, 79, 0.25) 0%, rgba(14, 179, 79, 0.05) 40%, transparent 70%)",
          filter: "blur(50px)",
          opacity: 1,
        }}
      />

      {/* TITLE - Changed to RELATIVE to fix gap issue, and Normal Font */}
      <div className="w-full mt-6 md:mt-9 text-[40px] md:text-[70px] leading-[100%] text-center bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent font-sans font-normal z-10 select-none relative">
        Timeline
      </div>

      {/* CONTENT CONTAINER - Changed to justify-start with fixed top padding */}
      <div className="flex flex-col items-start justify-start pt-12 md:pt-24 relative z-10 overflow-visible">
        <div className="px-6 md:pl-20 text-[24px] md:text-[48px] font-sans text-white mb-4 md:mb-8 transition-all duration-500">
          {activeIndex <= 8
            ? "Day 1 - Build & Break In"
            : "Day 2 - Stabilise & Ship"}
        </div>

        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto overflow-y-visible w-full snap-mandatory snap-x no-scrollbar px-[10vw] md:px-[40vw]"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex w-max gap-6 md:gap-16 pb-32 pt-10 overflow-visible">
            {cards.map((card, i) => {
              const isActive = activeIndex === i;
              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="shrink-0 snap-center snap-always overflow-visible"
                >
                  <div
                    className={`relative z-10 transition-all duration-600 ease-out will-change-transform
                    ${isActive ? "opacity-100 z-20" : "opacity-40 blur-[0.5px] md:blur-[1px] z-0"}`}
                  >
                    <Card
                      isActive={isActive}
                      index={card.index || (isActive ? "" : "End")}
                      data={card}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ bottom: "44px", zIndex: 13 }}
      >
        <div
          style={{
            width: "420px",
            height: "6px",
            margin: "0 auto",
            borderRadius: "6px",
            background: "linear-gradient(90deg,#9effa6,#00ff66)",
            boxShadow:
              "0 6px 20px rgba(0,255,102,0.9), 0 0 36px rgba(0,255,102,0.25)",
          }}
        />
      </div>

      {/* NAVIGATION BUTTONS - With Hover/Active Animations */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div
          className="w-30 md:w-42.5 h-12.5 md:h-17.5 rounded-[18px] md:rounded-3xl flex items-center justify-between relative group hover:brightness-125 transition-all duration-300 shadow-2xl overflow-hidden p-0.5"
          style={{
            background:
              "linear-gradient(116.6deg, #8CFF84 0%, #0EB337 26.9%, #42D774 78.62%, #85FFB0 99.92%)",
          }}
        >
          <div
            className="w-full h-full rounded-2xl md:rounded-[22px] flex items-center justify-between relative"
            style={{
              background:
                "radial-gradient(60.5% 60.5% at 50% 50%, #19954B 59.15%, #0CAC4F 86.65%)",
            }}
          >
            {/* LEFT BUTTON */}
            <button
              className="w-1/2 h-full flex items-center justify-center hover:bg-white/20 transition-all z-10 group/left"
              onClick={() => scrollToIndex(activeIndex - 1)}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover/left:-translate-x-1 group-active/left:scale-75"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="w-px h-6.25 md:h-10 bg-white opacity-20" />

            {/* RIGHT BUTTON */}
            <button
              className="w-1/2 h-full flex items-center justify-center hover:bg-white/20 transition-all z-10 group/right"
              onClick={() => scrollToIndex(activeIndex + 1)}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover/right:translate-x-1 group-active/right:scale-75"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}