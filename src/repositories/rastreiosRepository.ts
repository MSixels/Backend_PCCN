import { firestore } from "../config/firebaseConfig";
import { Rastreio } from "../models/Rastreio";
import { RepositoryBase } from "./repositoryBase";

export class RastreiosRepository extends RepositoryBase<Rastreio> {
  private static readonly COLLECTION_NAME = "rastreios"

  constructor() {
    super(RastreiosRepository.COLLECTION_NAME)
  }

  async getWithFilters(limit: number, cursor?: string, userIds?: string[]) {
    let query = firestore.collection(RastreiosRepository.COLLECTION_NAME).limit(limit);

    if (userIds && userIds.length > 0) {
      query = query.orderBy("userId").where("userId", "in", userIds);
    }
    else {
      query = query.orderBy("createdAt");
    }

    if (cursor) {
      const snapshot = await firestore.collection(RastreiosRepository.COLLECTION_NAME).doc(cursor).get();
      if (snapshot.exists) {
        query = query.startAfter(snapshot);
      }
    }

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Rastreio))
  }
}