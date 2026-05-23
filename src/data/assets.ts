export type MarketType = 'european_equity' | 'american_equity' | 'asian_equity' | 'forex' | 'commodity' | 'crypto' | 'fixed_income';
export type MarketSection = 'american' | 'european' | 'asian' | 'crypto';

export interface Asset {
  symbol: string;
  name: string;
  section: MarketSection;
  marketType: MarketType;
  color: 'black' | 'red' | 'green';
  extendedWavePattern: string;
}

function getColorAndPattern(marketType: MarketType): { color: 'black' | 'red' | 'green'; extendedWavePattern: string } {
  switch (marketType) {
    case 'european_equity':
      return { color: 'red', extendedWavePattern: '90% Onda 3 extendida' };
    case 'american_equity':
      return { color: 'green', extendedWavePattern: '90% Onda 5 extendida' };
    case 'asian_equity':
      return { color: 'black', extendedWavePattern: '50% Nao extendida / 50% Onda 3 ou 5 extendida' };
    case 'forex':
      return { color: 'black', extendedWavePattern: 'Onda Elliott ideal (classica)' };
    case 'commodity':
      return { color: 'black', extendedWavePattern: 'Onda Elliott ideal (classica)' };
    case 'crypto':
      return { color: 'green', extendedWavePattern: '90% Onda 5 extendida (alta volatilidade)' };
    case 'fixed_income':
      return { color: 'black', extendedWavePattern: 'Onda Elliott ideal (classica)' };
  }
}

function createAsset(symbol: string, name: string, section: MarketSection, marketType: MarketType): Asset {
  const { color, extendedWavePattern } = getColorAndPattern(marketType);
  return { symbol, name, section, marketType, color, extendedWavePattern };
}

export const americanAssets: Asset[] = [
  createAsset('BTC/USD', 'Bitcoin ($1)', 'american', 'crypto'),
  createAsset('WALL_ST', 'Wall Street Cash (1EUR)', 'american', 'american_equity'),
  createAsset('NASDAQ', 'EEUU Tech 100 Cash (1EUR)', 'american', 'american_equity'),
  createAsset('DXY', 'Cesta del Dolar Americano', 'american', 'forex'),
  createAsset('SP500', 'EEUU 500 Cash (1EUR)', 'american', 'american_equity'),
  createAsset('CRUDE_EUR', 'Crudo EE.UU. (1EUR)', 'american', 'commodity'),
  createAsset('CRUDE_USD', 'Crudo EE.UU. (1$)', 'american', 'commodity'),
  createAsset('SILVER', 'Plata Contado (mini, 500)', 'american', 'commodity'),
  createAsset('NATGAS', 'Gas Natural (1EUR)', 'american', 'commodity'),
  createAsset('GOLD', 'Oro Cash (1EUR)', 'american', 'commodity'),
  createAsset('ETH/USD', 'Ether (E1)', 'american', 'crypto'),
  createAsset('RUSSELL', 'US Russell 2000 Cash', 'american', 'american_equity'),
  createAsset('USD/JPY', 'USD/JPY Mini', 'american', 'forex'),
  createAsset('CAD/JPY', 'CAD/JPY Mini', 'american', 'forex'),
  createAsset('GBP/MXN', 'GBP/MXN Mini', 'american', 'forex'),
  createAsset('EUR/MXN', 'EUR/MXN Mini', 'american', 'forex'),
  createAsset('USD/CZK', 'USD/CZK Mini', 'american', 'forex'),
  createAsset('USD/MXN', 'USD/MXN Mini', 'american', 'forex'),
  createAsset('MXN/JPY', 'MXN/JPY Mini', 'american', 'forex'),
  createAsset('GBP/CAD', 'GBP/CAD Mini', 'american', 'forex'),
  createAsset('EUR/CAD', 'EUR/CAD Mini', 'american', 'forex'),
  createAsset('USD/CAD', 'USD/CAD Mini', 'american', 'forex'),
  createAsset('GBP/USD', 'GBP/USD Mini', 'american', 'forex'),
  createAsset('EUR/USD', 'EUR/USD Mini', 'american', 'forex'),
  createAsset('AUD/CAD', 'AUD/CAD Mini', 'american', 'forex'),
  createAsset('USD/CHF', 'USD/CHF Mini', 'american', 'forex'),
  createAsset('NZD/CAD', 'NZD/CAD Mini', 'american', 'forex'),
  createAsset('AUD/USD', 'AUD/USD Mini', 'american', 'forex'),
  createAsset('CAD/CHF', 'CAD/CHF Mini', 'american', 'forex'),
  createAsset('NZD/USD', 'NZD/USD Mini', 'american', 'forex'),
];

export const asianAssets: Asset[] = [
  createAsset('NIKKEI', 'Japon 225 Cash (1$)', 'asian', 'asian_equity'),
  createAsset('ASX200', 'Australia 200 Cash (5A$)', 'asian', 'asian_equity'),
  createAsset('SGX', 'Singapur Blue Chip Cash', 'asian', 'asian_equity'),
  createAsset('GBP/JPY_A', 'GBP/JPY Mini', 'asian', 'forex'),
  createAsset('CHF/JPY', 'CHF/JPY Mini', 'asian', 'forex'),
  createAsset('EUR/JPY', 'EUR/JPY Mini', 'asian', 'forex'),
  createAsset('USD/JPY_A', 'USD/JPY Mini', 'asian', 'forex'),
  createAsset('CAD/JPY_A', 'CAD/JPY Mini', 'asian', 'forex'),
  createAsset('AUD/JPY', 'AUD/JPY Mini', 'asian', 'forex'),
  createAsset('NZD/JPY', 'NZD/JPY Mini', 'asian', 'forex'),
  createAsset('NIFTY50', 'India Nifty 50 Equ', 'asian', 'asian_equity'),
  createAsset('USD/HKD', 'USD/HKD Mini', 'asian', 'forex'),
  createAsset('GBP/NZD_A', 'GBP/NZD Mini', 'asian', 'forex'),
  createAsset('EUR/NZD', 'EUR/NZD Mini', 'asian', 'forex'),
  createAsset('GBP/AUD', 'GBP/AUD Mini', 'asian', 'forex'),
  createAsset('EUR/AUD', 'EUR/AUD Mini', 'asian', 'forex'),
  createAsset('AUD/CAD_A', 'AUD/CAD Mini', 'asian', 'forex'),
  createAsset('NZD/AUD', 'NZD/AUD Mini', 'asian', 'forex'),
  createAsset('NZD/CAD_A', 'NZD/CAD Mini', 'asian', 'forex'),
  createAsset('AUD/USD_A', 'AUD/USD Mini', 'asian', 'forex'),
  createAsset('NZD/USD_A', 'NZD/USD Mini', 'asian', 'forex'),
  createAsset('AUD/CHF', 'AUD/CHF Mini', 'asian', 'forex'),
  createAsset('NZD/CHF', 'NZD/CHF Mini', 'asian', 'forex'),
];

export const europeanAssets: Asset[] = [
  createAsset('BTC/GBP', 'Bitcoin (GBP1)', 'european', 'crypto'),
  createAsset('FTMIB', 'Italia 40 Cash (1EUR)', 'european', 'european_equity'),
  createAsset('DAX', 'Alemania 40 Cash (1EUR)', 'european', 'european_equity'),
  createAsset('IBEX', 'Espana 35 Cash (1EUR)', 'european', 'european_equity'),
  createAsset('SMI', 'Suiza Blue Chip Cash (2)', 'european', 'european_equity'),
  createAsset('FTSE', 'FTSE 100 Cash (1EUR)', 'european', 'european_equity'),
  createAsset('CAC', 'Francia 40 Cash (1EUR)', 'european', 'european_equity'),
  createAsset('STOXX50', 'EU Stocks 50 Cash (2EUR)', 'european', 'european_equity'),
  createAsset('SILVER_EU', 'Plata Contado (5000 oz)', 'european', 'commodity'),
  createAsset('GOLD_EU', 'Oro Cash (1EUR)', 'european', 'commodity'),
  createAsset('ETH/USD_EU', 'Ether ($1)', 'european', 'crypto'),
  createAsset('GBP/HUF', 'GBP/HUF Mini', 'european', 'forex'),
  createAsset('GBP/JPY_EU', 'GBP/JPY Mini', 'european', 'forex'),
  createAsset('CHF/JPY_EU', 'CHF/JPY Mini', 'european', 'forex'),
  createAsset('EUR/JPY_EU', 'EUR/JPY Mini', 'european', 'forex'),
  createAsset('GBP/CZK', 'GBP/CZK Mini', 'european', 'forex'),
  createAsset('EUR/CZK', 'EUR/CZK Mini', 'european', 'forex'),
  createAsset('GBP/MXN_EU', 'GBP/MXN Mini', 'european', 'forex'),
  createAsset('GBP/ZAR', 'GBP/ZAR Mini', 'european', 'forex'),
  createAsset('GBP/NOK', 'GBP/NOK Mini', 'european', 'forex'),
  createAsset('GBP/SEK', 'GBP/SEK Mini', 'european', 'forex'),
  createAsset('EUR/NOK', 'EUR/NOK Mini', 'european', 'forex'),
  createAsset('EUR/SEK', 'EUR/SEK Mini', 'european', 'forex'),
  createAsset('USD/SEK', 'USD/SEK Mini', 'european', 'forex'),
  createAsset('GBP/DKK', 'GBP/DKK Mini', 'european', 'forex'),
  createAsset('EUR/DKK', 'EUR/DKK Mini', 'european', 'forex'),
  createAsset('USD/DKK', 'USD/DKK Mini', 'european', 'forex'),
  createAsset('GBP/NZD_EU', 'GBP/NZD Mini', 'european', 'forex'),
  createAsset('EUR/NZD_EU', 'EUR/NZD Mini', 'european', 'forex'),
  createAsset('GBP/AUD_EU', 'GBP/AUD Mini', 'european', 'forex'),
  createAsset('GBP/CAD_EU', 'GBP/CAD Mini', 'european', 'forex'),
  createAsset('EUR/AUD_EU', 'EUR/AUD Mini', 'european', 'forex'),
  createAsset('EUR/CAD_EU', 'EUR/CAD Mini', 'european', 'forex'),
  createAsset('GBP/USD_EU', 'GBP/USD Mini', 'european', 'forex'),
  createAsset('EUR/USD_EU', 'EUR/USD Mini', 'european', 'forex'),
  createAsset('GBP/CHF', 'GBP/CHF Mini', 'european', 'forex'),
  createAsset('NOK/SEK', 'NOK/SEK Mini', 'european', 'forex'),
  createAsset('EUR/CHF', 'EUR/CHF Mini', 'european', 'forex'),
  createAsset('EUR/GBP', 'EUR/GBP Mini', 'european', 'forex'),
  createAsset('USD/CHF_EU', 'USD/CHF Mini', 'european', 'forex'),
  createAsset('CAD/CHF_EU', 'CAD/CHF Mini', 'european', 'forex'),
  createAsset('AUD/CHF_EU', 'AUD/CHF Mini', 'european', 'forex'),
  createAsset('NZD/CHF_EU', 'NZD/CHF Mini', 'european', 'forex'),
];

export const cryptoAssets: Asset[] = [
  createAsset('BTC/USD_C', 'Bitcoin (BTC/USD)', 'crypto', 'crypto'),
  createAsset('ETH/USD_C', 'Ethereum (ETH/USD)', 'crypto', 'crypto'),
  createAsset('BNB/USD', 'Binance Coin (BNB/USD)', 'crypto', 'crypto'),
  createAsset('SOL/USD', 'Solana (SOL/USD)', 'crypto', 'crypto'),
  createAsset('XRP/USD', 'Ripple (XRP/USD)', 'crypto', 'crypto'),
  createAsset('ADA/USD', 'Cardano (ADA/USD)', 'crypto', 'crypto'),
  createAsset('DOGE/USD', 'Dogecoin (DOGE/USD)', 'crypto', 'crypto'),
  createAsset('DOT/USD', 'Polkadot (DOT/USD)', 'crypto', 'crypto'),
  createAsset('AVAX/USD', 'Avalanche (AVAX/USD)', 'crypto', 'crypto'),
  createAsset('LINK/USD', 'Chainlink (LINK/USD)', 'crypto', 'crypto'),
  createAsset('MATIC/USD', 'Polygon (MATIC/USD)', 'crypto', 'crypto'),
  createAsset('UNI/USD', 'Uniswap (UNI/USD)', 'crypto', 'crypto'),
  createAsset('LTC/USD', 'Litecoin (LTC/USD)', 'crypto', 'crypto'),
  createAsset('ATOM/USD', 'Cosmos (ATOM/USD)', 'crypto', 'crypto'),
  createAsset('FIL/USD', 'Filecoin (FIL/USD)', 'crypto', 'crypto'),
  createAsset('NEAR/USD', 'NEAR Protocol (NEAR/USD)', 'crypto', 'crypto'),
  createAsset('TRX/USD', 'Tron (TRX/USD)', 'crypto', 'crypto'),
  createAsset('SUI/USD', 'Sui (SUI/USD)', 'crypto', 'crypto'),
  createAsset('SHIB/USD', 'Shiba Inu (SHIB/USD)', 'crypto', 'crypto'),
  createAsset('PEPE/USD', 'Pepe (PEPE/USD)', 'crypto', 'crypto'),
];

export const allAssets: Asset[] = [
  ...americanAssets,
  ...asianAssets,
  ...europeanAssets,
  ...cryptoAssets,
];

export const sectionLabels: Record<MarketSection, string> = {
  american: 'Seccao Americana',
  european: 'Seccao Europeia',
  asian: 'Seccao Asiatica',
  crypto: 'Criptomoedas',
};

export const marketTypeLabels: Record<MarketType, string> = {
  european_equity: 'Renda Variavel Europeia',
  american_equity: 'Renda Variavel Americana',
  asian_equity: 'Renda Variavel Asiatica',
  forex: 'Forex',
  commodity: 'Commodity',
  crypto: 'Criptomoeda',
  fixed_income: 'Renda Fixa',
};
