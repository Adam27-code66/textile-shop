export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
}
