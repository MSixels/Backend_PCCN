import 'dotenv/config'
import Fastify from "fastify";
import cors from "@fastify/cors";
import { turmasRoutes } from "./routes/turmasRoutes";
import { rastreiosRoutes } from './routes/rastreiosRoutes';
import { TurmasRepository } from './repositories/turmasRepository';
import { TurmasService } from './services/turmasService';
import { AppError } from './core/errors/AppError';
import { UsersRepository } from './repositories/usersRepository';
import { RastreiosRepository } from './repositories/rastreiosRepository';
import { RastreiosService } from './services/rastreiosService';
import { AuthService } from './services/authService';
import { authRoutes } from './routes/authRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { AlunoService } from './services/aluno/alunoService';
import { AlunosRepository } from './repositories/alunosRepository';

export const app = Fastify({
  logger: true, 
});

app.register(cors, {
  origin: "*", 
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({ message: error.message });
  } else {
    console.error(error);
    reply.status(500).send({ message: "Erro interno no servidor" });
  }
});

const turmasRepository = new TurmasRepository();
const usersRepository = new UsersRepository();
const rastreiosRepository = new RastreiosRepository();
const alunosRepository = new AlunosRepository();

const turmasService = new TurmasService(turmasRepository, usersRepository);
const rastreiosService = new RastreiosService(rastreiosRepository, turmasRepository, usersRepository);
const authService = new AuthService();
const alunoService = new AlunoService(alunosRepository, usersRepository)

app.register(turmasRoutes, { prefix: "/turmas", turmasService });
app.register(rastreiosRoutes, { prefix: "/rastreios", rastreiosService })
app.register(authRoutes, { prefix: "/auth", authService});
app.register(alunoRoutes, { prefix: "/alunos", alunoService})