import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Breadcrumbs,
} from "@material-tailwind/react";

const Dashboard = () => {
  const [currentCatalog, setCurrentCatalog] = useState(null);

  const catalogs = [
    {
      id: 1,
      name: "Catálogo 1",
      icon: "📚",
      description: "Descripción del catálogo 1",
    },
    {
      id: 2,
      name: "Catálogo 2",
      icon: "📖",
      description: "Descripción del catálogo 2",
    },
    {
      id: 3,
      name: "Catálogo 3",
      icon: "📘",
      description: "Descripción del catálogo 3",
    },
    {
      id: 4,
      name: "Catálogo 4",
      icon: "📘",
      description: "Descripción del catálogo 4",
    },
    {
      id: 5,
      name: "Catálogo 5",
      icon: "📘",
      description: "Descripción del catálogo 5",
    },
    {
      id: 6,
      name: "Catálogo 6",
      icon: "📘",
      description: "Descripción del catálogo 6",
    },
  ];

  const handleCatalogClick = (catalog) => {
    setCurrentCatalog(catalog);
  };

  const handleBackToHome = () => {
    setCurrentCatalog(null);
  };

  return (
    <div className="p-0 m-0">
      <Typography variant="h3" className="mb-1">
        Menú de Catálogos
      </Typography>
      <hr className="my-2 border-gray-800" />

      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-4">
        <a href="#" onClick={handleBackToHome} className="opacity-60">
          Home
        </a>
        {currentCatalog && (
          <a href="#" className="opacity-60">
            {currentCatalog.name}
          </a>
        )}
      </Breadcrumbs>

      {currentCatalog ? (
        <Card className="mt-6 w-96">
          <CardBody>
            <Typography variant="h2" className="mb-2">
              {currentCatalog.name}
            </Typography>
            <Typography>{currentCatalog.description}</Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleBackToHome}>Volver al menú</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogs.map((catalog) => (
            <Card
              key={catalog.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCatalogClick(catalog)}
            >
              <CardBody className="text-center">
                <Typography variant="h2" className="mb-4">
                  {catalog.icon}
                </Typography>
                <Typography variant="h5" className="mb-2">
                  {catalog.name}
                </Typography>
                <Typography>{catalog.description}</Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;