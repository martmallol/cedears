"use client"

interface FearGreedGaugeProps {
  value: number
}

export function FearGreedGauge({ value }: FearGreedGaugeProps) {
  const radius = 80
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (value / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 75) return "#dc2626" // red-600
    if (score >= 55) return "#ea580c" // orange-600
    if (score >= 45) return "#ca8a04" // yellow-600
    if (score >= 25) return "#2563eb" // blue-600
    return "#991b1b" // red-800
  }

  return (
    <div className="relative">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted"
          opacity={0.2}
        />
        {/* Progress circle */}
        <circle
          stroke={getColor(value)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {/* Labels around the gauge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs text-muted-foreground absolute -top-2 left-1/2 transform -translate-x-1/2">100</div>
        <div className="text-xs text-muted-foreground absolute top-1/2 -right-4 transform -translate-y-1/2">75</div>
        <div className="text-xs text-muted-foreground absolute -bottom-2 left-1/2 transform -translate-x-1/2">0</div>
        <div className="text-xs text-muted-foreground absolute top-1/2 -left-4 transform -translate-y-1/2">25</div>
      </div>
    </div>
  )
}
