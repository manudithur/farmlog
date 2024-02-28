import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  token: '',
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setToken(token);
    }
  }, []);

  const login = (token: string) => {
    setToken(token)
    setIsAuthenticated(true)
    localStorage.setItem('token', token)
  };

  const logout = () => {
      localStorage.removeItem('token');
      setToken('');
      setIsAuthenticated(false);
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;