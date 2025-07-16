import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { jwtDecode } from "jwt-decode";
import apiService from "../../service/ApiService";
import { getColumns } from "./ExpensesColumnsTable"
import PropTypes from 'prop-types';

export default function Expenses({ darkMode }) {

    Expenses.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };

    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";



    // Función para obtener los datos del endpoint
    const fetchDataAxios = (id) => {
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/users/${id}/expenses`, null)
            .then(response => setData(response.data))
            .catch(error => setError(error.message))
    }

    // Ejecutar la función al cargar el componente
    useEffect(() => {
        setLoading(true)
        fetchDataAxios(userId);
        setLoading(false)
    }, [userId]);

    // Funciones para manejar acciones
    const handleDetails = (id) => {
        navigate(`/expenses/details/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/measurement-system/update/${id}`);
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

            apiService.delete(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/users/${userId}/expenses/${id}`)
                .then(response => {
                    if (response.data) {
                        SweetAlert2({
                            title: "Eliminado",
                            text: response.message,
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        });
                        fetchDataAxios(userId);
                    }
                })
                .catch(error => {
                    SweetAlert2({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                })
        }
    };

    // Función para redirigir al formulario de registro
    const handleAddMeasurementSystem = () => {
        navigate("/expenses/register");
    };

    // Pasar las funciones correctamente
    const columns = getColumns({ handleDetails, handleUpdate, handleDelete });

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Catálogos",
            route: "/dashboard",
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
            name: "Gastos",
            route: "/expenses",
        },
    ];

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Gastos
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Administra tus gastos de manera efectiva
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Botón para agregar un nuevo sistema de medición */}
            <div className="flex justify-end mb-1 mt-4 mr-4">
                <Button
                    color="indigo"
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
                pageSize={5}
            />
        </div>
    );
}