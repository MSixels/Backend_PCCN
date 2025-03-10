import { AddAlunoDto } from "../controllers/turmas/dtos/AddAlunoDto";
import { Turma } from "../models/Turma";
import { AlunosRepository } from "../repositories/alunosRepository";
import { TurmasRepository } from "../repositories/turmasRepository";
import { UsersRepository } from "../repositories/usersRepository";
import { IAlunoInTurma } from "./interfaces/IAlunoInTurma";

export class TurmasService {
  private readonly turmasRepository: TurmasRepository;
  private readonly usersRepository: UsersRepository;
  private readonly alunosRepository: AlunosRepository

  constructor(turmasRepository: TurmasRepository, usersRepository: UsersRepository, alunosRepository: AlunosRepository) {
    this.turmasRepository = turmasRepository;
    this.usersRepository = usersRepository;
    this.alunosRepository = alunosRepository;
  }

  async getAllTurmas() {
    return this.turmasRepository.getAll();
  }

  async getTurmaById(id: string) {
    return this.turmasRepository.getById(id);
  }

  async createTurma(data: Turma) {
    this.deactiveOthersTurmas()
    return this.turmasRepository.create({...data, alunosCount: 0});
  }

  async addAlunoInTurma(alunoInTurmaData: AddAlunoDto) {
    const usersAreAlunos = await this.usersRepository.getUsersAreAlunosByUserIds(alunoInTurmaData.usersIds);
    const userNames = usersAreAlunos.map((user) => user.name);
    const alunosToAdd = await this.alunosRepository.getByNames(userNames)

    await this.turmasRepository.addAlunoInTurma(alunoInTurmaData.turmaId, alunosToAdd, usersAreAlunos);
    this.updateAlunosCount(alunoInTurmaData.turmaId, alunosToAdd.length);
    return;
  }

  async editTurma(data: Turma, turmaId: string) {
    if(data.active) this.deactiveOthersTurmas(turmaId)
    return this.turmasRepository.update(turmaId, data);
  }

  async changeTurmaStatus(turmaId: string) {
    const turma = await this.turmasRepository.getById(turmaId);
    const data = {...turma, active: !turma?.active }

    if(data.active) this.deactiveOthersTurmas(turmaId);

    return this.turmasRepository.update(turmaId, data);
  }

  async getAlunosInTurma(turmaId: string) {
    return this.turmasRepository.getSubCollection<IAlunoInTurma>("turmas", turmaId, "alunos");
  }

  private async deactiveOthersTurmas(turmaId?: string) {
    return this.turmasRepository.deactiveOthersTurmas(turmaId);
  }

  private async updateAlunosCount(turmaId: string, increment: number) {
    return this.turmasRepository.updateAlunosCount(turmaId, increment);
  }

}