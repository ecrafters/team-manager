import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { FirebaseFilter, FirebaseDocument } from '../../types/firebase.types';
import { getCurrentTimestamp } from '../../utils/date.utils';

@Injectable()
export abstract class BaseFirebaseService<T extends FirebaseDocument> {
  protected abstract collectionName: string;

  constructor(protected firebase: FirebaseService) {}

  protected create(data: Omit<T, 'id'>): Observable<string> {
    return this.firebase.create(this.collectionName, {
      ...data,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    });
  }

  protected update(id: string, data: Partial<T>): Observable<void> {
    return this.firebase.update(this.collectionName, id, {
      ...data,
      updatedAt: getCurrentTimestamp()
    });
  }

  protected delete(id: string): Observable<void> {
    return this.firebase.delete(this.collectionName, id);
  }

  protected getWithFilters(filters: FirebaseFilter[]): Observable<T[]> {
    return this.firebase.getWithFilters<T>(this.collectionName, filters);
  }
}