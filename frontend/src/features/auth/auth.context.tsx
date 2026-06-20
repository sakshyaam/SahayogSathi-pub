import { createContext, useState, useEffect, ReactNode, SetStateAction, Dispatch } from "react";
import { getMe } from "./services/auth.api";
import { IUser } from "../../types";

export interface AuthContextType {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
