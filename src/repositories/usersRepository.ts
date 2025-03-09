import { User } from "../models/User";
import { RepositoryBase } from "./repositoryBase";
import { firestore } from "../config/firebaseConfig";

export class UsersRepository extends RepositoryBase<User> {
  private static readonly COLLECTION_NAME = "users"

  constructor() {
    super(UsersRepository.COLLECTION_NAME)
  }

  async getUsersAreAlunosByUserIds(userIds: string[]): Promise<User[]> {
    const usersSnapshot = await firestore
    .collection(UsersRepository.COLLECTION_NAME)
    .where("type", "==", 3) 
    .get();

    if(usersSnapshot.empty) return []

    const usersIncludeInIds = usersSnapshot.docs
    .filter((docSnap) => userIds.includes(docSnap.id))
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as unknown as User));

    return usersIncludeInIds;
  }

  async getUsersByNameOrTurma(name?: string, turmaId?: string) {
    const collectionRef = firestore.collection(UsersRepository.COLLECTION_NAME);
    let query = collectionRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (name) {
      query = query
      .where("name", ">=", name)
      .where("name", "<=", name + "\uf8ff");
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as User));

    if (turmaId) {
      return users.filter(user => user.turmaId === turmaId);
    }
    return users;
  }

  async usersExistsByEmail(email: string): Promise<boolean> {
    const collectionRef = firestore.collection(UsersRepository.COLLECTION_NAME);
    const query = collectionRef.where("email", "==", email)

    const snapshot = await query.get();
    return snapshot.empty;
  }

  async usersExistsByCpf(cpf: string): Promise<boolean> {
    const collectionRef = firestore.collection(UsersRepository.COLLECTION_NAME);
    const query = collectionRef.where("cpf", "==", cpf)

    const snapshot = await query.get();
    return snapshot.empty;
  }
}