type AuthData = {
  user_id: number;
  token?: string;
  role?: string;
};

const KEY = "auth";

export const setAuth = (data: AuthData) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const getAuth = (): AuthData | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(KEY);
};
