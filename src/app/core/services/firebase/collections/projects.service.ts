import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Project } from '../../../models/firestore/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly COLLECTION = 'projects';

  constructor(private firestore: Firestore) {}

  getProjects(): Observable<Project[]> {
    const projectsRef = collection(this.firestore, this.COLLECTION);
    return from(getDocs(query(projectsRef))).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project))
      )
    );
  }

  addProject(project: Omit<Project, 'id'>): Observable<string> {
    const projectsRef = collection(this.firestore, this.COLLECTION);
    return from(addDoc(projectsRef, {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, {
      ...project,
      updatedAt: new Date()
    }));
  }

  deleteProject(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }
}