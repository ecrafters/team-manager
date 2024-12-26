import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];

    return this.userService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !requiredRoles.includes(user.role)) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}