import type { LoginRequest, RegisterRequest } from "../types/authType";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const USER_KEY = "user";

export interface User {
  username: string;
  roles: string[];
  expiresIn: number;
}

export async function login(request: LoginRequest): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Inloggningen misslyckades. Status: ${response.status}`);
  }

  const data: User = await response.json();

  sessionStorage.setItem(USER_KEY, JSON.stringify(data));

  return data;
}

export async function register(request: RegisterRequest): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Registreringen misslyckades. Status: ${response.status}`);
  }

  return response.json();
}

export function getCurrentUser(): User | null {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Utloggningen misslyckades");
  }

  sessionStorage.removeItem(USER_KEY);
}