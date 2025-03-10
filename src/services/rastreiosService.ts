import { evaluateStatusCrianca } from "../core/utils/rastreios/calculateResult";
import { getFaixaEtaria } from "../core/utils/rastreios/getFaixaEtaria";
import { Aluno } from "../models/Aluno";
import { Rastreio } from "../models/Rastreio";
import { Turma } from "../models/Turma";
import { TurmaAluno } from "../models/TurmaAluno";
import { User } from "../models/User";
import { AlunosRepository } from "../repositories/alunosRepository";
import { RastreiosRepository } from "../repositories/rastreiosRepository";
import { TurmasRepository } from "../repositories/turmasRepository";
import { UsersRepository } from "../repositories/usersRepository";
import { PDFDocument, rgb } from "pdf-lib";

export class RastreiosService {
  private readonly rastreiosRepository: RastreiosRepository;
  private readonly turmasRepository: TurmasRepository;
  private readonly usersRepository: UsersRepository
  private readonly alunosRepository: AlunosRepository

  constructor(rastreiosRepository: RastreiosRepository, turmasRepository: TurmasRepository, usersRepository: UsersRepository, alunosRepository: AlunosRepository) {
    this.rastreiosRepository = rastreiosRepository;
    this.turmasRepository = turmasRepository;
    this.usersRepository = usersRepository;
    this.alunosRepository = alunosRepository;
  }

  async getAll(limit: number, cursor?: string, nomeAluno?: string, turmaId?: string) {
    let userIds: string[] | undefined = [];
    let users: User[] | null = []

    if (nomeAluno || turmaId) {
      if(turmaId) {
        const turmaAlunos = await this.turmasRepository.getSubCollection<TurmaAluno>("turmas", turmaId, "alunos");

        if (turmaAlunos.length > 0) {
          users = await this.usersRepository.getByIds(turmaAlunos.map((turmaAluno) => turmaAluno.userId), "userId");
          userIds = users?.map(u => u.userId);
        }
      } else {
        users = await this.usersRepository.getByName(nomeAluno);
        userIds = users.map(u => u.userId);
      }
    }

    const rastreios = await this.rastreiosRepository.getWithFilters(limit, cursor, userIds);

    if(rastreios.length === 0) return { rastreios: [], nextCursor: null }

    const mappedUsers = await this.mappedUsers(rastreios, users as User[]);

    const alunos = await this.alunosRepository.getByNames(Array.from(mappedUsers.values()).map(user => user.name));
    const mappedTurmas = await this.mappedTurmas(alunos);

    const data = this.mapData(rastreios, mappedUsers, mappedTurmas, alunos);
    const lastDoc = rastreios[rastreios.length - 1];

    return {
      rastreios: data,
      nextCursor: lastDoc ? lastDoc.id : null,
    };
  }

  async getByIds(ids: string[]) {
    const rastreios = await this.rastreiosRepository.getByIds(ids);
    if(rastreios?.length === 0) return { rastreios: [] }
    const mappedUsers = await this.mappedUsers(rastreios as Rastreio[]);
    const alunos = await this.alunosRepository.getByNames(Array.from(mappedUsers.values()).map(user => user.name));
    const mappedTurmas = await this.mappedTurmas(alunos);

    return { rastreios: this.mapData(rastreios as Rastreio[], mappedUsers, mappedTurmas, alunos) };
  }

  async generatePDF(ids: string[]) {
    const data = await this.getByIds(ids);

    if (data.rastreios.length === 0) return null

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    let yPosition = height - 50;

    page.drawText("Relatório de Rastreios", { x: 50, y: yPosition, size: 20, color: rgb(0, 0, 0) });
    yPosition -= 30;

    data.rastreios.forEach(rastreio => {
      page.drawText(`Nome do Aluno: ${rastreio.nomeAluno}`, { x: 50, y: yPosition, size: 14 });
      yPosition -= 20;
      page.drawText(`Turma: ${rastreio.turma}`, { x: 50, y: yPosition, size: 14 });
      yPosition -= 20;
      page.drawText(`Data do Rastreio: ${new Date(rastreio.dataRastreio).toLocaleDateString()}`, { x: 50, y: yPosition, size: 14 });
      yPosition -= 30;
      page.drawText(`Faixa etária: ${rastreio.faixaEtaria}`, { x: 50, y: yPosition, size: 14 });
      yPosition -= 40;
      page.drawText(`Resultado: ${rastreio.resultado}`, { x: 50, y: yPosition, size: 14 });
      yPosition -= 40;
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async delete(id: string) {
    return this.rastreiosRepository.delete(id);
  }

  private mapData(rastreios: Rastreio[], usersMap: Map<string, User>, turmasMap: Map<string, Turma>, alunos: Aluno[]) {
    return rastreios.map(rastreio => {
      const userRastreio = usersMap.get(rastreio.userId);
      const aluno = alunos.find((aluno) => aluno.name.toLowerCase() === userRastreio?.name.toLowerCase())
      const turma = aluno ? turmasMap.get(aluno?.turmaId as string)?.name : "Sem turma"

      return {
        id: rastreio.id,
        nomeAluno: aluno?.name ?? "",
        turma,
        faixaEtaria: getFaixaEtaria(rastreio.typeQuest),
        dataRastreio: rastreio.createdAt.toDate().toISOString(),
        resultado: evaluateStatusCrianca(rastreio),
      };
    });
  }

  private async mappedUsers(rastreios: Rastreio[], loadedUsers?: User[]) {
    const fetchedUserIds = [...new Set(rastreios.map(r => r.userId))];
    const users = loadedUsers?.length === 0 ? await this.usersRepository.getByIds(fetchedUserIds, "userId") : loadedUsers;
    return new Map(users?.map(u => [u.userId, u]));
  }

  private async mappedTurmas(alunos: Aluno[]) {
    const fetchedTurmaIds = [...new Set(alunos.map(a => a.turmaId).filter(Boolean))];
    const turmas = fetchedTurmaIds.length > 0 ? await this.turmasRepository.getByIds(fetchedTurmaIds as string[]) : [];
    return new Map(turmas?.map(u => [u.id as string, u]));
  }
}