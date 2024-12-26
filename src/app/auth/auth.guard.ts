import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../core/services/auth/firebase-auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private auth: FirebaseAuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated().pipe(
      take(1),
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}