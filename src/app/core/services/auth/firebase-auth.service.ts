import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updatePassword,
  User as FirebaseUser
} from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { getAuthErrorMessage } from './auth-errors';
import { AuthState } from './auth.state';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private auth: Auth = inject(Auth);

  constructor(
    private router: Router,
    private authState: AuthState
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.authState.setAuthenticated(!!user);
    });
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(() => {
          this.authState.setAuthenticated(true);
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          throw new Error(getAuthErrorMessage(error.code));
        })
      );
  }

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(() => this.router.navigate(['/login'])),
        catchError((error) => {
          throw new Error(getAuthErrorMessage(error.code));
        })
      );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.authState.setAuthenticated(false);
        this.router.navigate(['/login']);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.getAuthState();
  }

  getCurrentAuthUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    return from(
      signInWithEmailAndPassword(this.auth, user.email, currentPassword)
        .then(() => updatePassword(user, newPassword))
    );
  }
}