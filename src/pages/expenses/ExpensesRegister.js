import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import Swal from 'sweetalert2';
import { Typography, Spinner } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { jwtDecode } from "jwt-decode";

// Estado global simulado (puedes usar Context API o Redux en su lugar)
let cachedProfileOptions = null;

const ExpensesRegister = ({ darkMode }) => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de datos
    const [categoryOptions, setCategoryOptions] = useState([]);

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

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
            name: "Gastos",
            route: "/expenses",
        },
        {
            name: "Registro",
            route: "/expenses/register",
        },
    ];

    useEffect(() => {
            const fetchCategories = async () => {
                // Si los datos ya están en memoria, no hacemos la solicitud
                if (cachedProfileOptions) {
                    setCategoryOptions(cachedProfileOptions);
                    setLoading(false);
                    return;
                }
    
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/category`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const dataCategories = await response.json();
                    const mappedCategory = dataCategories.map((category) => ({
                        value: category.id,
                        label: category.name,
                    }));
    
                    // Almacenamos los datos en memoria
                    cachedProfileOptions = mappedCategory;
                    setCategoryOptions(mappedCategory);
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                } finally {
                    setLoading(false); // Finalizamos la carga
                }
            };
    
            fetchCategories();
        }, [token]);

    const handleSubmit = async (formData) => {
        try {
            // Asegurarse de que 'profile' sea un array
            const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/usuarios/${userId}/expenses`, {
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

            navigate('/expenses'); // Redirige a la tabla de usuarios
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

    const optionsArray = [
        {
            value: true,
            label: "Pagado",
        },
        {
            value: false,
            label: "Pendiente",
        }
    ]

    const formFields = [
        {
            type: 'dropdown',
            name: 'category',
            label: 'Categoria',
            required: true,
            span: 4,
            options: categoryOptions,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            name: 'bankOrEntity',
            label: 'Banco o Entidad',
            type: 'text',
            span: 4, // Ocupa la mitad del espacio
            required: true,
        },
        {
            name: 'amount',
            label: 'Cantidad',
            type: 'number',
            span: 4, // Ocupa la mitad del espacio
            required: true,
        },
        {
            name: 'description',
            label: 'Descripcion',
            type: 'text',
            span: 12, // Ocupa la mitad del espacio
            required: true,
        },
        
       
        {
            type: 'date',
            name: 'paymentDate',
            label: 'Fecha de pago',
            required: false,
            span: 6,
        },
        {
            type: 'dropdown',
            name: 'paymentStatus',
            label: 'Estado del pago',
            required: false,
            span: 6,
            options: optionsArray,
            multiple: false, // Indicar que es un dropdown múltiple
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
                Registro de Gastos
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo gasto
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <DynamicForm fields={formFields} onSubmit={handleSubmit} darkMode={darkMode} />
                </div>

            </div>
        </div>
    );
};

export default ExpensesRegister;