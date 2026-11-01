import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const STORAGE_KEY = "fintrack.auth";

function readSavedAuth() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.token && saved?.user ? saved : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readSavedAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!response.ok) throw new Error("Session expired");
        if (active) {
          const user = await response.json();
          setAuth((current) => ({ ...current, user: { ...current.user, ...user } }));
        }
      } catch {
        if (active) {
          localStorage.removeItem(STORAGE_KEY);
          setAuth(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    verifySession();
    return () => {
      active = false;
    };
  }, []);

  async function submitCredentials(mode, credentials) {
    const response = await fetch(`${API_URL}/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Unable to authenticate. Please try again.");
    }

    const nextAuth = {
      token: data.token,
      user: { id: data.id, name: data.name, email: data.email },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
    });

    if (response.status === 401) {
      logout();
      throw new Error("Your session has expired. Please sign in again.");
    }

    return response;
  }, [auth?.token, logout]);



  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        loading,
        login: (credentials) => submitCredentials("login", credentials),
        register: (credentials) => submitCredentials("register", credentials),
        request,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}