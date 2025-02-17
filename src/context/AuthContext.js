import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [dashboardModules, setDashboardModules] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
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

        setMenuItems(rootModules.map(({ name, route, iconName }) => ({
          type: "item",
          label: name,
          icon: iconName,
          path: route,
        })));

        setDashboardModules(dashboardChildren);
      })
      .catch((error) => console.error("Error fetching user/modules", error));
  }, []);

  return (
    <AuthContext.Provider value={{ user, menuItems, dashboardModules }}>
      {children}
    </AuthContext.Provider>
  );
}
