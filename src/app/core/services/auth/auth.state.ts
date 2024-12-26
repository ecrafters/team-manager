import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  getAuthState(): Observable<boolean> {
    return this.isAuthenticated$;
  }
}