import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  success(message: string): void {
    console.log('Success:', message);
    // Implement actual notification logic
  }

  error(message: string): void {
    console.error('Error:', message);
    // Implement actual notification logic
  }

  info(message: string): void {
    console.info('Info:', message);
    // Implement actual notification logic
  }
}