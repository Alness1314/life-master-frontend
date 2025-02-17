import React, { useState, useContext } from "react";
import { Sidebar } from "./Sidebar";
import { NavbarComponent } from "./Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon
} from "@heroicons/react/24/solid";

export function Layout({ children, darkMode, toggleDarkMode, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, menuItems } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const handleOpenProfileDialog = () => setOpenProfileDialog(!openProfileDialog);

  const menuItemsNav = [
    {
      label: "Perfil",
      icon: UserCircleIcon,
      onClick: handleOpenProfileDialog,
    },
    {
      label: "Editar perfil",
      icon: Cog6ToothIcon,
      onClick: () => console.log("Editar perfil"),
    },
    {
      label: "Cerrar sesión",
      icon: PowerIcon,
      onClick: () => {
        onLogout();
        navigate("/");
      },
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`fixed lg:relative z-20 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <Sidebar
          brandName="Material Tailwind"
          brandLogo="https://www.material-tailwind.com/logos/mt-logo.png"
          menuItems={menuItems}
          footerContent="mt v2.1.2"
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && (
          <NavbarComponent
            brandName="Material Tailwind"
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            user={user}
            menuItems={menuItemsNav}
            openProfileDialog={openProfileDialog}
            onToggleProfileDialog={handleOpenProfileDialog}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={() => {
              onLogout();
              navigate("/");
            }}
          />
        )}
        <main className="flex-1 p-8 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
