import type { WaveAnalysis } from '../engine/fibonacci';

interface FibResultsProps {
  analyses: WaveAnalysis[];
  warnings: string[];
}

export function FibResults({ analyses, warnings }: FibResultsProps) {
  if (analyses.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6 text-center text-gray-500">
        Insira os pontos das ondas para ver as projecoes e retracoes de Fibonacci
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-yellow-400">Validacao & Regras</h4>
          {warnings.map((w, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-1.5 rounded ${
                w.startsWith('INVALIDO')
                  ? 'bg-red-900/40 text-red-300'
                  : w.startsWith('ATENCAO')
                    ? 'bg-yellow-900/40 text-yellow-300'
                    : 'bg-blue-900/30 text-blue-300'
              }`}
            >
              {w}
            </div>
          ))}
        </div>
      )}

      {analyses.map((analysis, aIdx) => (
        <div key={aIdx} className="bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-700/30 flex items-center justify-between">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                analysis.direction === 'up' ? 'bg-emerald-400' : 'bg-red-400'
              }`} />
              {analysis.waveName}
              <span className="text-xs text-gray-400">
                ({analysis.direction === 'up' ? 'Alta' : 'Baixa'})
              </span>
            </h4>
          </div>

          <div className="p-4 space-y-3">
            {/* Levels table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs">
                    <th className="text-left py-1 px-2">Nivel</th>
                    <th className="text-left py-1 px-2">Preco</th>
                    <th className="text-left py-1 px-2">Tipo</th>
                    <th className="text-left py-1 px-2 hidden sm:table-cell">Descricao</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.levels.map((level, lIdx) => (
                    <tr
                      key={lIdx}
                      className={`border-t border-gray-700/50 ${
                        level.importance === 'primary'
                          ? 'bg-emerald-900/20'
                          : level.importance === 'extended'
                            ? 'bg-purple-900/10'
                            : ''
                      }`}
                    >
                      <td className="py-1.5 px-2">
                        <span className={`font-mono text-sm ${
                          level.importance === 'primary'
                            ? 'text-emerald-400 font-bold'
                            : level.importance === 'extended'
                              ? 'text-purple-400'
                              : 'text-gray-300'
                        }`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 font-mono text-white font-medium">
                        {level.price.toFixed(5)}
                      </td>
                      <td className="py-1.5 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          level.type === 'retracement'
                            ? 'bg-yellow-900/40 text-yellow-300'
                            : 'bg-emerald-900/40 text-emerald-300'
                        }`}>
                          {level.type === 'retracement' ? 'Retracao' : 'Projecao'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-gray-400 text-xs hidden sm:table-cell">
                        {level.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rules */}
            {analysis.rules.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Regras:</p>
                <ul className="space-y-0.5">
                  {analysis.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="text-xs text-gray-400 flex items-start gap-1">
                      <span className="text-gray-600 mt-0.5">-</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
