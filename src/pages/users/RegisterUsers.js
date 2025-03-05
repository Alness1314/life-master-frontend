import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import Swal from 'sweetalert2';
import { Typography, Spinner } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';

// Estado global simulado (puedes usar Context API o Redux en su lugar)
let cachedProfileOptions = null;

const RegisterUser = ({ darkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token
    const [profileOptions, setProfileOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

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
        {
            name: "Registro de Usuario",
            route: "/users/register",
        },
    ];

    useEffect(() => {
        const fetchProfiles = async () => {
            // Si los datos ya están en memoria, no hacemos la solicitud
            if (cachedProfileOptions) {
                setProfileOptions(cachedProfileOptions);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/profiles`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataProfiles = await response.json();
                const mappedProfiles = dataProfiles.map((profile) => ({
                    value: profile.id,
                    label: profile.name,
                }));

                // Almacenamos los datos en memoria
                cachedProfileOptions = mappedProfiles;
                setProfileOptions(mappedProfiles);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setLoading(false); // Finalizamos la carga
            }
        };

        fetchProfiles();
    }, [token]);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el usuario');
            }

            await Swal.fire({
                title: 'Éxito',
                text: 'Usuario registrado correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            navigate('/users'); // Redirige a la tabla de usuarios
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const formFields = [
        {
            type: 'text',
            name: 'username',
            label: 'Nombre de usuario',
            required: true,
            span: 6,
        },
        {
            type: 'password',
            name: 'password',
            label: 'Contraseña',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'fullName',
            label: 'Nombre completo',
            required: true,
            span: 12,
        },
        {
            type: 'dropdown',
            name: 'profile',
            label: 'Perfil',
            required: true,
            span: 12,
            options: profileOptions,
        },
        {
            type: 'text',
            name: 'serviceConfig.name',
            label: 'Nombre del servicio',
            required: true,
            span: 12,
        },
        {
            type: 'text',
            name: 'serviceConfig.usernameCv',
            label: 'Usuario del servicio',
            required: true,
            span: 6,
        },
        {
            type: 'password',
            name: 'serviceConfig.passwordCv',
            label: 'Contraseña del servicio',
            required: true,
            span: 6,
        }
    ];

    // Si está cargando, mostramos un mensaje de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner color="indigo" className="h-10 w-10" />
            </div>);
    }

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Usuario
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo usuario
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <DynamicForm fields={formFields} onSubmit={handleSubmit} darkMode={darkMode}/>
                </div>

            </div>
        </div>
    );
};

export default RegisterUser;