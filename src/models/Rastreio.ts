import { Timestamp } from "firebase-admin/firestore";

export interface Rastreio {
  comentario: string;
  createdAt: Timestamp;
  id: string;
  patient: string;
  responses: RastreioResponse[]
  school: string
  typeQuest: number
  userId: string
}

export interface RastreioResponse {
  id: number;
  quest: number;
  value: number;
}