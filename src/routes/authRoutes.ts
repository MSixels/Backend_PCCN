import { FastifyInstance } from "fastify";
import { AuthService } from "../services/authService";

export async function authRoutes(app: FastifyInstance, opts: { authService: AuthService }) {
  const { authService } = opts;

}