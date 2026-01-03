import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  login: (role: string, name: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    if (storedRole && storedName) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedName);
    }
  }, []);

  const login = (role: string, name: string) => {
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
