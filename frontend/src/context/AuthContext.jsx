import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user") || localStorage.getItem("careerAI_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("careerAI_user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("careerAI_token");

    if (token && !user) {
      fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("careerAI_user", JSON.stringify(data.user));
          } else {
            logout();
          }
        })
        .catch(() => {
          // If server offline, keep local user state
        });
    }
  }, []);

  // REGISTER
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Registration failed.",
        };
      }

      // Save token and user info
      if (data.token) {
        localStorage.setItem("careerAI_token", data.token);
      }

      const loggedUser = data.user || { name, email };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("careerAI_user", JSON.stringify(loggedUser));
      localStorage.setItem("isLoggedIn", "true");

      setUser(loggedUser);

      return {
        success: true,
        message: data.message || "Registration successful!",
      };
    } catch (error) {
      console.error("Register Error:", error);
      return {
        success: false,
        message: "Unable to connect to server. Please check backend connection.",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Invalid email or password.",
        };
      }

      // Save token and user info
      if (data.token) {
        localStorage.setItem("careerAI_token", data.token);
      }

      const loggedUser = data.user || { email };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("careerAI_user", JSON.stringify(loggedUser));
      localStorage.setItem("isLoggedIn", "true");

      setUser(loggedUser);

      return {
        success: true,
        message: data.message || "Login successful!",
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: "Unable to connect to backend server.",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("careerAI_token");
    localStorage.removeItem("user");
    localStorage.removeItem("careerAI_user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}