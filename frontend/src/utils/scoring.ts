// Heurística simple para puntuar textos del 0 al 5 según longitud.
// Puedes ajustar estos umbrales según prefieras.
export const scoreByLength = (text?: string): number => {
  const len = text?.trim().length ?? 0;
  if (len === 0) return 0;       // vacío -> 0
  if (len < 20) return 1;
  if (len < 50) return 2;
  if (len < 100) return 3;
  if (len < 200) return 4;
  return 5;
};

// Normaliza promedio (0..maxScore) a porcentaje (0..100)
export const normalizeTo100 = (avgScore: number, maxScore = 5): number => {
  if (maxScore === 0) return 0;
  return Math.round((avgScore / maxScore) * 100);
};
