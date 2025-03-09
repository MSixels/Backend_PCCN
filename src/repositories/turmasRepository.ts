import { firestore } from "../config/firebaseConfig";
import { Turma } from "../models/Turma";
import { User } from "../models/User";
import { RepositoryBase } from "./repositoryBase";
import admin from 'firebase-admin'

export class TurmasRepository extends RepositoryBase<Turma> {
  private static readonly COLLECTION_NAME = "turmas"

  constructor() {
    super(TurmasRepository.COLLECTION_NAME)
  }

  async deactiveOthersTurmas(exceptTurmaId?: string) {
    const turmasAtivas = await firestore.collection(TurmasRepository.COLLECTION_NAME).where("active", "==", true).get();
    if (turmasAtivas.empty) return;
    const batch = firestore.batch();
    turmasAtivas.forEach((doc) => {
      if (doc.id !== exceptTurmaId) {
        batch.update(doc.ref, { active: false });
      }
    });
  
    await batch.commit();
  }

  async addAlunoInTurma(turmaId: string, alunosToAdd: User[]) {
    const batch = firestore.batch();
    const turmaRef = firestore.collection(TurmasRepository.COLLECTION_NAME).doc(turmaId);

    alunosToAdd.map((aluno) => {
      const alunoRefInTurma = turmaRef.collection("alunos").doc(aluno.userId);
      batch.set(alunoRefInTurma, {
        email: aluno.email,
        name: aluno.name,
        matricula: aluno.matricula ?? "",
        status: aluno.isActive,
      });

      const alunoRefInUsers = firestore.collection("users").doc(aluno.userId);
      batch.set(alunoRefInUsers, { turmaId }, { merge: true });
    });

    await batch.commit();
  }

  async updateAlunosCount(turmaId: string, increment: number) {
    const turmaRef = firestore.collection(TurmasRepository.COLLECTION_NAME).doc(turmaId);
    await turmaRef.update({ alunosCount: admin.firestore.FieldValue.increment(increment) });
  }
}