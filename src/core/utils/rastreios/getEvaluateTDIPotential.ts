import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTDIPotential = (responses: RastreioResponse[]) => {
  let tdiScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 29 && quest <= 32) {
          if (value === 1) {
              tdiScores.never++;
          } else if (value === 2) {
              tdiScores.sometimes++;
          } else if (value === 3) {
              tdiScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = tdiScores.sometimes + tdiScores.always;
  let tdiPotential = 'pp'; 
  if (sometimesAlwaysTotal >= 3) {
      tdiPotential = 'mp';
  } else if (sometimesAlwaysTotal == 2) {
      tdiPotential = 'p';
  }

  return { tdiPotential };
};