import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Spinner
} from "@material-tailwind/react";
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import apiService from "../../service/ApiService";

export default function NotesDetails({ darkMode }) {
    NotesDetails.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };

    const { noteId } = useParams(); // Obtener el ID del usuario desde la URL
    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [moduleData, setModuleData] = useState(null);
    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    useEffect(() => {
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/users/${userId}/notes/${noteId}`, null, true)
            .then(response => setModuleData(response.data))
            .catch(error => console.log("Error fetching data:", error))
    }, [userId, noteId]);

    if (!moduleData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner color="indigo" className="h-10 w-10" />
            </div>);
    }

    // Definir los campos que queremos mostrar dinámicamente
    const fieldsToDisplay = [
        { label: "Fuente de ingreso", key: "title" },
        { label: "Descripcion", key: "content" },
        { label: "Fecha y hora de creación", key: "createAt" },
    ];

    // Función para renderizar los campos dinámicamente
    const renderFields = (fields, data) => {
        return fields.map((field, index) => {
            const value = data[field.key];
            // Si el valor es nulo o indefinido, no renderizamos el campo
            if (value === null || value === undefined) return null;

            return (
                <div key={field.key}>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold  ">{field.label}:</p>
                    <p className="text-gray-700 dark:text-gray-400">
                        {field.format ? field.format(value) : value}
                    </p>
                </div>
            );
        });
    };

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
            name: "Notas",
            route: "/notes",
        },
        {
            name: "Detalle",
            route: `/notes/details/${noteId}`,
        }
    ];

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Nota
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Detalle de la nota registrada
            </Typography>
            <hr className="my-2 border-gray-800" />
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center m-1`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <Card shadow={false} className={`w-full max-w-screen ${cardBgColor}`}>
                        <CardHeader
                            color="transparent"
                            floated={false}
                            shadow={false}
                            className="mx-0 flex items-center gap-6 pt-0 pb-0"
                        >
                            <img
                                size="lg"
                                src="/icons/NONE.png"
                                alt="usuario"
                                className="mt-0 ml-10 mb-2"
                            />
                            <div className="flex w-full flex-col gap-0.5">
                                <div className="flex items-center justify-between">
                                    <Typography variant="h5" className="text-blue-gray dark:text-gray-300">
                                        Nota
                                    </Typography>
                                </div>
                                <Typography className="text-blue-gray dark:text-gray-300">{noteId}</Typography>
                            </div>
                        </CardHeader>
                        <CardBody className="ml-12 mb-10 mr-10 mt-4 p-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {renderFields(fieldsToDisplay, moduleData)}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}