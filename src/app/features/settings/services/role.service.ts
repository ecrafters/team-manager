```typescript
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, query, getDocs } from '@angular/fire/firestore';
import { Role, RoleWithUserCount } from '../models/role.model';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly COLLECTION = 'roles';

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  getRoles(): Observable<RoleWithUserCount[]> {
    const rolesRef = collection(this.firestore, this.COLLECTION);
    return from(getDocs(query(rolesRef))).pipe(
      switchMap(snapshot => {
        const roles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Role));

        return this.userService.getAllUsers().pipe(
          map(users => {
            return roles.map(role => ({
              ...role,
              userCount: users.filter(user => user.role === role.name).length
            }));
          })
        );
      })
    );
  }

  createRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const rolesRef = collection(this.firestore, this.COLLECTION);
    const newRole = {
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(addDoc(rolesRef, newRole)).pipe(
      map(docRef => {
        this.notificationService.success('Rôle créé avec succès');
        return docRef.id;
      })
    );
  }

  updateRole(id: string, roleData: Partial<Role>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    const updateData = {
      ...roleData,
      updatedAt: new Date()
    };

    return from(updateDoc(docRef, updateData)).pipe(
      map(() => {
        this.notificationService.success('Rôle mis à jour avec succès');
      })
    );
  }

  deleteRole(id: string): Observable<void> {
    return this.userService.getAllUsers().pipe(
      switchMap(users => {
        const hasUsers = users.some(user => user.role === id);
        if (hasUsers) {
          throw new Error('Ce rôle est attribué à des utilisateurs actifs');
        }
        return from(deleteDoc(doc(this.firestore, this.COLLECTION, id)));
      }),
      map(() => {
        this.notificationService.success('Rôle supprimé avec succès');
      })
    );
  }

  getDefaultPermissions(): Permission[] {
    return [
      {
        id: 'team_read',
        name: 'Voir l\'équipe',
        description: 'Permet de voir les membres de l\'équipe',
        module: 'team',
        actions: ['read']
      },
      {
        id: 'team_manage',
        name: 'Gérer l\'équipe',
        description: 'Permet d\'ajouter, modifier et supprimer des membres',
        module: 'team',
        actions: ['create', 'update', 'delete']
      },
      // Add more default permissions...
    ];
  }
}
```