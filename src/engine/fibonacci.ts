import type { MarketType } from '../data/assets';

export interface WavePoints {
  wave0?: number; // Start of wave 1
  wave1?: number; // End of wave 1 / Start of wave 2
  wave2?: number; // End of wave 2 / Start of wave 3
  wave3?: number; // End of wave 3 / Start of wave 4
  wave4?: number; // End of wave 4 / Start of wave 5
  wave5?: number; // End of wave 5
  waveA?: number; // End of wave A
  waveB?: number; // End of wave B
  waveC?: number; // End of wave C
}

export interface FibLevel {
  level: number;
  label: string;
  price: number;
  type: 'retracement' | 'projection';
  importance: 'primary' | 'secondary' | 'extended';
  description: string;
}

export interface WaveAnalysis {
  waveName: string;
  direction: 'up' | 'down';
  levels: FibLevel[];
  rules: string[];
}

const RETRACEMENT_LEVELS = [0.236, 0.382, 0.5, 0.618, 0.764, 0.786, 1.0];
function calcRetracement(start: number, end: number, level: number): number {
  return end - (end - start) * level;
}

function calcProjection(start: number, end: number, retrace: number, level: number): number {
  const impulseSize = Math.abs(end - start);
  const direction = end > start ? 1 : -1;
  return retrace + direction * impulseSize * level;
}

export function calculateWave2Targets(wave0: number, wave1: number): WaveAnalysis {
  const isUptrend = wave1 > wave0;
  const levels: FibLevel[] = [];

  const primaryLevels = [0.618, 0.764];
  const secondaryLevels = [0.382, 0.5, 0.786];

  for (const lvl of RETRACEMENT_LEVELS) {
    const price = calcRetracement(wave0, wave1, lvl);
    const importance = primaryLevels.includes(lvl) ? 'primary' : secondaryLevels.includes(lvl) ? 'secondary' : 'extended';
    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}%`,
      price: parseFloat(price.toFixed(5)),
      type: 'retracement',
      importance,
      description: `Retracao ${(lvl * 100).toFixed(1)}% da Onda 1`,
    });
  }

  return {
    waveName: 'Onda 2',
    direction: isUptrend ? 'down' : 'up',
    levels,
    rules: [
      'Zona ideal: 61.8% a 76.2% da Onda 1',
      'Nao pode ultrapassar o inicio da Onda 1 (wave0)',
      'Soma da Onda 2 + Onda 4 (retracao) = 95% => entre 100% e 110%',
    ],
  };
}

export function calculateWave3Targets(wave0: number, wave1: number, wave2: number, marketType: MarketType): WaveAnalysis {
  const isUptrend = wave1 > wave0;
  const levels: FibLevel[] = [];

  const projLevels = [
    { lvl: 1.0, importance: 'secondary' as const, desc: '100% projecao (W3 = W1)' },
    { lvl: 1.236, importance: 'secondary' as const, desc: '123.2% projecao' },
    { lvl: 1.618, importance: 'primary' as const, desc: '161.8% projecao (objetivo principal)' },
    { lvl: 2.0, importance: 'primary' as const, desc: '200% projecao' },
    { lvl: 2.618, importance: 'extended' as const, desc: '261.8% projecao (extendida)' },
    { lvl: 3.618, importance: 'extended' as const, desc: '361.8% projecao' },
    { lvl: 4.236, importance: 'extended' as const, desc: '423.6% projecao (dupla extendida)' },
  ];

  for (const { lvl, importance, desc } of projLevels) {
    const price = calcProjection(wave0, wave1, wave2, lvl);
    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}%`,
      price: parseFloat(price.toFixed(5)),
      type: 'projection',
      importance,
      description: desc,
    });
  }

  const rules: string[] = [
    'Zona ideal: 161.8% a 200% da Onda 1 projetada desde Onda 2',
    'Sub-niveis: 123.2% a 161.8%',
    'Onda 3 NUNCA pode ser a mais curta das ondas 1, 3 e 5',
  ];

  if (marketType === 'european_equity') {
    rules.push('RENDA VARIAVEL EUROPEIA: 90% das vezes a Onda 3 e a extendida');
  } else if (marketType === 'asian_equity') {
    rules.push('RENDA VARIAVEL ASIATICA: 50% probabilidade de Onda 3 extendida');
  }

  return {
    waveName: 'Onda 3',
    direction: isUptrend ? 'up' : 'down',
    levels,
    rules,
  };
}

export function calculateWave4Targets(wave0: number, wave1: number, wave2: number, wave3: number): WaveAnalysis {
  const isUptrend = wave1 > wave0;
  const levels: FibLevel[] = [];

  const primaryLevels = [0.382, 0.5];
  const secondaryLevels = [0.236, 0.618];

  for (const lvl of RETRACEMENT_LEVELS.filter(l => l <= 0.618)) {
    const price = calcRetracement(wave2, wave3, lvl);
    const importance = primaryLevels.includes(lvl) ? 'primary' : secondaryLevels.includes(lvl) ? 'secondary' : 'extended';
    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}%`,
      price: parseFloat(price.toFixed(5)),
      type: 'retracement',
      importance,
      description: `Retracao ${(lvl * 100).toFixed(1)}% da Onda 3`,
    });
  }

  // Check if wave4 would overlap with wave1
  const wave4AtFib618 = calcRetracement(wave2, wave3, 0.618);
  const overlapsWave1 = isUptrend ? wave4AtFib618 < wave1 : wave4AtFib618 > wave1;

  const rules = [
    'Zona ideal: 38.2% a 50% da Onda 3',
    'Maximo pluma: 61% (pavio pode tocar mas corpo nao deve fechar alem)',
    'Soma de Onda 2 + Onda 4 (retracao) = 95% => entre 100% e 110%',
  ];

  if (overlapsWave1) {
    rules.push('ATENCAO: Nivel 61.8% sobrepoe o topo da Onda 1 (invalido em impulso classico)');
  }

  return {
    waveName: 'Onda 4',
    direction: isUptrend ? 'down' : 'up',
    levels,
    rules,
  };
}

export function calculateWave5Targets(
  wave0: number, wave1: number, wave2: number, wave3: number, wave4: number,
  marketType: MarketType
): WaveAnalysis {
  const isUptrend = wave1 > wave0;
  const levels: FibLevel[] = [];
  const wave1Size = Math.abs(wave1 - wave0);
  const wave3Size = Math.abs(wave3 - wave2);
  const direction = isUptrend ? 1 : -1;

  // W5 = W1 (100%)
  levels.push({
    level: 1.0,
    label: '5=1 (100%)',
    price: parseFloat((wave4 + direction * wave1Size).toFixed(5)),
    type: 'projection',
    importance: 'primary',
    description: 'Onda 5 = Onda 1 (igualdade)',
  });

  // W5 = 61.8% of W1
  levels.push({
    level: 0.618,
    label: '61.8% de W1',
    price: parseFloat((wave4 + direction * wave1Size * 0.618).toFixed(5)),
    type: 'projection',
    importance: 'primary',
    description: 'Onda 5 = 61.8% da Onda 1',
  });

  // W5 = 76.2% of W1
  levels.push({
    level: 0.762,
    label: '76.2% de W1',
    price: parseFloat((wave4 + direction * wave1Size * 0.762).toFixed(5)),
    type: 'projection',
    importance: 'secondary',
    description: 'Onda 5 = 76.2% da Onda 1',
  });

  // W5 = 61.8% of W3
  levels.push({
    level: 0.618,
    label: '61.8% de W3',
    price: parseFloat((wave4 + direction * wave3Size * 0.618).toFixed(5)),
    type: 'projection',
    importance: 'primary',
    description: 'Onda 5 = 61.8% da Onda 3',
  });

  // Extended wave 5 targets
  // W5 = 161.8% of W1
  levels.push({
    level: 1.618,
    label: '161.8% de W1',
    price: parseFloat((wave4 + direction * wave1Size * 1.618).toFixed(5)),
    type: 'projection',
    importance: 'extended',
    description: 'Onda 5 extendida = 161.8% da Onda 1',
  });

  // W5 = 261.8% (extended from wave 0 to wave 3)
  const wave03Size = Math.abs(wave3 - wave0);
  levels.push({
    level: 2.618,
    label: '261% extendida',
    price: parseFloat((wave4 + direction * wave03Size * 0.618).toFixed(5)),
    type: 'projection',
    importance: 'extended',
    description: 'Onda 5 extendida 261%',
  });

  // W5 projection using Fib of entire wave 0-3 from wave 4
  for (const lvl of [0.618, 0.764, 1.0, 1.618]) {
    const projPrice = calcProjection(wave0, wave3, wave4, lvl);
    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}% (W0-W3)`,
      price: parseFloat(projPrice.toFixed(5)),
      type: 'projection',
      importance: lvl === 0.618 || lvl === 1.0 ? 'primary' : 'secondary',
      description: `Projecao ${(lvl * 100).toFixed(1)}% do movimento W0-W3 desde W4`,
    });
  }

  // Remove duplicate prices
  const seen = new Set<number>();
  const uniqueLevels = levels.filter(l => {
    const key = Math.round(l.price * 100000);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const rules: string[] = [
    'Alvos primarios: 5=1 (igualdade) ou 5 = 61.8% de W3',
    'Zona: 61.8% a 76.2% da Onda 1',
  ];

  if (marketType === 'american_equity') {
    rules.push('RENDA VARIAVEL AMERICANA: 90% das vezes a Onda 5 e a extendida');
    rules.push('Considerar alvos de 161.8% e 261% como mais provaveis');
  } else if (marketType === 'crypto') {
    rules.push('CRIPTO: Alta volatilidade - Onda 5 frequentemente extendida');
    rules.push('Alvos extendidos (261%, 423%) sao mais frequentes');
  } else if (marketType === 'asian_equity') {
    rules.push('RENDA VARIAVEL ASIATICA: 50% probabilidade de Onda 5 extendida');
  }

  return {
    waveName: 'Onda 5',
    direction: isUptrend ? 'up' : 'down',
    levels: uniqueLevels.sort((a, b) => isUptrend ? a.price - b.price : b.price - a.price),
    rules,
  };
}

export function calculateWaveATargets(wave3: number, wave4: number, wave5: number): WaveAnalysis {
  const isDownCorrection = wave5 > wave3;
  const levels: FibLevel[] = [];

  // Wave A typically goes to wave 4 of previous impulse
  levels.push({
    level: 0,
    label: 'Onda 4 anterior',
    price: parseFloat(wave4.toFixed(5)),
    type: 'retracement',
    importance: 'primary',
    description: 'Onda A ate a Onda 4 do impulso anterior',
  });

  // Retracements of wave 5
  for (const lvl of [0.382, 0.5, 0.618, 0.764, 1.0]) {
    const price = calcRetracement(wave4, wave5, lvl);
    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}% de W5`,
      price: parseFloat(price.toFixed(5)),
      type: 'retracement',
      importance: lvl === 0.618 || lvl === 0.382 ? 'primary' : 'secondary',
      description: `Retracao ${(lvl * 100).toFixed(1)}% da Onda 5`,
    });
  }

  return {
    waveName: 'Onda A',
    direction: isDownCorrection ? 'down' : 'up',
    levels,
    rules: [
      'Onda A tipicamente vai ate a Onda 4 do impulso anterior',
      '98% de probabilidade de correcao na Onda 2 do ciclo',
      '75% de probabilidade de correcao na Onda 4 do ciclo',
      'Correcao = continuacao de impulso (falamos de correcao = continuacao)',
    ],
  };
}

export function calculateWaveBTargets(wave5: number, waveA: number): WaveAnalysis {
  const isUpCorrection = waveA < wave5;
  const levels: FibLevel[] = [];

  for (const lvl of [0.382, 0.5, 0.618, 0.764, 0.786, 1.0]) {
    const price = calcRetracement(waveA, wave5, lvl);
    levels.push({
      level: 1 - lvl,
      label: `${(lvl * 100).toFixed(1)}%`,
      price: parseFloat(price.toFixed(5)),
      type: 'retracement',
      importance: lvl === 0.5 || lvl === 0.618 ? 'primary' : 'secondary',
      description: `Retracao ${(lvl * 100).toFixed(1)}% da Onda A`,
    });
  }

  return {
    waveName: 'Onda B',
    direction: isUpCorrection ? 'up' : 'down',
    levels,
    rules: [
      'Onda B retrai parte da Onda A',
      'Niveis tipicos: 50% a 78.6% da Onda A',
      'Pode fazer uma correcao simples ou complexa',
    ],
  };
}

export function calculateWaveCTargets(wave5: number, waveA: number, waveB: number, marketType: MarketType): WaveAnalysis {
  const isDownCorrection = waveA < wave5;
  const waveASize = Math.abs(wave5 - waveA);
  const direction = isDownCorrection ? -1 : 1;
  const levels: FibLevel[] = [];

  // Ideal Elliott: C = 100% to 123% of A
  for (const lvl of [1.0, 1.236, 1.382, 1.618, 2.618]) {
    const price = parseFloat((waveB + direction * waveASize * lvl).toFixed(5));
    let importance: 'primary' | 'secondary' | 'extended' = 'secondary';
    let desc = '';

    if (lvl === 1.0) {
      importance = 'primary';
      desc = 'C = 100% de A (Elliott ideal)';
    } else if (lvl === 1.236) {
      importance = marketType === 'forex' || marketType === 'commodity' ? 'primary' : 'primary';
      desc = 'C = 123% de A';
    } else if (lvl === 1.382) {
      importance = 'secondary';
      desc = 'C = 138.2% de A';
    } else if (lvl === 1.618) {
      importance = marketType === 'european_equity' || marketType === 'american_equity' ? 'primary' : 'secondary';
      desc = 'C = 161.8% de A (renda variavel)';
    } else if (lvl === 2.618) {
      importance = 'extended';
      desc = 'C = 261.8% de A (onda A muito pequena)';
    }

    levels.push({
      level: lvl,
      label: `${(lvl * 100).toFixed(1)}%`,
      price,
      type: 'projection',
      importance,
      description: desc,
    });
  }

  const rules: string[] = [];

  if (marketType === 'forex' || marketType === 'commodity' || marketType === 'fixed_income') {
    rules.push('Elliott Ideal: C = 100% a 123% de A');
  }
  if (marketType === 'european_equity' || marketType === 'american_equity') {
    rules.push('Renda Variavel: C = 123% a 161% de A');
  }

  rules.push('Se Onda A muito pequena: C chega a 261%');
  rules.push('Se Onda A muito grande: C deve (1) fazer minimo abaixo de A e (2) chegar a zona 61.8%-100% de A');
  rules.push('Resto correcoes: 90% Figuras, 10% Correcoes');

  return {
    waveName: 'Onda C',
    direction: isDownCorrection ? 'down' : 'up',
    levels: levels.sort((a, b) => isDownCorrection ? b.price - a.price : a.price - b.price),
    rules,
  };
}

export function calculateAllWaves(points: WavePoints, marketType: MarketType): WaveAnalysis[] {
  const analyses: WaveAnalysis[] = [];

  if (points.wave0 !== undefined && points.wave1 !== undefined) {
    analyses.push(calculateWave2Targets(points.wave0, points.wave1));
  }

  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined) {
    analyses.push(calculateWave3Targets(points.wave0, points.wave1, points.wave2, marketType));
  }

  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined && points.wave3 !== undefined) {
    analyses.push(calculateWave4Targets(points.wave0, points.wave1, points.wave2, points.wave3));
  }

  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined && points.wave3 !== undefined && points.wave4 !== undefined) {
    analyses.push(calculateWave5Targets(points.wave0, points.wave1, points.wave2, points.wave3, points.wave4, marketType));
  }

  if (points.wave3 !== undefined && points.wave4 !== undefined && points.wave5 !== undefined) {
    analyses.push(calculateWaveATargets(points.wave3, points.wave4, points.wave5));
  }

  if (points.wave5 !== undefined && points.waveA !== undefined) {
    analyses.push(calculateWaveBTargets(points.wave5, points.waveA));
  }

  if (points.wave5 !== undefined && points.waveA !== undefined && points.waveB !== undefined) {
    analyses.push(calculateWaveCTargets(points.wave5, points.waveA, points.waveB, marketType));
  }

  return analyses;
}

export function validateWaveRules(points: WavePoints, marketType: MarketType): string[] {
  const warnings: string[] = [];

  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined) {
    const isUp = points.wave1 > points.wave0;
    if (isUp && points.wave2 < points.wave0) {
      warnings.push('INVALIDO: Onda 2 ultrapassou o inicio da Onda 1');
    }
    if (!isUp && points.wave2 > points.wave0) {
      warnings.push('INVALIDO: Onda 2 ultrapassou o inicio da Onda 1');
    }
  }

  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined && points.wave3 !== undefined) {
    const w1 = Math.abs(points.wave1 - points.wave0);
    const w3 = Math.abs(points.wave3 - points.wave2);
    if (points.wave4 !== undefined && points.wave5 !== undefined) {
      const w5 = Math.abs(points.wave5 - points.wave4);
      if (w3 < w1 && w3 < w5) {
        warnings.push('INVALIDO: Onda 3 e a mais curta (nunca pode ser a mais curta)');
      }
    }
  }

  if (points.wave1 !== undefined && points.wave3 !== undefined && points.wave4 !== undefined) {
    const isUp = points.wave3 > points.wave1;
    if (isUp && points.wave4 < points.wave1) {
      warnings.push('ATENCAO: Onda 4 sobrepoe Onda 1 (invalido em impulso classico)');
    }
    if (!isUp && points.wave4 > points.wave1) {
      warnings.push('ATENCAO: Onda 4 sobrepoe Onda 1 (invalido em impulso classico)');
    }
  }

  // Check wave 2 + wave 4 retracement sum rule
  if (points.wave0 !== undefined && points.wave1 !== undefined && points.wave2 !== undefined && points.wave3 !== undefined && points.wave4 !== undefined) {
    const w1Range = Math.abs(points.wave1 - points.wave0);
    const w2Retrace = Math.abs(points.wave1 - points.wave2) / w1Range;
    const w3Range = Math.abs(points.wave3 - points.wave2);
    const w4Retrace = Math.abs(points.wave3 - points.wave4) / w3Range;
    const sum = (w2Retrace + w4Retrace) * 100;

    if (sum < 80 || sum > 120) {
      warnings.push(`Soma das retracoes W2+W4 = ${sum.toFixed(1)}% (ideal: 95% => entre 100% e 110%)`);
    }
  }

  if (marketType === 'european_equity') {
    warnings.push('INFO: Renda Variavel Europeia - 90% das vezes a Onda 3 e extendida');
  } else if (marketType === 'american_equity') {
    warnings.push('INFO: Renda Variavel Americana - 90% das vezes a Onda 5 e extendida');
  } else if (marketType === 'asian_equity') {
    warnings.push('INFO: Renda Variavel Asiatica - 50% nao extendida, 50% extendida (W3 ou W5)');
  } else if (marketType === 'crypto') {
    warnings.push('INFO: Cripto - Comportamento similar a commodities com alta volatilidade');
  }

  return warnings;
}
