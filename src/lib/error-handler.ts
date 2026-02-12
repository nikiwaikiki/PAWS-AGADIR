import { PostgrestError } from '@supabase/supabase-js';

export type AppError = {
  message: string;
  code?: string;
  details?: string;
};

export function handleSupabaseError(error: PostgrestError | Error | null): AppError {
  if (!error) {
    return { message: 'An unknown error occurred' };
  }

  if ('code' in error && 'details' in error) {
    const pgError = error as PostgrestError;

    const errorMap: Record<string, string> = {
      '23505': 'This record already exists',
      '23503': 'Related record not found',
      '42501': 'You do not have permission to perform this action',
      PGRST116: 'No data found',
    };

    return {
      message: errorMap[pgError.code] || pgError.message,
      code: pgError.code,
      details: pgError.details,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
  };
}

export function getAuthErrorMessage(error: any): string {
  const message = error?.message || '';

  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Incorrect email or password',
    'User already registered': 'This email is already registered',
    'Email not confirmed': 'Please confirm your email address',
    'Password should be at least 6 characters': 'Password must be at least 6 characters',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return message || 'Authentication failed';
}
