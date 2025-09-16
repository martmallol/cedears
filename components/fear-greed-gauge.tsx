"use client"

interface FearGreedGaugeProps {
  value: number
}

export function FearGreedGauge({ value }: FearGreedGaugeProps) {
  const size = 200
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const centerX = size / 2
  const centerY = size / 2

  // Get state label based on value
  const getStateLabel = (val: number) => {
    if (val < 20) return "Extreme Fear"
    if (val < 40) return "Fear"
    if (val < 60) return "Neutral"
    if (val < 80) return "Greed"
    return "Extreme Greed"
  }

  // Calculate point position on the arc (180° to 360°)
  const pointAngle = 180 + (value / 100) * 180 // Start at 180° (left), go to 360° (right)
  const pointX = centerX + radius * Math.cos((pointAngle * Math.PI) / 180)
  const pointY = centerY + radius * Math.sin((pointAngle * Math.PI) / 180)

  // Create arc for each color segment
  const createArc = (startAngle: number, endAngle: number, color: string) => {
    const start = (startAngle * Math.PI) / 180
    const end = (endAngle * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(start)
    const y1 = centerY + radius * Math.sin(start)
    const x2 = centerX + radius * Math.cos(end)
    const y2 = centerY + radius * Math.sin(end)
    
    return (
      <path
        key={`${startAngle}-${endAngle}`}
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    )
  }

  // 5 color segments for the gauge
  const segments = [
    { start: 180, end: 216, color: "#dc2626" }, // Red (Extreme Fear) 0-20
    { start: 216, end: 252, color: "#ea580c" }, // Orange (Fear) 20-40
    { start: 252, end: 288, color: "#eab308" }, // Yellow (Neutral) 40-60
    { start: 288, end: 324, color: "#22c55e" }, // Green (Greed) 60-80
    { start: 324, end: 360, color: "#059669" }, // Dark Green (Extreme Greed) 80-100
  ]

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size / 2 + 40} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Color segments */}
        {segments.map(segment => createArc(segment.start, segment.end, segment.color))}
        
        {/* Point indicator on the arc */}
        <circle
          cx={pointX}
          cy={pointY}
          r="14"
          fill="#1f2937"
          stroke="white"
          strokeWidth="6"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
        <div className="text-5xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1 font-medium">{getStateLabel(value)}</div>
      </div>
    </div>
  )
}
