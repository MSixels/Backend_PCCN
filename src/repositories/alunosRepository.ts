import { Aluno } from "../models/Aluno";
import { RepositoryBase } from "./repositoryBase";

export class AlunosRepository extends RepositoryBase<Aluno> {
  private static readonly COLLECTION_NAME = "alunos"

  constructor() {
    super(AlunosRepository.COLLECTION_NAME)
  }
}