export type User = {
  id: string;
  email: string;
  name: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Could not reach the server. Make sure the API is running.");
  }

  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? "Something went wrong.");
  }

  return data as T;
}

export function signInRequest(email: string, password: string) {
  return api<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signUpRequest(name: string, email: string, password: string) {
  return api<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function currentUserRequest(token: string) {
  return api<{ user: User }>("/auth/me", {}, token);
}
