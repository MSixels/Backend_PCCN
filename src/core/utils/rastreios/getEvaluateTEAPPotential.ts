import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTEAPPotential = (responses: RastreioResponse[]) => {
  let teapScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 17 && quest <= 20) {
          if (value === 1) {
              teapScores.never++;
          } else if (value === 2) {
              teapScores.sometimes++;
          } else if (value === 3) {
              teapScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = teapScores.sometimes + teapScores.always;
  let teapPotential = 'pp'; 
  if (sometimesAlwaysTotal >= 3) {
      teapPotential = 'mp';
  } else if (sometimesAlwaysTotal == 2) {
      teapPotential = 'p';
  }

  return { teapPotential };
};