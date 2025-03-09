import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTODPotential = (responses: RastreioResponse[]) => {
  let todScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 25 && quest <= 28) {
          if (value === 1) {
              todScores.never++;
          } else if (value === 2) {
              todScores.sometimes++;
          } else if (value === 3) {
              todScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = todScores.sometimes + todScores.always;
  let todPotential = 'pp'; 
  if (sometimesAlwaysTotal >= 3) {
      todPotential = 'mp';
  } else if (sometimesAlwaysTotal == 2) {
      todPotential = 'p';
  }

  return { todPotential };
};