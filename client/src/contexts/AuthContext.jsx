import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Login
  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    API.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);