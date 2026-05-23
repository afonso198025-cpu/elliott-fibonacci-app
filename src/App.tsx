import { useState } from 'react';
import type { Asset } from './data/assets';
import type { WavePoints } from './engine/fibonacci';
import { calculateAllWaves, validateWaveRules } from './engine/fibonacci';
import { AssetSelector } from './components/AssetSelector';
import { WaveInput } from './components/WaveInput';
import { WaveChart } from './components/WaveChart';
import { FibResults } from './components/FibResults';

function App() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [wavePoints, setWavePoints] = useState<WavePoints>({});
  const [showSidebar, setShowSidebar] = useState(true);

  const analyses = selectedAsset
    ? calculateAllWaves(wavePoints, selectedAsset.marketType)
    : [];

  const warnings = selectedAsset
    ? validateWaveRules(wavePoints, selectedAsset.marketType)
    : [];

  const isUptrend = (wavePoints.wave0 !== undefined && wavePoints.wave1 !== undefined)
    ? wavePoints.wave1 > wavePoints.wave0
    : true;

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setWavePoints({});
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/80 border-b border-gray-700/50 px-4 py-3 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                Elliott Wave Fibonacci
              </h1>
              <p className="text-xs text-gray-400">Projecoes & Retracoes - Todas as Ondas</p>
            </div>
          </div>

          {selectedAsset && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-medium text-white">{selectedAsset.name}</span>
                <div className="flex items-center gap-2 justify-end">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    selectedAsset.color === 'red'
                      ? 'bg-red-900/50 text-red-300'
                      : selectedAsset.color === 'green'
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-gray-700 text-gray-300'
                  }`}>
                    {selectedAsset.extendedWavePattern}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0 p-4 space-y-4 border-r border-gray-700/50`}>
          <AssetSelector selectedAsset={selectedAsset} onSelect={handleAssetSelect} />

          {selectedAsset && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <WaveInput points={wavePoints} onChange={setWavePoints} />
            </div>
          )}

          {/* Quick guide */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Guia Rapido</h4>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p><span className="text-emerald-400 font-medium">Onda 2:</span> Retracao 61.8%-76.2% de W1</p>
              <p><span className="text-emerald-400 font-medium">Onda 3:</span> Projecao 161.8%-200% de W1</p>
              <p><span className="text-emerald-400 font-medium">Onda 4:</span> Retracao 38.2%-50% de W3</p>
              <p><span className="text-emerald-400 font-medium">Onda 5:</span> 5=1 ou 61.8% de W3</p>
              <p><span className="text-blue-400 font-medium">Onda A:</span> Ate W4 anterior</p>
              <p><span className="text-blue-400 font-medium">Onda C:</span> 100-123% de A (ideal) / 123-161% (renda var.)</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-1 text-xs text-gray-500">
              <p><span className="text-red-400">Vermelho</span> = Renda Variavel Europeia (90% W3 ext.)</p>
              <p><span className="text-green-400">Verde</span> = Renda Variavel Americana (90% W5 ext.)</p>
              <p><span className="text-gray-300">Negro</span> = Forex/Commodity/Renda Fixa (ideal)</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 space-y-4 min-w-0">
          {!selectedAsset ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-20">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h2 className="text-xl text-gray-400">Selecione um ativo para comecar</h2>
                <p className="text-sm text-gray-500 mt-2">Escolha da lista a esquerda e insira os precos das ondas</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chart */}
              <WaveChart points={wavePoints} analyses={analyses} isUptrend={isUptrend} />

              {/* Results */}
              <FibResults analyses={analyses} warnings={warnings} />
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 px-4 py-3 text-center text-xs text-gray-500">
        Elliott Wave Fibonacci Calculator - Projecoes e Retracoes em todas as ondas
        <span className="mx-2">|</span>
        Nota: Todas as projecoes que estao perto de uma cota historica, suporte ou resistencia importante - o movimento acabara na cota, nao na projecao.
      </footer>
    </div>
  );
}

export default App;
