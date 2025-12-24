import { User, Call, UserRole, UserStatus } from '../types';

const USERS_KEY = 'esperanca_users';
const CALLS_KEY = 'esperanca_calls';

// Seed initial data
const seedData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const initialUsers: User[] = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@esperanca.com',
        password: 'admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        id: '2',
        name: 'João Vendedor',
        email: 'joao@esperanca.com',
        password: '123',
        role: UserRole.EMPLOYEE,
        status: UserStatus.ACTIVE,
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(CALLS_KEY)) {
    localStorage.setItem(CALLS_KEY, JSON.stringify([]));
  }
};

seedData();

export const StorageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User): void => {
    const users = StorageService.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  deleteUser: (id: string): void => { // Soft delete or status change usually better, but for CRUD
    const users = StorageService.getUsers();
    // Prevent deleting the last admin
    if(users.find(u => u.id === id)?.role === UserRole.ADMIN && users.filter(u => u.role === UserRole.ADMIN).length <= 1) {
        throw new Error("Cannot delete the last admin.");
    }
    const filtered = users.filter((u) => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  getCalls: (): Call[] => {
    const data = localStorage.getItem(CALLS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCall: (call: Call): void => {
    const calls = StorageService.getCalls();
    const index = calls.findIndex((c) => c.id === call.id);
    if (index >= 0) {
      calls[index] = call;
    } else {
      calls.push(call);
    }
    localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
  },

  getCallsByEmployee: (employeeId: string): Call[] => {
    return StorageService.getCalls().filter((c) => c.employeeId === employeeId);
  },
};
