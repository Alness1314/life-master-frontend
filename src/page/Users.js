import React, { useEffect, useState } from "react";
import DynamicTable from "../components/DynamicTable"; // Importa el componente de la tabla
import { Spinner, Button, IconButton } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../components/SweetAlert2';
import { EyeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons

export default function Users() {
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para rastrear el token
  const [data, setData] = useState([]); // Estado para los datos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

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
      header: "Estado",
      accessorKey: "status",
      cell: ({ getValue }) => (getValue() ? "Inactivo" : "Activo"), // Formatear el estado
    },
    {
      header: "Fecha de Creación",
      accessorKey: "created",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear la fecha
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <IconButton
            color="blue"
            onClick={() => handleDetails(row.original.id)}
          >
            <EyeIcon className="h-5 w-5" />
          </IconButton>
          <IconButton
            color="amber"
            onClick={() => handleUpdate(row.original.id)}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </IconButton>
          <IconButton
            color="red"
            onClick={() => handleDelete(row.original.id)}
          >
            <TrashIcon className="h-5 w-5" />
          </IconButton>
        </div>
      ),
    },
  ];

  // Funciones para manejar acciones
  const handleDetails = (id) => {
    navigate(`/users/details/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/users/update/${id}`);
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

  return (
    <div className="relative">
      {/* Mostrar la tabla con los datos */}
      <DynamicTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
      />

      {/* Botón flotante para agregar un nuevo usuario */}
      <Button
        color="blue"
        className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg z-50"
        onClick={handleAddUser}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
    </div>
  );
}