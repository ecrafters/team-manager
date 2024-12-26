import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Absence } from '../../../models/firestore/absence.model';

@Injectable({
  providedIn: 'root'
})
export class AbsencesService {
  private readonly COLLECTION = 'absences';

  constructor(private firestore: Firestore) {}

  getAbsences(userId?: string): Observable<Absence[]> {
    const absencesRef = collection(this.firestore, this.COLLECTION);
    const q = userId 
      ? query(absencesRef, where('userId', '==', userId))
      : query(absencesRef);

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Absence))
      )
    );
  }

  addAbsence(absence: Omit<Absence, 'id'>): Observable<string> {
    const absencesRef = collection(this.firestore, this.COLLECTION);
    return from(addDoc(absencesRef, {
      ...absence,
      createdAt: new Date(),
      updatedAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  updateAbsence(id: string, absence: Partial<Absence>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, {
      ...absence,
      updatedAt: new Date()
    }));
  }

  deleteAbsence(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }
}