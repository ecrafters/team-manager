import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;

  initializeApp(): void {
    if (!this.app) {
      try {
        this.app = initializeApp(environment.firebase);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    }
  }

  getAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }
    return this.auth;
  }

  getFirestore(): Firestore {
    if (!this.firestore) {
      throw new Error('Firestore not initialized');
    }
    return this.firestore;
  }
}