import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor() {}

  login(email: string, password: string): boolean {
    // TODO: Implémenter la logique d'authentification réelle
    this.isAuthenticatedSubject.next(true);
    return true;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}