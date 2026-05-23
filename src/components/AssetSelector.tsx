import { useState } from 'react';
import type { Asset, MarketSection } from '../data/assets';
import { americanAssets, asianAssets, europeanAssets, cryptoAssets, sectionLabels, marketTypeLabels } from '../data/assets';

interface AssetSelectorProps {
  selectedAsset: Asset | null;
  onSelect: (asset: Asset) => void;
}

const sections: { key: MarketSection; assets: Asset[]; borderColor: string; bgColor: string }[] = [
  { key: 'american', assets: americanAssets, borderColor: 'border-green-500', bgColor: 'bg-green-900/20' },
  { key: 'european', assets: europeanAssets, borderColor: 'border-red-500', bgColor: 'bg-red-900/20' },
  { key: 'asian', assets: asianAssets, borderColor: 'border-gray-400', bgColor: 'bg-gray-700/20' },
  { key: 'crypto', assets: cryptoAssets, borderColor: 'border-yellow-500', bgColor: 'bg-yellow-900/20' },
];

export function AssetSelector({ selectedAsset, onSelect }: AssetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<MarketSection>('american');

  const currentSection = sections.find(s => s.key === activeSection)!;
  const filteredAssets = currentSection.assets.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-3">Selecionar Ativo</h3>

        {/* Section tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all ${
                activeSection === section.key
                  ? `${section.bgColor} ${section.borderColor} border text-white font-medium`
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {sectionLabels[section.key]}
              <span className="ml-1 text-gray-500">({section.assets.length})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Pesquisar ativo..."
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Asset list */}
      <div className="max-h-80 overflow-y-auto">
        {filteredAssets.map(asset => (
          <button
            key={asset.symbol}
            onClick={() => onSelect(asset)}
            className={`w-full text-left px-4 py-2.5 border-b border-gray-700/30 transition-all flex items-center justify-between ${
              selectedAsset?.symbol === asset.symbol
                ? 'bg-emerald-900/30 border-l-2 border-l-emerald-400'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <div>
              <span className="text-sm text-white font-medium">{asset.name}</span>
              <span className="ml-2 text-xs text-gray-500">{asset.symbol}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                asset.color === 'red'
                  ? 'bg-red-900/50 text-red-300'
                  : asset.color === 'green'
                    ? 'bg-green-900/50 text-green-300'
                    : 'bg-gray-700 text-gray-300'
              }`}>
                {marketTypeLabels[asset.marketType]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
