import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, User } from '../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await authApi.getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ------------------------
  // LOGIN FIXED VERSION
  // ------------------------
  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);

    try {
      setIsLoading(true);
      const { user, token } = await authApi.login({ email, password });

      // SAVE TOKEN (THIS WAS MISSING)
      localStorage.setItem("token", token);

      await new Promise(resolve => setTimeout(resolve, 300));

      setUser(user);
      toast.success('Logged in successfully');

      setTimeout(() => {
        navigate('/');
      }, 200);

    } catch (error: any) {
      setUser(null);
      localStorage.removeItem("token");

      if (location.pathname === '/login') {
        setTimeout(() => {
          toast.error(error.response?.data?.message || 'Failed to login');
        }, 300);
      } else {
        navigate('/login', { replace: true });
        setTimeout(() => {
          toast.error(error.response?.data?.message || 'Failed to login');
        }, 500);
      }

      throw error;

    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsAuthenticating(false);
      }, 300);
    }
  };

  // SIGNUP SAME FIX
  const signup = async (email: string, password: string) => {
    setIsAuthenticating(true);

    try {
      setIsLoading(true);
      const { user, token } = await authApi.signup({ email, password });

      localStorage.setItem("token", token);

      await new Promise(resolve => setTimeout(resolve, 300));

      setUser(user);
      toast.success('Account created successfully');
      navigate('/');

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
      throw error;

    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setIsAuthenticating(false);
      }, 300);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();

      localStorage.removeItem("token");
      setUser(null);

      setTimeout(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      }, 200);
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
