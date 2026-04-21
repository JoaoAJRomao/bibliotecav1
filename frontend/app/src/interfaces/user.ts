export interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface UserAuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
}