import { FastifyReply, FastifyRequest } from "fastify";
import { InternalError } from "../../core/errors/InternalError";
import { adminCreateAlunoSchema } from "./alunoSchema";
import { AlunoService } from "../../services/aluno/alunoService";

export async function adminCreateAluno(request: FastifyRequest, reply: FastifyReply, alunoService: AlunoService) {
  try {
    const alunoData = adminCreateAlunoSchema.parse(request.body);
    const aluno = await alunoService.adminCreateAluno(alunoData);
    reply.send(aluno);
  }
  catch (error) {
    throw new InternalError(`Erro ao admin tentar criar novo aluno: ${error}`);
  }
}