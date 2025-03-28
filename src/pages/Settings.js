import React, { useEffect, useContext, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { AuthContext } from "../context/AuthContext";

let cachedModuleL3Options = null;

export default function Settings({ darkMode }) {
  const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
  const { user } = useContext(AuthContext);
  const [moduleL3Options, setModuleL3Options] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [currentCatalog, setCurrentCatalog] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const bgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const iconRoute = "/icons/";
  const iconExt = ".png";



  const [data, setData] = useState([]); // Estado para los datos
  const [error, setError] = useState(null); // Estado para manejar errores


  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

  //obtener los modulos desde enpoint
  useEffect(() => {
    const fetchProfiles = async () => {
      // Si los datos ya están en memoria, no hacemos la solicitud
      if (cachedModuleL3Options) {
        console.log("modulos lv 3: " + cachedModuleL3Options);
        setModuleL3Options(cachedModuleL3Options);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/all?profile=${user.idProfile}&level=settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataModulesL2 = await response.json();
        const sortedRootModules = dataModulesL2
          .map(({ name, route, iconName }) => ({
            type: "item",
            label: name,
            icon: iconName,
            path: route, // Asegúrate de que `route` sea la propiedad correcta
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        // Almacenamos los datos en memoria
        cachedModuleL3Options = sortedRootModules;
        setModuleL3Options(sortedRootModules);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false); // Finalizamos la carga
      }
    };

    fetchProfiles();
  }, [token, user]);

  const handleCatalogClick = (catalog) => {
    setCurrentCatalog(catalog);
    navigate(catalog.path); // Usar `catalog.path` en lugar de `catalog.route`
  };

  const handleBackToHome = () => {
    setCurrentCatalog(null);
    navigate("/");
  };

  const getPageTitleAndDescription = () => {
    const currentPath = location.pathname;
    const catalog = moduleL3Options.find(module => module.path === currentPath);
    return {
      title: catalog ? catalog.label : "Catálogos",
      description: catalog ? catalog.description : "Selecciona un módulo para comenzar",
    };
  };

  const { title, description } = getPageTitleAndDescription();


  // Función para redirigir al formulario de registro
  const handleAdd = () => {
    navigate("/users/register");
  };

  // Generar las rutas para el Breadcrumbs
  const breadcrumbsPaths = [
    {
      name: "Home",
      route: "/Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      name: "Configuración",
      route: "/settings",
    },
    ...(currentCatalog ? [{ name: currentCatalog.label, route: currentCatalog.path }] : []),
  ];

  return (
    <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
      <Typography variant="h4" className={`mb-1 ${textColor}`}>
      Configuración
      </Typography>
      <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
        Administra las configuraciones generales
      </Typography>
      <hr className="my-2 border-gray-800" />

      {/* Mostrar la tabla con los datos */}
      {currentCatalog ? (
        <Card className={`mt-6 w-96 ${bgColor}`}>
          <CardBody>
            <Typography variant="h2" className="mb-2">
              {currentCatalog.label}
            </Typography>
            <Typography className={`${subTextColor}`}>
              {currentCatalog.description || "Descripción no disponible"}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={handleBackToHome}>Volver al menú</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {moduleL3Options.map((catalog) => (
            <Card
              key={catalog.path}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${bgColor}`}
              onClick={() => handleCatalogClick(catalog)}
            >
              <CardBody className="text-center">
                <img
                  src={(catalog.icon ? iconRoute + catalog.icon + iconExt : null) ?? "/icons/NONE.png"}
                  alt={catalog.label}
                  className="mb-4 h-32 w-32 mx-auto"
                />
                <Typography variant="h5" className={`mb-2 ${textColor}`}>
                  {catalog.label}
                </Typography>
                <Typography className={`${subTextColor}`}>
                  {catalog.description || "Descripción no disponible"}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}