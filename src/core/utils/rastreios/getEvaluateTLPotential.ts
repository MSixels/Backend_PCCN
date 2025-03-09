import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTLPotential = (responses: RastreioResponse[]) => {
  let tlScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 21 && quest <= 24) {
          if (value === 1) {
              tlScores.never++;
          } else if (value === 2) {
              tlScores.sometimes++;
          } else if (value === 3) {
              tlScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = tlScores.sometimes + tlScores.always;
  let tlPotential = 'pp'; 
  if (sometimesAlwaysTotal >= 3) {
      tlPotential = 'mp';
  } else if (sometimesAlwaysTotal == 2) {
      tlPotential = 'p';
  }

  return { tlPotential };
};