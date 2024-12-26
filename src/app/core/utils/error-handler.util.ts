import { ApiError } from '../types/error.types';

export function handleApiError(error: any): ApiError {
  return {
    message: error.message || 'Une erreur est survenue',
    status: error.status || 500,
    error: error
  };
}