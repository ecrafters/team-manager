export interface AbsenceValidation {
  absenceId: string;
  validatedBy: string;
  validatedAt: Date;
  status: 'approved' | 'rejected';
  comment?: string;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  error?: string;
}