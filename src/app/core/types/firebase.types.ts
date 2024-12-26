export interface FirebaseFilter {
  field: string;
  operator: string;
  value: any;
}

export interface FirebaseDocument {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}