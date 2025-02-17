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

export function Sidebar({ brandName, brandLogo, menuItems, footerContent }) {
  const LIST_ITEM_STYLES =
    "text-gray-500 hover:text-white focus:text-white active:text-white hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-20";

  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <Card
        color="gray"
        className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 flex flex-col"
      >
        <div className="mb-2 flex items-center gap-4 p-4">
          <img
            src={brandLogo}
            alt="brand"
            className="h-9 w-9"
          />
          <Typography className="text-lg font-bold text-gray-300">
            {brandName}
          </Typography>
        </div>
        <hr className="my-2 border-gray-800" />
        <List className="flex-1">
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              className={LIST_ITEM_STYLES}
              onClick={() => navigate(item.path)}
            >
              <ListItemPrefix>
                {/* Usar íconos SVG desde la carpeta public/icons */}
                <img
                  src={`/icons/${item.icon}`} // Ruta relativa a la carpeta public
                  alt={item.label}
                  className="h-5 w-5"
                />
              </ListItemPrefix>
              {item.label}
            </ListItem>
          ))}
        </List>
        <hr className="my-2 border-gray-800" />
        <div className="mt-auto">
          <List>
            <ListItem className={LIST_ITEM_STYLES}>
              <ListItemPrefix>
                <ArrowLeftStartOnRectangleIcon
                  strokeWidth={2.5}
                  className="h-5 w-5"
                />
              </ListItemPrefix>
              Sign Out
            </ListItem>
          </List>
          <Typography
            variant="small"
            className="mt-5 font-medium text-gray-400 text-right"
          >
            {footerContent}
          </Typography>
        </div>
      </Card>
    </div>
  );
}