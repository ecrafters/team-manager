import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, AuthResponse } from '../../models/user.model';
import { MOCK_USER, MOCK_CREDENTIALS } from './mock-user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly TOKEN_KEY = 'auth_token';
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.checkStoredToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(this.TOKEN_KEY, mockToken);
      
      const response: AuthResponse = {
        user: MOCK_USER,
        token: mockToken
      };
      this.currentUserSubject.next(MOCK_USER);
      this.router.navigate(['/dashboard']);
      return of(response);
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private checkStoredToken(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.currentUserSubject.next(MOCK_USER);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}