export default function RuleCard({
  icon: Icon,
  title,
  desc,
  height = 260,
  viewBoxHeight = 260,
  disableHoverStroke = false,
  disableHoverScale = false,
  disableHoverFill = false,
}) {
  const bottomY = viewBoxHeight - 40;
  const pathHeight = viewBoxHeight;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div className="relative group">
        <svg
          viewBox={`0 0 400 ${viewBoxHeight}`}
          className={`
            absolute 
            inset-0 
            w-full 
            h-full 
            transition-all
            duration-300
            group-hover:scale-[1.02]
            group-hover:drop-shadow-[0_0_20px_rgba(12,172,79,0.2)]
            ${disableHoverScale ? "" : "group-hover:scale-[1.02]"}
            ${disableHoverScale ? "" : "group-hover:drop-shadow-[0_0_20px_rgba(12,172,79,0.2)]"}
          `}
          preserveAspectRatio="none"
        >
          <path
            d={`
              M40 0
              H150
              C170 0 175 40 200 40
              H360
              C382 40 400 58 400 80
              V${bottomY}
              C400 ${bottomY + 22} 382 ${pathHeight} 360 ${pathHeight}
              H40
              C18 ${pathHeight} 0 ${bottomY + 22} 0 ${bottomY}
              V40
              C0 18 18 0 40 0
              Z
            `}
            className={`
              fill-[#18181b] 
              stroke-[#e5e7eb1a] 
              [stroke-width:1.5]
              transition-all 
              duration-300 
              group-hover/card:fill-[#0a1a0f]
              group-hover/card:[stroke-width:2.5]
              ${disableHoverFill ? "" : "group-hover:fill-[#0a1a0f]"}
              group-hover:[stroke-width:2.5]
              ${disableHoverStroke ? "" : "group-hover:stroke-[#0CAC4F]"}
            `}
          />
        </svg>

      {/* card ka content */}
      <div className="relative p-8 w-full text-left" style={{ minHeight: resolvedHeight }}>
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#0CAC4F1A] mb-6">
          {Icon && (
            <img 
              src={Icon} 
              alt="" 
              className="w-7 h-7 object-contain"
              style={{ 
                filter: 'invert(48%) sepia(79%) saturate(541%) hue-rotate(92deg) brightness(95%) contrast(92%)' 
              }}
            />
          )}
        </div>

        <h3 className="text-xl font-semibold text-white transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-400 mt-3 leading-relaxed break-words">
          {desc}
        </p>
      </div>

    </div>
  );
}