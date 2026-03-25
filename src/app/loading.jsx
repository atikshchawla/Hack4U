"use client";

import React from "react";
import { useEffect, useState } from "react";

const CornerShape = ({ className }) => (
	<svg
		className={`absolute w-16 h-16 ${className}`}
		viewBox="0 0 100 100"
		fill="none"
	>
		<path
			d="M 10,20 H 45 L 65,40 V 75"
			stroke="#0A9143"
			strokeWidth="3"
			strokeLinecap="round"
			className="drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]"
		/>
	</svg>
);

const Loader = () => {
	const [showDiv, setDiv] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setDiv(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);
	return (
		<div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden text-white">
			<div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center isolate"></div>

			<style>{`


    /*FADE-IN LOADING TEXT*/
      @keyframes edgeSlideRight {
  0% { transform: translateX(20px); opacity: 0; }
  28% {transform: translateX(-40px); opacity: 1;}
  71% { transform: translateX(-40px); opacity: 1;}
  100%{transform: translateX(-60px); opacity: 0;}
}

@keyframes edgeSlideLeft {
  0% { transform: translateX(-20px); opacity: 0; }
  28% {transform: translateX(40px); opacity: 1;}
  71% { transform: translateX(40px); opacity: 1;}
  100%{transform: translateX(60px); opacity: 0;}
}
  /*VERTICAL BARS*/

@keyframes doubleFill {
  0% { height: 0%; opacity: 0; }
  10%, 90% { opacity: 1; }
  100% { height: 100%; opacity: 0; }
}

 

        /* Grid lines */
        .grid-lines {
          background-image: 
            linear-gradient(to right, rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        /* Crosshair lines */
        .crosshair::before,
        .crosshair::after {
          content: '';
          position: absolute;
          background: rgba(0, 255, 65, 0.2);
        }
        .crosshair::before {
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          transform: translateY(-50%);
        }
        .crosshair::after {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
        }

        @keyframes outerRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .orbit-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 450px;
          height: 450px;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* Ellipse revolution container - THIS MAKES THEM REVOLVE */
        .ellipse-system {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 400px;
          margin-left: -150px;
          margin-top: -200px;
          perspective: 800px;
          transform-style: preserve-3d;
          animation: revolveSystem 15s linear infinite;
        }

        /*@keyframes revolveSystem {
           0% { transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg); }
           100% { transform: rotateX(20deg) rotateY(360deg) rotateZ(0deg); }
         }*/

        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 350px;
          height: 350px;
          margin-left: -175px;
          margin-top: -175px;
          border: 3px solid #0A9143;
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        /* 5 orbits tilted at different angles (72 degrees apart for even distribution) */
        .orbit-1 { transform: rotateX(110deg) rotateY(0deg); }
        .orbit-2 { transform: rotateX(0deg) rotateY(70deg); }
        .orbit-3 { transform: rotateX(65deg) rotateY(30deg); }
        .orbit-4 { transform: rotateX(245deg) rotateY(210deg); }
        .orbit-5 { transform: rotateX(144deg) rotateY(0deg); }

        /* Timeline is 6s total */

        .orbit-set-1 {
          animation: showHideA 7s linear infinite;
        }

        .orbit-set-2 {
          animation: showHideB 7s linear infinite;
        }

        @keyframes showHideA {
          0%   { opacity: 0; }
          25%  { opacity: 0; }
          30%  { opacity: 1; }
          38%  { opacity: 1; }
          42%  { opacity: 0; }
          50%  { opacity: 0; }
          80%  { opacity: 0; }
          85%  { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes showHideB {
          0%   { opacity: 0; }
          52%  { opacity: 0; }
          57%  { opacity: 1; }
          66%  { opacity: 1; }
          71%  { opacity: 0; }
          80%  { opacity: 0; }
          85%  { opacity: 1; }
          100% { opacity: 1; }
        }


        /* 3D Outer Cube - Made bigger */
        .cube-scene {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          perspective: 1200px;
          z-index: 10;
        }

        .cube-outer {
          width: 144px;
          height: 144px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCubeOuter 12s linear infinite;
        }

        @keyframes rotateCubeOuter {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        .cube-face-outer {
          position: absolute;
          width: 144px;
          height: 144px;
          border: 3px solid #0A9143;
          background: rgba(0, 255, 65, 0.05);
          /*box-shadow: 
            0 0 15px rgba(0, 255, 65, 0.3),
            inset 0 0 15px rgba(0, 255, 65, 0.1);*/
        }

        .cube-face-outer.front  { transform: rotateY(0deg) translateZ(72px); }
        .cube-face-outer.back   { transform: rotateY(180deg) translateZ(72px); }
        .cube-face-outer.right  { transform: rotateY(90deg) translateZ(72px); }
        .cube-face-outer.left   { transform: rotateY(-90deg) translateZ(72px); }
        .cube-face-outer.top    { transform: rotateX(90deg) translateZ(72px); }
        .cube-face-outer.bottom { transform: rotateX(-90deg) translateZ(72px); }

        /* Mid Cube - Between outer and inner */
        .cube-mid {
          width: 94px;
          height: 94px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -45px;
          margin-top: -45px;
          transform-style: preserve-3d;
          animation: rotateCubeMid 10s linear infinite;
        }

        @keyframes rotateCubeMid {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(-360deg) rotateY(360deg) rotateZ(180deg); }
        }

        .cube-face-mid {
          position: absolute;
          width: 94px;
          height: 94px;
          border: 3px solid #0A9143;
          background: rgba(0, 255, 65, 0.12);
          /*box-shadow:
            0 0 18px rgba(0, 255, 65, 0.4),
            inset 0 0 18px rgba(0, 255, 65, 0.25);*/
        }

        /* Mid cube faces */
        .cube-face-mid.front  { transform: rotateY(0deg) translateZ(47px); }
        .cube-face-mid.back   { transform: rotateY(180deg) translateZ(47px); }
        .cube-face-mid.right  { transform: rotateY(90deg) translateZ(47px); }
        .cube-face-mid.left   { transform: rotateY(-90deg) translateZ(47px); }
        .cube-face-mid.top    { transform: rotateX(90deg) translateZ(47px); }
        .cube-face-mid.bottom { transform: rotateX(-90deg) translateZ(47px); }

        /* Pulse animation for mid cube 
        @keyframes facePulseMid {
          0%, 100% { background: rgba(0, 255, 65, 0.12); }
          50% { background: rgba(0, 255, 65, 0.3); }
        }*/
          

        .cube-face-mid {
          animation: facePulseMid 2.5s ease-in-out infinite;
        }

        .cube-face-mid.front { animation-delay: 0s; }
        .cube-face-mid.right { animation-delay: 0.4s; }
        .cube-face-mid.back { animation-delay: 0.8s; }
        .cube-face-mid.left { animation-delay: 1.2s; }
        .cube-face-mid.top { animation-delay: 1.6s; }
        .cube-face-mid.bottom { animation-delay: 2s; }


        /* Inner Cube - Smaller and rotating opposite direction */
        .cube-inner {
          width: 48px;
          height: 48px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -30px;
          margin-top: -30px;
          transform-style: preserve-3d;
          animation: rotateCubeInner 8s linear infinite reverse;
        }

        @keyframes rotateCubeInner {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        .cube-face-inner {
          position: absolute;
          width: 48px;
          height: 48px;
          border: 3px solid #0A9143;
          background: rgba(0, 255, 65, 0.2);
          /*box-shadow: 
            0 0 20px rgba(0, 255, 65, 0.5),
            inset 0 0 20px rgba(0, 255, 65, 0.3);*/
        }

        .cube-face-inner.front  { transform: rotateY(0deg) translateZ(24px); }
        .cube-face-inner.back   { transform: rotateY(180deg) translateZ(24px); }
        .cube-face-inner.right  { transform: rotateY(90deg) translateZ(24px); }
        .cube-face-inner.left   { transform: rotateY(-90deg) translateZ(24px); }
        .cube-face-inner.top    { transform: rotateX(90deg) translateZ(24px); }
        .cube-face-inner.bottom { transform: rotateX(-90deg) translateZ(24px); }

        /* Pulsing animation for outer cube faces 
        @keyframes facePulseOuter {
          0%, 100% { background: rgba(0, 255, 65, 0.05); }
          50% { background: rgba(0, 255, 65, 0.15); }
        }*/

        .cube-face-outer {
          animation: facePulseOuter 3s ease-in-out infinite;
        }

        .cube-face-outer.front { animation-delay: 0s; }
        .cube-face-outer.right { animation-delay: 0.5s; }
        .cube-face-outer.back { animation-delay: 1s; }
        .cube-face-outer.left { animation-delay: 1.5s; }
        .cube-face-outer.top { animation-delay: 2s; }
        .cube-face-outer.bottom { animation-delay: 2.5s; }

        /* Pulsing animation for inner cube faces 
        @keyframes facePulseInner {
          0%, 100% { background: rgba(0, 255, 65, 0.2); }
          50% { background: rgba(0, 255, 65, 0.4); }
        }*/

        .cube-face-inner {
          animation: facePulseInner 2s ease-in-out infinite;
        }

        .cube-face-inner.front { animation-delay: 0s; }
        .cube-face-inner.right { animation-delay: 0.33s; }
        .cube-face-inner.back { animation-delay: 0.66s; }
        .cube-face-inner.left { animation-delay: 1s; }
        .cube-face-inner.top { animation-delay: 1.33s; }
        .cube-face-inner.bottom { animation-delay: 1.66s; }

        /* HUD Corner Brackets */
         @keyframes doubleFill {
          0% { height: 0%; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { height: 100%; opacity: 0; }
        }
       `}</style>

			<CornerShape className="top-8 left-8 -rotate-90" />
			<CornerShape className="top-8 right-8" />
			<CornerShape className="bottom-8 left-8 -rotate-180" />
			<CornerShape className="bottom-8 right-8 rotate-90" />

			{/* Background grid */}
			<div className="absolute inset-0 grid-lines"></div>

			{/* Crosshair */}
			<div className="absolute inset-0 crosshair"></div>

			{/* Corner decorations */}
			<div className="hud-corner hud-tl"></div>
			<div className="hud-corner hud-tr"></div>
			<div className="hud-corner hud-bl"></div>
			<div className="hud-corner hud-br"></div>

			{/* loading text fade-in*/}

			{/* Animated LOADING text - hidden on mobile */}
			{/* Animated LOADING text - desktop only */}
			<div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2">
				<div
					className="text-[#ffff] font-bold text-xl tracking-[0.4em]"
					style={{ animation: "edgeSlideLeft 7s linear infinite" }}
				>
					LOADING
				</div>
			</div>
			<div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2">
				<div
					className="text-[#ffff] font-bold text-xl tracking-[0.4em]"
					style={{ animation: "edgeSlideRight 7s linear infinite" }}
				>
					LOADING
				</div>
			</div>

			{/*VERTICAL BARS*/}
			{/* LEFT BAR */}
			<div className="absolute left-11 top-28.75 bottom-28.75 w-1 bg-white/5">
				<div
					className="w-full bg-[#0A9143] shadow-[0_0_15px_#00ff41]"
					style={{ animation: "doubleFill 7.5s ease-in-out infinite" }}
				></div>
			</div>

			{/* RIGHT BAR - use same left/right value for symmetry */}
			<div className="absolute right-11 top-28.75 bottom-28.75 w-1 bg-white/5">
				<div
					className="w-full bg-[#0A9143] shadow-[0_0_15px_#00ff41]"
					style={{ animation: "doubleFill 7.5s ease-in-out infinite" }}
				></div>
			</div>

			{/* Center orbital system */}
			<div className="orbit-container">
				{/* Outer rotating ring - centered, desktop only */}
				<div
					className="hidden md:block absolute top-1/2 left-1/2 w-87.5 h-87.5 border-[3px] border-[#0A9143] rounded-full"
					style={{
						marginLeft: "-175px",
						marginTop: "-175px",
						animation: "outerRing 12s linear infinite",
					}}
				></div>

				{/* REVOLVING ELLIPSE SYSTEM - desktop only */}
				<div className="hidden md:block ellipse-system">
					<div className="orbit-set-1">
						<div className="orbit orbit-1"></div>
						<div className="orbit orbit-2"></div>
					</div>
					<div className="orbit-set-2">
						<div className={`orbit orbit-3`}></div>
						<div className="orbit orbit-4"></div>
					</div>
					{/* <div className="orbit orbit-5"></div> */}
				</div>

				{/* 3D Cubes in center */}
				<div className="cube-scene">
					{/* Outer Cube - Bigger */}
					<div className="cube-outer">
						<div className="cube-face-outer front"></div>
						<div className="cube-face-outer back"></div>
						<div className="cube-face-outer right"></div>
						<div className="cube-face-outer left"></div>
						<div className="cube-face-outer top"></div>
						<div className="cube-face-outer bottom"></div>

						{/* Mid Cube - Medium size */}
						<div className="cube-mid">
							<div className="cube-face-mid front"></div>
							<div className="cube-face-mid back"></div>
							<div className="cube-face-mid right"></div>
							<div className="cube-face-mid left"></div>
							<div className="cube-face-mid top"></div>
							<div className="cube-face-mid bottom"></div>
						</div>

						{/* Inner Cube - Smaller, rotating opposite direction */}
						<div className="cube-inner">
							<div className="cube-face-inner front"></div>
							<div className="cube-face-inner back"></div>
							<div className="cube-face-inner right"></div>
							<div className="cube-face-inner left"></div>
							<div className="cube-face-inner top"></div>
							<div className="cube-face-inner bottom"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
