export interface Turma {
  id?: string; 
  name: string;
  description: string;
  modulos: string[];
  endDate?: string
  active: boolean
  startDate: string;
  alunosCount: number;
}