import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("bhoomi_user");
    const storedToken = sessionStorage.getItem("bhoomi_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    sessionStorage.setItem("bhoomi_user", JSON.stringify(userData));
    sessionStorage.setItem("bhoomi_token", jwtToken);
    console.log("✅ User logged in:", userData); // Debug log
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("bhoomi_user");
    sessionStorage.removeItem("bhoomi_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}