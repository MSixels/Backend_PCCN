export function getFaixaEtaria(type: number) {
  const faixas: Record<number, string> = {
    1: "ENTRE 3 E 6 ANOS",
    2: "ATÉ 8 ANOS",
    3: "ACIMA DE 8 ANOS",
  };

  return faixas[type] ?? "";
}