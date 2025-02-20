import React from "react";
import {
  List,
  Card,
  ListItem,
  Typography,
  ListItemPrefix,
} from "@material-tailwind/react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function Sidebar({
  brandName,
  brandLogo,
  menuItems,
  footerContent,
  darkMode,
  onCloseSidebar, // Función para cerrar la barra lateral en modo móvil
}) {
  const navigate = useNavigate();

  // Estilos condicionales
  const sidebarBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-black";
  const iconColor = darkMode ? "text-white" : "text-black";
  const hoverStyles = darkMode
    ? "hover:bg-opacity-20 hover:text-white"
    : "hover:bg-gray-300 hover:text-black";

  return (
    <div className={`h-screen flex items-center justify-center bg-white dark:bg-gray-900 shadow-xl shadow-blue-gray-500/10 dark:shadow-blue-gray-500/5 border border-black/15`}>
      <Card
        className={`h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/0 flex flex-col bg-white dark:bg-gray-900`}
      >
        <div className="mb-2 flex items-center gap-4 p-4">
          <img
            src={brandLogo}
            alt="brand"
            className="h-9 w-9"
          />
          <Typography className={`text-lg font-bold ${textColor}`}>
            {brandName}
          </Typography>
        </div>
        <hr className={`my-2 ${darkMode ? "border-gray-800" : "border-gray-200"}`} />
        <List className="flex-1">
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              className={`${textColor} ${hoverStyles} focus:${hoverStyles} active:${hoverStyles}`}
              onClick={() => {
                navigate(item.path); // Navegar a la ruta
                onCloseSidebar(); // Cerrar la barra lateral en modo móvil
              }}
            >
              <ListItemPrefix>
                <img
                  src={`/icons/${item.icon}`}
                  alt={item.label}
                  color={iconColor}
                  className={`h-5 w-5 `}
                />
              </ListItemPrefix>
              {item.label}
            </ListItem>
          ))}
        </List>
        <hr className={`my-2 ${darkMode ? "border-gray-800" : "border-gray-200"}`} />
        <div className="mt-auto">
          <List>
            <ListItem
              className={`${textColor} ${hoverStyles} focus:${hoverStyles} active:${hoverStyles}`}
            >
              <ListItemPrefix>
                <ArrowLeftStartOnRectangleIcon
                  strokeWidth={2.5}
                  className={`h-5 w-5 ${iconColor}`}
                />
              </ListItemPrefix>
              Sign Out
            </ListItem>
          </List>
          <Typography
            variant="small"
            className={`mt-5 font-medium ${darkMode ? "text-gray-400" : "text-gray-600"} text-right`}
          >
            {footerContent}
          </Typography>
        </div>
      </Card>
    </div>
  );
}