import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Workload } from '../../../models/firestore/workload.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkloadService {
  private readonly COLLECTION = 'workloads';

  constructor(private firebase: FirebaseService) {}

  getWorkloads(userId?: string): Observable<Workload[]> {
    const filters = userId ? [{ field: 'userId', operator: '==', value: userId }] : [];
    return this.firebase.getWithFilters<Workload>(this.COLLECTION, filters);
  }

  createWorkload(workload: Omit<Workload, 'id'>): Observable<string> {
    return this.firebase.create(this.COLLECTION, {
      ...workload,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  updateWorkload(id: string, workload: Partial<Workload>): Observable<void> {
    return this.firebase.update(this.COLLECTION, id, {
      ...workload,
      updatedAt: new Date()
    });
  }

  deleteWorkload(id: string): Observable<void> {
    return this.firebase.delete(this.COLLECTION, id);
  }
}