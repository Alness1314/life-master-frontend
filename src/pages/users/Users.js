import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { EyeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import EditUser from "./EditUsers"; // Importa el componente EditUser

export default function Users({ darkMode }) {
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para rastrear el token
  const [data, setData] = useState([]); // Estado para los datos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();
  const location = useLocation();

  const bgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

  const [open, setOpen] = useState(false); // Estado para controlar la apertura del diálogo
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para almacenar el ID del usuario seleccionado

  // Función para obtener los datos del endpoint
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true); // Activar el indicador de carga
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // Reemplaza con tu endpoint
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const result = await response.json();
      console.log("data users: " + JSON.stringify(result));
      setData(result); // Guardar los datos en el estado
    } catch (err) {
      setError(err.message); // Manejar errores
    } finally {
      setLoading(false); // Desactivar el indicador de carga
    }
  };

  // Ejecutar la función al cargar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Columnas de la tabla
  const columns = [
    {
      header: "ID",
      accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
      header: "Nombre",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "username",
    },
    {
      header: "Perfil",
      accessorKey: "profiles", // Accede a la lista de perfiles
      cell: ({ getValue }) => {
        const profiles = getValue(); // Obtiene la lista de perfiles
        if (profiles && profiles.length > 0) {
          return profiles[0].name; // Retorna el nombre del primer perfil
        }
        return "Sin perfil"; // Mensaje por defecto si no hay perfiles
      },
    },
    {
      header: "Nombre Aplicacion",
      accessorKey: "serviceConfig", // Accede a la lista de perfiles
      cell: ({ getValue }) => {
        const serviceConfig = getValue(); // Obtiene la lista de perfiles
        if (serviceConfig) {
          return serviceConfig.name; // Retorna el nombre del primer perfil
        }
        return "No disponible"; // Mensaje por defecto si no hay perfiles
      },
    },
    {
      header: "Estado",
      accessorKey: "enabled",
      cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
    },
    {
      header: "Fecha de Creación",
      accessorKey: "dateCreate",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear la fecha
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <IconButton
            onClick={() => handleDetails(row.original.id)}
            className="bg-indigo-400 dark:bg-indigo-200"
          >
            <EyeIcon className="h-5 w-5 text-white  dark:text-gray-900" />
          </IconButton>
          <IconButton
            onClick={() => handleUpdate(row.original.id)}
            className="bg-indigo-400 dark:bg-indigo-200"
          >
            <PencilSquareIcon className="h-5 w-5 text-white  dark:text-gray-900" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.original.id)}
            className="bg-indigo-400 dark:bg-indigo-200"
          >
            <TrashIcon className="h-5 w-5 text-white  dark:text-gray-900" />
          </IconButton>
        </div>
      ),
    },
  ];

  // Funciones para manejar acciones
  const handleDetails = (userId) => {
    navigate(`/users/details/${userId}`);
  };

  const handleUpdate = (userId) => {
    setSelectedUserId(userId); // Establecer el ID del usuario seleccionado
    setOpen(true); // Abrir el diálogo
  };

  const handleDelete = async (id) => {
    const result = await SweetAlert2({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Error al eliminar el usuario");
        }

        await SweetAlert2({
          title: "Eliminado",
          text: responseData.message,
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        fetchData();
      } catch (error) {
        await SweetAlert2({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  // Función para redirigir al formulario de registro
  const handleAddUser = () => {
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
      name: "Usuarios",
      route: "/users",
    },
  ];

  return (
    <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
      <Typography variant="h4" className={`mb-1 ${textColor}`}>
        Usuarios
      </Typography>
      <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
        Administra los usuarios del sistema
      </Typography>
      <hr className="my-2 border-gray-800" />

      {/* Botón para agregar un nuevo usuario */}
      <div className="flex justify-end mb-1 mt-4 mr-4">
        <Button
          color="indigo"
          className="flex items-center gap-2"
          onClick={handleAddUser}
        >
          <PlusIcon className="h-5 w-5" />
          Registrar
        </Button>
      </div>

      {/* Mostrar la tabla con los datos */}
      <DynamicTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        pageSize={6}
      />

      {/* Diálogo de edición */}
      <EditUser
        darkMode={darkMode}
        open={open}
        handleOpen={() => setOpen(false)} // Cerrar el diálogo
        userId={selectedUserId} // Pasar el ID del usuario seleccionado
      />
    </div>
  );
}