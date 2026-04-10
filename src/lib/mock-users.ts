export type Role = "student" | "teacher" | "parent" | "sales" | "admin";

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  password: string;
  avatar?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    firstName: "Ahmad",
    lastName: "Nasser",
    email: "student@evothink.com",
    phone: "+962 79 111 1111",
    role: "student",
    password: "student123",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Al-Hassan",
    email: "teacher@evothink.com",
    phone: "+962 79 222 2222",
    role: "teacher",
    password: "teacher123",
  },
  {
    id: "3",
    firstName: "Khalid",
    lastName: "Al-Omari",
    email: "parent@evothink.com",
    phone: "+962 79 333 3333",
    role: "parent",
    password: "parent123",
  },
  {
    id: "4",
    firstName: "Rima",
    lastName: "Saleh",
    email: "sales@evothink.com",
    phone: "+962 79 444 4444",
    role: "sales",
    password: "sales123",
  },
  {
    id: "5",
    firstName: "Omar",
    lastName: "Badawi",
    email: "admin@evothink.com",
    phone: "+962 79 555 5555",
    role: "admin",
    password: "admin123",
  },
];

export const ROLE_DASHBOARD: Record<Role, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  parent: "/parent/dashboard",
  sales: "/sales/dashboard",
  admin: "/admin",
};

/** Returns user if credentials match, null otherwise */
export function authenticateUser(email: string, password: string): MockUser | null {
  return MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) ?? null;
}

/** Register: adds to the in-memory list (resets on refresh) */
const registeredUsers: MockUser[] = [];

export function registerUser(data: Omit<MockUser, "id">): MockUser {
  const user: MockUser = { ...data, id: `reg-${Date.now()}` };
  registeredUsers.push(user);
  return user;
}