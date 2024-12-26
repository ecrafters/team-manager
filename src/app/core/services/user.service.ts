import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UsersService } from './firebase/collections/users.service';
import { FirebaseAuthService } from './auth/firebase-auth.service';
import { doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private usersService: UsersService,
    private authService: FirebaseAuthService
  ) {
    this.initializeCurrentUser();
  }

  private initializeCurrentUser(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadCurrentUser();
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const auth = await this.authService.getCurrentAuthUser();
      if (!auth?.uid) return;

      const userDoc = doc(this.firestore, 'users', auth.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        this.currentUserSubject.next({
          ...userData,
          id: auth.uid,
          email: auth.email || userData.email
        });
      } else {
        // Create new user profile if it doesn't exist
        const newUser: User = {
          id: auth.uid,
          email: auth.email!,
          firstName: '',
          lastName: '',
          role: 'developer',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(userDoc, newUser);
        this.currentUserSubject.next(newUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserId(): string | null {
    return this.currentUserSubject.value?.id || null;
  }

  updateCurrentUser(userData: Partial<User>): Observable<void> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser?.id) {
      throw new Error('No current user');
    }

    return this.usersService.updateUser(currentUser.id, {
      ...userData,
      updatedAt: new Date()
    }).pipe(
      map(() => {
        this.currentUserSubject.next({
          ...currentUser,
          ...userData,
          updatedAt: new Date()
        });
      })
    );
  }

  updateUserAvatar(file: File): Observable<string> {
    // Implement file upload to Firebase Storage
    return new Observable(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.updateCurrentUser({ avatar: dataUrl }).subscribe(() => {
          subscriber.next(dataUrl);
          subscriber.complete();
        });
      };
      reader.readAsDataURL(file);
    });
  }
}