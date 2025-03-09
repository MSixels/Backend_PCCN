import { RastreioResponse } from "../../../models/Rastreio";

export const evaluateTDAHPotential = (responses: RastreioResponse[]) => {
  let tdahScores = { never: 0, sometimes: 0, always: 0 };

  responses.forEach(response => {
      const { quest, value } = response;

      if (quest >= 1 && quest <= 8) {
          if (value === 1) {
              tdahScores.never++;
          } else if (value === 2) {
              tdahScores.sometimes++;
          } else if (value === 3) {
              tdahScores.always++;
          }
      }
  });

  const sometimesAlwaysTotal = tdahScores.sometimes + tdahScores.always;
  let tdahPotential = 'pp';
  if (sometimesAlwaysTotal >= 6) {
      tdahPotential = 'mp';
  } else if (sometimesAlwaysTotal >= 4) {
      tdahPotential = 'p';
  }

  return { tdahPotential };
};