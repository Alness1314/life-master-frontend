import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import Swal from 'sweetalert2';

const RegisterUser = () => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token
    const [profileOptions, setProfileOptions] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/profiles', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataProfiles = await response.json();
                const mappedProfiles = dataProfiles.map((profile) => ({
                    value: profile.id,
                    label: profile.name,
                }));
                setProfileOptions(mappedProfiles);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, [token]);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/users', {
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
                confirmButtonText: 'Aceptar',
            });

            navigate('/users'); // Redirige a la tabla de usuarios
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const formFields = [
        {
            type: 'text',
            name: 'fullName',
            label: 'Nombre completo',
            required: true,
            span: 12, // Ocupa 12 columnas
        },
        {
            type: 'text',
            name: 'username',
            label: 'Correo electronico',
            required: true,
            span: 6, // Ocupa 6 columnas
        },
        {
            type: 'password',
            name: 'password',
            label: 'Contraseña',
            required: true,
            span: 6, // Ocupa 6 columnas
        },
        {
            type: 'text',
            name: 'imageId',
            label: 'ID de imagen',
            required: false,
            span: 12, // Ocupa 12 columnas
        },
        {
            type: 'dropdown',
            name: 'profiles',
            label: 'Perfil',
            required: true,
            span: 12, // Ocupa 12 columnas
            options: profileOptions, // Pasamos los datos del dropdown como argumento
            sendAsArray: true, // Enviar el valor como un array
        },
    ];

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Registro de usuario</h1>
            <DynamicForm fields={formFields} onSubmit={handleSubmit} />
        </div>
    );
};

export default RegisterUser;

