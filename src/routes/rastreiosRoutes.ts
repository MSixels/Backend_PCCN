import { FastifyInstance } from "fastify";
import { RastreiosService } from "../services/rastreiosService";
import { deleteRastreioHandler, downloadPdfsHandler, getAllRastreiosQuery } from "../controllers/rastreios/rastreioController";

export async function rastreiosRoutes(app: FastifyInstance, opts: { rastreiosService: RastreiosService }) {
  const { rastreiosService } = opts;

  app.get("/", async (request, reply) => getAllRastreiosQuery(request, reply, rastreiosService));
  app.post("/generate-pdf", async (request, reply) => downloadPdfsHandler(request, reply, rastreiosService));
  app.delete("/:id", async (request, reply) => deleteRastreioHandler(request, reply, rastreiosService));
}