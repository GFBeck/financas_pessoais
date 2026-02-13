export type AuthMode = 'disabled' | 'whitelist' | 'public' | 'credentials';

export const authConfig = {
  mode: (process.env.AUTH_MODE || 'public') as AuthMode,
  allowedEmails: process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()) || [],
  allowRegistration: process.env.ALLOW_REGISTRATION !== 'false',
};

export function isAuthEnabled(): boolean {
  return authConfig.mode !== 'disabled';
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Se modo público ou credentials, qualquer email é permitido
  if (authConfig.mode === 'public' || authConfig.mode === 'credentials') return true;
  
  // Se modo whitelist, verificar se email está na lista
  if (authConfig.mode === 'whitelist') {
    return authConfig.allowedEmails.includes(email);
  }
  
  return false;
}

export function getDefaultUserId(): string {
  return 'local-user';
}
