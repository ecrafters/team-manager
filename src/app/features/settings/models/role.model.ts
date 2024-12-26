```typescript
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'team' | 'projects' | 'absences' | 'workload' | 'settings';
  actions: ('read' | 'create' | 'update' | 'delete' | 'approve')[];
}

export interface Role {
  id?: string;
  name: string;
  description: string;
  isDefault: boolean;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleWithUserCount extends Role {
  userCount: number;
}
```