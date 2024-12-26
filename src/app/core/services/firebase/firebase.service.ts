import { Injectable, inject } from '@angular/core';
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
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseDocument } from '../../types/firebase.types';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);

  create<T extends DocumentData>(collectionName: string, data: T): Observable<string> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(addDoc(collectionRef, data)).pipe(
      map(docRef => docRef.id)
    );
  }

  update<T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, collectionName, id);
    return from(updateDoc(docRef, data as DocumentData));
  }

  delete(collectionName: string, id: string): Observable<void> {
    const docRef = doc(this.firestore, collectionName, id);
    return from(deleteDoc(docRef));
  }

  getWithFilters<T extends FirebaseDocument>(
    collectionName: string,
    filters: { field: string; operator: string; value: any }[]
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const queryConstraints = filters.map(filter => 
      where(filter.field, filter.operator as any, filter.value)
    );
    
    const q = query(collectionRef, ...queryConstraints);
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[]
      )
    );
  }
}