import { addAlunoInTurmaHandler, changeTurmaStatus, createTurmaHandler, editTurmaHandler, getAllTurmasQuery, getAlunosInTurmaQuery, getTurmaByIdQuery } from "../controllers/turmas/turmasController";
import { TurmasService } from "../services/turmasService";
import { FastifyInstance } from "fastify";

export async function turmasRoutes(app: FastifyInstance, opts: { turmasService: TurmasService }) {
  const { turmasService } = opts;

  app.get("/", async (request, reply) => getAllTurmasQuery(request, reply, turmasService));
  app.get("/:id", async (request, reply) => getTurmaByIdQuery(request, reply, turmasService));
  app.post("/", async (request, reply) => createTurmaHandler(request, reply, turmasService))
  app.post("/add-aluno", async (request, reply) => addAlunoInTurmaHandler(request, reply, turmasService));
  app.put("/:id", async (request, reply) => editTurmaHandler(request, reply, turmasService));
  app.patch("/change-status/:id", async (request, reply) => changeTurmaStatus(request, reply, turmasService));
  app.get("/all-alunos/:id", async (request, reply) => getAlunosInTurmaQuery(request, reply, turmasService));
}