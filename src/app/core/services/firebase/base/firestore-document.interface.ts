import { Timestamp } from '@angular/fire/firestore';

export interface FirestoreDocument {
  id?: string;
  [key: string]: any;
}

export interface FirestoreTimestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}