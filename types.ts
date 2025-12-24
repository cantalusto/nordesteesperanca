export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text
  role: UserRole;
  status: UserStatus;
}

export enum QuoteStatus {
  OPEN = 'Em aberto',
  HIGH_VALUE = 'Valor alto',
}

export interface Quotation {
  number: string;
  companyName: string;
  value: number;
  status: QuoteStatus;
}

export interface Order {
  isClosed: boolean;
  closedAt?: string; // ISO Date
}

export interface Call {
  id: string;
  employeeId: string;
  employeeName: string;
  companyName: string;
  clientCode: string;
  phoneNumber: string;
  contactPerson: string;
  notes: string;
  createdAt: string; // ISO Date
  quotation?: Quotation;
  order?: Order;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
