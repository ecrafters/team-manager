import { inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  DocumentData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseDocument } from './firebase-document.interface';
import { FirebaseFilter } from './firebase-query.interface';
import { FirestoreDocument, FirestoreTimestamps } from './firestore-document.interface';

export abstract class FirebaseBaseService<T extends FirebaseDocument> {
  protected firestore: Firestore = inject(Firestore);
  protected abstract collectionName: string;

  protected create(data: Omit<T, 'id'>): Observable<string> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const timestamp = Timestamp.now();
    
    const firestoreData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return from(addDoc(collectionRef, firestoreData)).pipe(
      map(docRef => docRef.id)
    );
  }

  protected update(id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(docRef, updateData));
  }

  protected delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(docRef));
  }

  protected getWithFilters(filters: FirebaseFilter[]): Observable<T[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const queryConstraints = filters.map(filter => 
      where(filter.field, filter.operator as any, filter.value)
    );
    
    const q = query(collectionRef, ...queryConstraints);
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data() as FirestoreDocument & FirestoreTimestamps;
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as T;
        })
      )
    );
  }
}