import { validateCPF } from "../../core/utils/validateCpf";
import { EUserType } from "../../enums/EUserType";
import { Aluno } from "../../models/Aluno";
import { User } from "../../models/User";
import { AlunosRepository } from "../../repositories/alunosRepository";
import { UsersRepository } from "../../repositories/usersRepository";
import { IAdminCreateAluno } from "./interfaces/IAdminCreateAluno";
import { IAdminCreateAlunoResponse } from "./interfaces/IAdminCreateAlunoResponse";
import { Auth, getAuth } from "firebase-admin/auth"

export class AlunoService {
  private readonly alunosRepository: AlunosRepository;
  private readonly usersRepository: UsersRepository
  private readonly auth: Auth

  constructor(alunosRepository: AlunosRepository, usersRepository: UsersRepository) {
    this.alunosRepository = alunosRepository;
    this.usersRepository = usersRepository
    this.auth = getAuth();
  }

  async adminCreateAluno(createAlunoDto: IAdminCreateAluno): Promise<IAdminCreateAlunoResponse> {
    if(!validateCPF(createAlunoDto.cpf)) return { aluno: null }

    if(!(await this.validateEmailExists(createAlunoDto.email)) || !(await this.validateCpfExists(createAlunoDto.cpf))) return { aluno: null }

    const user: User = {
      name: createAlunoDto.name, 
      type: EUserType.Aluno,
      email: createAlunoDto.email,
      isActive: false, 
      cpf: createAlunoDto.cpf,
      matricula: createAlunoDto.matricula ?? ""
    }

    await this.usersRepository.create(user)

    const aluno: Aluno = {
      name: createAlunoDto.name,
      matricula: createAlunoDto.matricula ?? "",
      unidadeDeEnsino: createAlunoDto.unidade ?? "",
      sendInvitee: false,
      missingData: !createAlunoDto.matricula || !createAlunoDto.unidade,
      turmaId: ""
    }

    await this.alunosRepository.create(aluno);

    return { aluno }
  }

  private async validateEmailExists(email: string) {
    return this.usersRepository.usersExistsByEmail(email);
  }

  private async validateCpfExists(cpf: string) {
    return this.usersRepository.usersExistsByCpf(cpf);
  }
}