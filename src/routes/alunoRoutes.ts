import { FastifyInstance } from "fastify";
import { AlunoService } from "../services/aluno/alunoService";
import { adminCreateAluno } from "../controllers/alunos/alunoController";

export async function alunoRoutes(app: FastifyInstance, opts: { alunoService: AlunoService }) {
    const { alunoService } = opts;
  
    app.post('/admin/cadastro-aluno', async (request, reply) => adminCreateAluno(request, reply, alunoService))
}