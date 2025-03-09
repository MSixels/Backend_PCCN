import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTEAPotential = (responses: RastreioResponse[]) => {
  let teaScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 9 && quest <= 16) {
          if (value === 1) {
              teaScores.never++;
          } else if (value === 2) {
              teaScores.sometimes++;
          } else if (value === 3) {
              teaScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = teaScores.sometimes + teaScores.always;
  let teaPotential = 'pp'; 
  if (sometimesAlwaysTotal >= 6) {
      teaPotential = 'mp';
  } else if (sometimesAlwaysTotal >= 4) {
      teaPotential = 'p';
  }

  return { teaPotential };
};