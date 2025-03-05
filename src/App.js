import React, { useEffect, useState, useContext } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users/Users";
import RegisterUsers from "./pages/users/RegisterUsers"
import Settings from "./pages/Settings";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // Importar AuthContext
import MeasurementSystem from "./pages/measurement/MeasurementSystem";
import EditUser from "./pages/users/EditUsers";
import Connections from "./pages/connection/Connections";
import ModbusConnection from "./pages/connection/modbus/ModbusConnection";
import OpcConnection from "./pages/connection/opc/OpcConnection";
import JobServices from "./pages/jobs/JobServices"
import MeasurementDetails from "./pages/measurement/MeasurementDetails";
import UserDetails from "./pages/users/UserDetails";
import LinkConfig from "./pages/linkcv/LinkConfig";
import UnregisteredOperations from "./pages/UnregisteredOperations";
import Modules from "./pages/modules/Modules"
import VariableSettings from "./pages/settings/VariableSettings"

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
                <Dashboard darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Users darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Settings darkMode={darkMode}/>
              </Layout>
            }
          />
          <Route
            path="/measurement-system"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <MeasurementSystem darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/measurement-system/details/:id"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <MeasurementDetails darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/cron-services"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <JobServices darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/unregistered-operations"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <UnregisteredOperations darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/modbus"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <ModbusConnection darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/link-config"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <LinkConfig darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/opc-server"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <OpcConnection darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/connections"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Connections darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/app-modules"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Modules darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/global-variables"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <VariableSettings darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/users/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <RegisterUsers darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/users/update/:userId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <EditUser darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/users/details/:userId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <UserDetails darkMode={darkMode} />
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