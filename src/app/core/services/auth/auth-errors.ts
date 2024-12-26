type AuthErrorCode = 
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password';

type AuthErrorMessages = {
  [key in AuthErrorCode]: string;
} & {
  default: string;
};

export const AUTH_ERROR_MESSAGES: AuthErrorMessages = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
  'auth/invalid-email': 'Adresse email invalide',
  'auth/operation-not-allowed': 'Opération non autorisée',
  'auth/weak-password': 'Le mot de passe est trop faible',
  default: 'Une erreur est survenue lors de la création du compte'
};

export function getAuthErrorMessage(errorCode: string): string {
  return (AUTH_ERROR_MESSAGES as Record<string, string>)[errorCode] || AUTH_ERROR_MESSAGES.default;
}