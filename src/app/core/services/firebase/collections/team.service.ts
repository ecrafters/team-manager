import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { TeamMember } from '../../../models/firestore/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly COLLECTION = 'team-members';

  constructor(private firestore: Firestore) {}

  getTeamMembers(): Observable<TeamMember[]> {
    const membersRef = collection(this.firestore, this.COLLECTION);
    return from(getDocs(query(membersRef))).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TeamMember))
      )
    );
  }

  addMember(member: Omit<TeamMember, 'id'>): Observable<string> {
    const membersRef = collection(this.firestore, this.COLLECTION);
    return from(addDoc(membersRef, {
      ...member,
      createdAt: new Date(),
      updatedAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  updateMember(id: string, member: Partial<TeamMember>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, {
      ...member,
      updatedAt: new Date()
    }));
  }

  deleteMember(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }
}