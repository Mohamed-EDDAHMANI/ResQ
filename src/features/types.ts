

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;       // optional
  avatar?: string;     // optional
  createdAt?: string;  // optional
}