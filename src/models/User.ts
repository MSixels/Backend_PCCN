import { EUserType } from "../enums/EUserType";

export interface User {
  avatar?: string;
  cpf: string;
  dataNascimento?: string;
  email: string
  isActive: boolean;
  matricula?: string;
  name: string;
  type: EUserType;
  userId?: string;
}