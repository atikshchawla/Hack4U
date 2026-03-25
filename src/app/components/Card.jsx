'use client'

export default function Card({ isActive = false, index = 1, data = {} }) {
  const borderRadius = isActive ? "40px" : "70px";

  const transitionSettings = "transition-all duration-600 ease-in-out";

  const contentFixedWidth = "clamp(350px, 85vw, 500px)";

  return (
    <div className="shrink-0 font-sans">
      <div
        className={`p-0.5 ${transitionSettings}`}
        style={{
          borderRadius: borderRadius,
          background: isActive
            ? "#000000"
            : "linear-gradient(180deg, #444444 0%, #222222 100%)",
          boxShadow: isActive ? "0px 3px 20px 0px #32AD3480" : "0px 3px 9px 0px #32AD3440",
        }}
      >
        <div
          className={`relative flex flex-col items-center ${transitionSettings} overflow-hidden
            border
            border-white/10
            border-t-white/20
            border-l-white/20
          `}
          style={{
            width: isActive ? contentFixedWidth : "clamp(60px, 10vw, 140px)",
            height: "clamp(350px, 60vh, 460px)",
            borderRadius: isActive ? "38px" : "68px",
            background: "#000000",
            boxShadow:
              "0px 4px 8px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px 0px 20px 0px rgba(255, 255, 255, 0.05)",
          }}
        >
          <div 
            className="flex flex-col items-center w-full h-full"
            style={{ 
              minWidth: contentFixedWidth, 
              width: contentFixedWidth 
            }}
          >
            {/* IMAGE SECTION */}
            {data.image && !data.isEnd && (
              <div 
                className={`w-full h-[40%] relative mt-6 px-6 transition-opacity duration-500 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                 <img 
                  src={data.image} 
                  alt={data.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* ROTATED TITLE FOR CLOSED CARDS */}
            {!isActive && !data.isEnd && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <span 
                  // Added max-w and truncate to handle overflow in vertical mode
                  className="text-white/80 text-xl md:text-2xl font-bold font-sans tracking-wider whitespace-nowrap -rotate-90 transition-all duration-500 truncate max-w-150"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {data.title}
                </span>
              </div>
            )}

            {/* TEXT CONTENT */}
            <div 
              className={`flex flex-col w-full h-full px-6 md:px-10 transition-opacity ease-in-out ${
                isActive ? 'opacity-100 duration-300' : 'opacity-0 duration-200 pointer-events-none'
              } ${data.isEnd ? 'justify-center items-center text-center' : 'justify-start items-start mt-4'}`}
            >
              {/* ADDED: truncate class to enforce ellipsis on long names */}
              <h2 className="text-white text-2xl md:text-4xl font-bold font-sans mb-2 truncate w-full">
                {data.isEnd ? data.text : data.title}
              </h2>
              
              {!data.isEnd && (
                <>
                  <div className="flex items-center gap-2 md:gap-4 text-white/70 text-sm md:text-lg mb-4">
                    <span>{data.date}</span>
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                    <span>{data.time}</span>
                  </div>
                  {data.description && (
                    <p className="text-white/50 text-base md:text-xl leading-relaxed max-w-[95%]">
                      {data.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}