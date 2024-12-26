import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { FirebaseBaseService } from '../base/firebase-base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirebaseBaseService<User> {
  protected collectionName = 'users';

  createUser(userData: Omit<User, 'id'>): Observable<string> {
    return this.create(userData);
  }

  updateUser(id: string, userData: Partial<User>): Observable<void> {
    return this.update(id, userData);
  }

  getUsers(): Observable<User[]> {
    return this.getWithFilters([]);
  }

  getUserById(id: string): Observable<User[]> {
    return this.getWithFilters([
      { field: 'id', operator: '==', value: id }
    ]);
  }
}