import type { WavePoints } from '../engine/fibonacci';

interface WaveInputProps {
  points: WavePoints;
  onChange: (points: WavePoints) => void;
}

const waveFields: { key: keyof WavePoints; label: string; section: string; color: string }[] = [
  { key: 'wave0', label: 'Inicio (0)', section: 'impulse', color: 'text-emerald-400' },
  { key: 'wave1', label: 'Onda 1', section: 'impulse', color: 'text-emerald-400' },
  { key: 'wave2', label: 'Onda 2', section: 'impulse', color: 'text-yellow-400' },
  { key: 'wave3', label: 'Onda 3', section: 'impulse', color: 'text-emerald-400' },
  { key: 'wave4', label: 'Onda 4', section: 'impulse', color: 'text-yellow-400' },
  { key: 'wave5', label: 'Onda 5', section: 'impulse', color: 'text-emerald-400' },
  { key: 'waveA', label: 'Onda A', section: 'correction', color: 'text-blue-400' },
  { key: 'waveB', label: 'Onda B', section: 'correction', color: 'text-blue-400' },
  { key: 'waveC', label: 'Onda C', section: 'correction', color: 'text-blue-400' },
];

export function WaveInput({ points, onChange }: WaveInputProps) {
  const handleChange = (key: keyof WavePoints, value: string) => {
    const newPoints = { ...points };
    if (value === '' || value === undefined) {
      delete newPoints[key];
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newPoints[key] = num;
      }
    }
    onChange(newPoints);
  };

  const clearAll = () => {
    onChange({});
  };

  const impulseFields = waveFields.filter(f => f.section === 'impulse');
  const correctionFields = waveFields.filter(f => f.section === 'correction');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pontos das Ondas</h3>
        <button
          onClick={clearAll}
          className="text-xs px-3 py-1 rounded bg-red-900/50 text-red-300 hover:bg-red-800/50 transition-colors"
        >
          Limpar
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-emerald-400 mb-2">Impulso (1-5)</h4>
        <div className="grid grid-cols-3 gap-2">
          {impulseFields.map(field => (
            <div key={field.key} className="flex flex-col">
              <label className={`text-xs ${field.color} mb-1`}>{field.label}</label>
              <input
                type="number"
                step="any"
                value={points[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder="Preco"
                className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-blue-400 mb-2">Correcao (ABC)</h4>
        <div className="grid grid-cols-3 gap-2">
          {correctionFields.map(field => (
            <div key={field.key} className="flex flex-col">
              <label className={`text-xs ${field.color} mb-1`}>{field.label}</label>
              <input
                type="number"
                step="any"
                value={points[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder="Preco"
                className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
