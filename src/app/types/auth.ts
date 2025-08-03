export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  customerId?: number;
  employeeId?: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  expiration: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Customer' | 'Employee' | 'Manager';
}