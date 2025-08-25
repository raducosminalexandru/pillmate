// pillmate/src/lib/auth-client.ts

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
