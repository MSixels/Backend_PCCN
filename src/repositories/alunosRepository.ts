import { firestore } from "../config/firebaseConfig";
import { Aluno } from "../models/Aluno";
import { RepositoryBase } from "./repositoryBase";

export class AlunosRepository extends RepositoryBase<Aluno> {
  private static readonly COLLECTION_NAME = "alunos"

  constructor() {
    super(AlunosRepository.COLLECTION_NAME)
  }

  async getByNames(namesOfAlunos: string[]): Promise<Aluno[]> {
    if (namesOfAlunos.length === 0) return [];
    const upperCaseNames = namesOfAlunos.filter(name => name).map(name => name.toUpperCase());
    const chunkSize = 10;
    const chunks = [];
  
    for (let i = 0; i < upperCaseNames.length; i += chunkSize) {
      chunks.push(upperCaseNames.slice(i, i + chunkSize));
    }
  
    const queryPromises = chunks
      .filter(chunck => chunck && chunck.length > 0)
      .map(async (chunk) => {
        const snapshot = await firestore
          .collection(AlunosRepository.COLLECTION_NAME)
          .where("name", "in", chunk)
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Aluno));
    });
  
    const results = await Promise.all(queryPromises);

    const uniqueResults = Array.from(
      new Map(results.flat().map(item => [item.name, item])).values()
    );
  
    return uniqueResults;
  }

  async getByTurmaId(turmaId: string): Promise<Aluno[]>
  {
    const snapshot = await firestore
      .collection(AlunosRepository.COLLECTION_NAME)
      .where("turmaId", "==", turmaId)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} as unknown as Aluno))
  }
  
}