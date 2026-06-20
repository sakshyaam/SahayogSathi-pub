import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, LoginCredentials, RegisterCredentials } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }: LoginCredentials) => {
    try {
      setLoading(true);
      const data = await login({ email, password });
      if (data.success) {
        setUser(data.data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ fullname, username, email, password }: RegisterCredentials) => {
    try {
      setLoading(true);
      const data = await register({ fullname, username, email, password });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogout, handleRegister, handleLogin };
};
