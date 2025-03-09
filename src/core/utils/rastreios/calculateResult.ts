import { Rastreio } from "../../../models/Rastreio";
import { evaluateTDAHPotential } from "./getEvaluateTDAHPotential";
import { evaluateTDIPotential } from "./getEvaluateTDIPotential";
import { evaluateTEAPotential } from "./getEvaluateTEAPotential";
import { evaluateTEAPPotential } from "./getEvaluateTEAPPotential";
import { evaluateTLPotential } from "./getEvaluateTLPotential";
import { evaluateTODPotential } from "./getEvaluateTODPotential";

export function evaluateStatusCrianca(rastreio: Rastreio): string {
  const evaluationFunctions = [
      evaluateTDAHPotential,
      evaluateTEAPotential,
      evaluateTEAPPotential,
      evaluateTLPotential,
      evaluateTODPotential,
      evaluateTDIPotential
  ];

  const potentials = evaluationFunctions.map(fn => fn(rastreio.responses)).map(result => Object.values(result)[0]);

  const statusCrianca = potentials.some(p => p === 'mp') ? 'mp' 
                      : potentials.some(p => p === 'p')  ? 'p' 
                      : 'pp';

  switch (statusCrianca) {
      case 'mp': return 'Alto risco potencial de transtorno do neurodesenvolvimento';
      case 'p': return 'Médio risco potencial de transtorno do neurodesenvolvimento';
      case 'pp': return 'Baixo risco potencial de transtorno do neurodesenvolvimento'
      default: return '';
  }
}