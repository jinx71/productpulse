import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { TOKEN_KEY } from '../api/axios';
import { loginRequest, registerRequest, meRequest } from '../api/auth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // `loading` covers the initial "do we have a valid stored session?" check so
  // protected routes don't flash the login page before we know.
  const [loading, setLoading] = useState(true);

  // On first mount, if a token is stored, verify it by fetching the current
  // user. Runs once; an ignore flag prevents setting state after unmount.
  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const me = await meRequest();
        if (!ignore) {
          setUser(me);
          setToken(stored);
        }
      } catch (err) {
        // Token expired or invalid — clear it.
        if (!ignore) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      ignore = true;
    };
  }, []);

  const applySession = useCallback(({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const session = await loginRequest(credentials);
      applySession(session);
      return session.user;
    },
    [applySession]
  );

  const register = useCallback(
    async (payload) => {
      const session = await registerRequest(payload);
      applySession(session);
      return session.user;
    },
    [applySession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // NOTE: we store the JWT in localStorage for portfolio simplicity. In
  // production an httpOnly, Secure cookie is the safer choice — it keeps the
  // token out of reach of XSS-injected JavaScript.
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
