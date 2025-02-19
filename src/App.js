import React, { useEffect, useState, useContext } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Users from "./page/Users";
import Settings from "./page/Settings";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // Importar AuthContext

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateToken, clearToken } = useContext(AuthContext); // Usar AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Efecto para manejar el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Efecto para manejar la autenticación y redirecciones
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token y no está en la página de login, redirige al login
    if (!token && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
    // Si hay token y está en la página de login, redirige al dashboard
    else if (token && location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }

    // Actualiza el estado de autenticación
    setIsAuthenticated(!!token);
  }, [location.pathname, navigate]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogin = (token) => {
    updateToken(token); // Usar updateToken para actualizar el token
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    clearToken(); // Usar clearToken para eliminar el token
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <ThemeProvider>
      <Routes>
        {/* Ruta pública (login) */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                onLogin={handleLogin}
              />
            )
          }
        />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Users />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Settings />
              </Layout>
            }
          />
        </Route>

        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;