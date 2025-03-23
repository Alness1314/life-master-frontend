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
import EditUser from "./pages/users/EditUsers";
import UserDetails from "./pages/users/UserDetails";
import ModuleDetails from "./pages/modules/ModulesDetails";
import Modules from "./pages/modules/Modules"
import VariableSettings from "./pages/settings/VariableSettings"
import Asistencia from "./pages/asistencia/Asistencia"
import AsistenciaDetails from "./pages/asistencia/AsistenciaDetails"
import AsistenciaRegister from "./pages/asistencia/AsistenciaRegister"
import RegisterModule from "./pages/modules/RegisterModule"
import Expenses from "./pages/expenses/Expenses"
import Category from "./pages/category/Categories"
import CategoryRegister from "./pages/category/CategoryRegister"
import ExpensesRegister from "./pages/expenses/ExpensesRegister"
import AsistenciaEdit from "./pages/asistencia/AsistenciaEdit"
import ExpensesDetails from "./pages/expenses/ExpensesDetails"
import Incomes from "./pages/incomes/Incomes"
import IncomeRegister from "./pages/incomes/IncomesRegister"
import IncomesDetails from "./pages/incomes/IncomesDetails"
import Notes from "./pages/notes/Notes"
import NotesRegister from "./pages/notes/NotesRegister";
import NotesDetails from "./pages/notes/NotesDetails";
import Vault from "./pages/vault/Vault";
import VaultRegister from "./pages/vault/VaultRegister";


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
                <Settings darkMode={darkMode} />
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
            path="/app-modules/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <RegisterModule darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/modules/details/:moduleId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <ModuleDetails darkMode={darkMode} />
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
            path="/users/details/:userId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <UserDetails darkMode={darkMode} />
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
            path="/asistencia"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Asistencia darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/asistencia/details/:asistanceId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <AsistenciaDetails darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/asistencia/edit/:asistanceId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <AsistenciaEdit darkMode={darkMode} />
              </Layout>
            }
          />
          
          <Route
            path="/asistencia/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <AsistenciaRegister darkMode={darkMode} />
              </Layout>
            }
          />

          <Route
            path="/expenses"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Expenses darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/expenses/details/:expensesId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <ExpensesDetails darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/expenses/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <ExpensesRegister darkMode={darkMode} />
              </Layout>
            }
          />

          <Route
            path="/categories"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Category darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/categories/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <CategoryRegister darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/incomes"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Incomes darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/incomes/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <IncomeRegister darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/incomes/details/:incomeId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <IncomesDetails darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/notes"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Notes darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/notes/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <NotesRegister darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/notes/details/:noteId"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <NotesDetails darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/vault"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <Vault darkMode={darkMode} />
              </Layout>
            }
          />
          <Route
            path="/vault/register"
            element={
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout}>
                <VaultRegister darkMode={darkMode} />
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