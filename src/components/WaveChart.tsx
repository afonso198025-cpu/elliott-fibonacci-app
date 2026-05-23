import { useMemo } from 'react';
import type { WavePoints } from '../engine/fibonacci';
import type { WaveAnalysis } from '../engine/fibonacci';

interface WaveChartProps {
  points: WavePoints;
  analyses: WaveAnalysis[];
  isUptrend: boolean;
}

export function WaveChart({ points, analyses, isUptrend }: WaveChartProps) {
  const chartData = useMemo(() => {
    const definedPoints: { label: string; price: number; x: number }[] = [];
    const labels = [
      { key: 'wave0' as const, label: '0' },
      { key: 'wave1' as const, label: '1' },
      { key: 'wave2' as const, label: '2' },
      { key: 'wave3' as const, label: '3' },
      { key: 'wave4' as const, label: '4' },
      { key: 'wave5' as const, label: '5' },
      { key: 'waveA' as const, label: 'A' },
      { key: 'waveB' as const, label: 'B' },
      { key: 'waveC' as const, label: 'C' },
    ];

    labels.forEach((item, idx) => {
      const val = points[item.key];
      if (val !== undefined) {
        definedPoints.push({ label: item.label, price: val, x: idx * 80 + 40 });
      }
    });

    return definedPoints;
  }, [points]);

  if (chartData.length < 2) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 text-center text-gray-500">
        Insira pelo menos 2 pontos de onda para ver o grafico
      </div>
    );
  }

  const prices = chartData.map(p => p.price);
  const allPrices = [...prices];

  // Add fib level prices
  for (const analysis of analyses) {
    for (const level of analysis.levels) {
      allPrices.push(level.price);
    }
  }

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;
  const padding = priceRange * 0.1;

  const width = chartData.length * 80 + 80;
  const height = 400;
  const chartTop = 30;
  const chartBottom = height - 30;
  const chartHeight = chartBottom - chartTop;

  const priceToY = (price: number) => {
    return chartBottom - ((price - (minPrice - padding)) / (priceRange + padding * 2)) * chartHeight;
  };

  const pathPoints = chartData.map(p => `${p.x},${priceToY(p.price)}`).join(' ');

  // Get important fib levels to show on chart
  const fibLines = analyses.flatMap(a =>
    a.levels
      .filter(l => l.importance === 'primary')
      .map(l => ({
        price: l.price,
        label: `${a.waveName} ${l.label}`,
        y: priceToY(l.price),
        color: l.type === 'retracement' ? '#f59e0b' : '#10b981',
      }))
  );

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 overflow-x-auto">
      <svg width={Math.max(width, 600)} height={height} className="w-full" viewBox={`0 0 ${Math.max(width, 600)} ${height}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = chartTop + chartHeight * (1 - pct);
          const price = minPrice - padding + (priceRange + padding * 2) * pct;
          return (
            <g key={pct}>
              <line x1={20} y1={y} x2={Math.max(width, 600) - 20} y2={y} stroke="#374151" strokeWidth={0.5} strokeDasharray="4,4" />
              <text x={Math.max(width, 600) - 15} y={y + 4} fill="#6b7280" fontSize={10} textAnchor="end">
                {price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Fibonacci level lines */}
        {fibLines.filter(fl => fl.y > chartTop && fl.y < chartBottom).map((fl, idx) => (
          <g key={`fib-${idx}`}>
            <line
              x1={20} y1={fl.y}
              x2={Math.max(width, 600) - 80} y2={fl.y}
              stroke={fl.color} strokeWidth={1} strokeDasharray="6,3" opacity={0.6}
            />
            <text x={Math.max(width, 600) - 75} y={fl.y + 3} fill={fl.color} fontSize={9}>
              {fl.label}
            </text>
          </g>
        ))}

        {/* Wave line */}
        <polyline
          points={pathPoints}
          fill="none"
          stroke={isUptrend ? '#22c55e' : '#ef4444'}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Wave points */}
        {chartData.map((point, idx) => {
          const y = priceToY(point.price);
          const isABC = ['A', 'B', 'C'].includes(point.label);
          const color = isABC ? '#3b82f6' : isUptrend ? '#22c55e' : '#ef4444';
          return (
            <g key={idx}>
              <circle cx={point.x} cy={y} r={6} fill={color} stroke="#1f2937" strokeWidth={2} />
              <text x={point.x} y={y - 14} fill={color} fontSize={14} fontWeight="bold" textAnchor="middle">
                {point.label}
              </text>
              <text x={point.x} y={y + 20} fill="#9ca3af" fontSize={10} textAnchor="middle">
                {point.price.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
