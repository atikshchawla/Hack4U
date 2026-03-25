"use client";
import React from "react";

export default function SetupLayout({ children }) {
  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-black
        font-sans
        text-white
        selection:bg-green-500/30
      "
    >
      {/* FIXED BACKGROUND SVG */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 832"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-full"
        >
          <g filter="url(#filter0_f_step1)">
            <path
              d="M1349 849H1006C1691.5 320.556 378.5 -3.9082 22 -79H1349V849Z"
              fill="#19954B"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_step1"
              x="-220.9"
              y="-321.9"
              width="1812.8"
              height="1413.8"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="121.45"
                result="effect1_foregroundBlur_step1"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* INNER SHADOW */}
      <div
        className="fixed inset-0 z-1 pointer-events-none"
        style={{ boxShadow: "inset 0 0 50px #14753B" }}
      />

      {/* CONTENT */}
      <div className="relative z-10 w-full min-h-screen px-6 md:px-12 lg:px-20">
        {children}
      </div>
    </div>
  );
}
