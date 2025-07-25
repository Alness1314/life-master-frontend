import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { EyeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { jwtDecode } from "jwt-decode";

export default function Asistencia({ darkMode }) {
    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    // Función para obtener los datos del endpoint
    const fetchData = async () => {
        if (!token) return;
        try {
            setLoading(true); // Activar el indicador de carga
            const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/users/${userId}/assistance`, {
                headers: { Authorization: `Bearer ${token}` },
            }); // Reemplaza con tu endpoint
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            const result = await response.json();
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
            header: "Fecha de trabajo",
            accessorKey: "workDate",
        },
        {
            header: "Hora de entrada",
            accessorKey: "timeEntry",
            cell: ({ getValue }) => (getValue()===null ? "-" : getValue()), // Formatear el estado
        },
        {
            header: "Hora de salida",
            accessorKey: "departureTime",
            cell: ({ getValue }) => (getValue()===null ? "-" : getValue()), // Formatear el estado
        },
        {
            header: "A tiempo",
            accessorKey: "onTime",
            cell: ({ getValue }) => {
                const value = getValue();
                return value === null ? "-" : value ? "Si" : "No";
            }
        },
        {
            header: "Retardo",
            accessorKey: "retard",
            cell: ({ getValue }) => {
                const value = getValue();
                return value === null ? "-" : value ? "Si" : "No";
            }
        },
        {
            header: "Ausencia justificada",
            accessorKey: "justifiedAbsence",
            cell: ({ getValue }) => {
                const value = getValue();
                return value === null ? "-" : value ? "Si" : "No";
            }
        },
        {
            header: "Ausencia injustificada",
            accessorKey: "unjustifiedAbsence",
            cell: ({ getValue }) => {
                const value = getValue();
                return value === null ? "-" : value ? "Si" : "No";
            }
        },
        {
            header: "Fecha de creacion",
            accessorKey: "createAt",
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear el estado
        },
        {
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <IconButton
                        onClick={() => handleDetails(row.original.id)}
                        className="bg-deep-purple-400 dark:bg-deep-purple-200"
                    >
                        <EyeIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleUpdate(row.original.id)}
                        className="bg-deep-purple-400 dark:bg-deep-purple-200"
                    >
                        <PencilSquareIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(row.original.id)}
                        className="bg-deep-purple-400 dark:bg-deep-purple-200"
                    >
                        <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                </div>
            ),
        },
    ];

    // Funciones para manejar acciones
    const handleDetails = (id) => {
        navigate(`/asistencia/details/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/asistencia/edit/${id}`);
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/users/${userId}/assistance/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Error al eliminar el Servicio");
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
    const handleAddMeasurementSystem = () => {
        navigate("/asistencia/register");
    };

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Catálogos",
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
            name: "Asistencia",
            route: "/asistencia",
        },
    ];

    return (
        <div className="p-0 m-0">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Asistencia
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Administra el control de asistencia
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Botón para agregar un nuevo sistema de medición */}
            <div className="flex justify-end mb-1 mt-4 mr-4">
                <Button
                    color="deep-purple"
                    className="flex items-center gap-2"
                    onClick={handleAddMeasurementSystem}
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
            />
        </div>
    );
}