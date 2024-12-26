import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Observable, from, map, of } from 'rxjs';
import { User } from '../../models/user.model';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { AUTH_CONFIG } from './auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = getAuth();
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => this.mapFirebaseUserToUser(userCredential.user.email!))
    );
  }

  register(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => this.mapFirebaseUserToUser(userCredential.user.email!))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isAuthenticated(): Observable<boolean> {
    return of(!!this.auth.currentUser);
  }

  private mapFirebaseUserToUser(email: string): User {
    return {
      email,
      firstName: '',
      lastName: '',
      role: AUTH_CONFIG.DEFAULT_ROLE,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}