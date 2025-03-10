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

  async getByName(name?: string) {
    const collectionRef = firestore.collection(UsersRepository.COLLECTION_NAME);
    let query = collectionRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (name) {
      query = query
      .where("name", ">=", name)
      .where("name", "<=", name + "\uf8ff");
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as User));

    return users;
  }

  async getByNames(names: string[]): Promise<User[]> {
    if (names.length === 0) return [];
    const upperCaseNames = names.filter(name => name).map(name => name.normalize());
    const chunkSize = 10;
    const chunks = [];
  
    for (let i = 0; i < upperCaseNames.length; i += chunkSize) {
      chunks.push(upperCaseNames.slice(i, i + chunkSize));
    }
  
    const queryPromises = chunks
      .filter(chunck => chunck && chunck.length > 0)
      .map(async (chunk) => {
        const snapshot = await firestore
          .collection(UsersRepository.COLLECTION_NAME)
          .where("name", "in", chunk)
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as User));
    });
  
    const results = await Promise.all(queryPromises);

    const uniqueResults = Array.from(
      new Map(results.flat().map(item => [item.name, item])).values()
    );
  
    return uniqueResults;
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