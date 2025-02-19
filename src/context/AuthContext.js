import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [dashboardModules, setDashboardModules] = useState([]);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para rastrear el token

  useEffect(() => {
    if (!token) return; // Si no hay token, no hacer nada

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    fetch(`http://localhost:8080/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name: data.fullName,
          email: data.username,
          profile: data.profiles[0].name,
          avatar: data.imageId || "https://docs.material-tailwind.com/img/face-2.jpg",
        });

        return fetch(`http://localhost:8080/api/v1/profiles/${data.profiles[0].id}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((modules) => {
        const rootModules = modules.find((mod) => mod.name === "root")?.children || [];
        const dashboardChildren = modules.find((mod) => mod.name === "Dashboard")?.children || [];

        // Ordenar los módulos por el campo "name" (alfabéticamente)
        const sortedRootModules = rootModules
          .map(({ name, route, iconName }) => ({
            type: "item",
            label: name,
            icon: iconName,
            path: route,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Ordenar alfabéticamente por "label"

        setMenuItems(sortedRootModules); // Usar los módulos ordenados
        setDashboardModules(dashboardChildren);
        setIsModulesLoaded(true); // Marcar los módulos como cargados
      })
      .catch((error) => console.error("Error fetching user/modules", error));
  }, [token]); // Ejecutar cada vez que el token cambie

  const updateToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Actualizar el estado del token
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null); // Limpiar el estado del token
  };

  return (
    <AuthContext.Provider value={{ user, menuItems, dashboardModules, isModulesLoaded, updateToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}