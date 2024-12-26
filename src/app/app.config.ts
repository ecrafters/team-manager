import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { routes } from './app.routes';
import { firebaseConfig } from './environments/firebase-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...provideFirebaseApp(() => initializeApp(firebaseConfig)), // Utilisation de "spread operator"
    ...provideFirestore(() => getFirestore()),
    ...provideAuth(() => getAuth()),
    ...provideAnalytics(() => getAnalytics())
  ]
};
