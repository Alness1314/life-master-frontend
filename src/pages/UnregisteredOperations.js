import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Typography,
    Spinner,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Alert,
    Card,
    CardBody,
} from "@material-tailwind/react";
import {
    TextField,
    MenuItem,
    Button as MuiButton,
} from "@mui/material";
import MaterialFileInput from "../components/MaterialFileInput";
import Breadcrumbs from "../components/Breadcrumbs";

const UnregisteredOperations = ({ darkMode }) => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Obtener el token JWT
    const [facilities, setFacilities] = useState([]);
    const [tanks, setTanks] = useState([]);
    const [ducts, setDucts] = useState([]);
    const [loading, setLoading] = useState(false);
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    // Estados para el formulario
    const [backendResponse, setBackendResponse] = useState([]); // Respuesta del backend
    const [showResponseModal, setShowResponseModal] = useState(false); // Controlar visibilidad del modal de respuesta

    // React Hook Form
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            facility: "",
            elementType: "", // 'tank' o 'duct'
            elementKey: "", // publicKey del elemento seleccionado
            type: "", // Tipo de operación
            file: null, // Archivo CSV
        },
    });

    // Observar cambios en los valores del formulario
    const selectedFacility = watch("facility");
    const selectedElementType = watch("elementType");

    // Obtener las instalaciones al cargar el componente
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/by-user/${user}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();

                if (Array.isArray(data)) {
                    setFacilities(data);
                } else {
                    console.error("La respuesta no es un array:", data);
                    setFacilities([]);
                }
            } catch (error) {
                console.error("Error fetching facilities:", error);
                setFacilities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, [user, token]);

    // Obtener tanques y ductos cuando se selecciona una instalación
    useEffect(() => {
        if (selectedFacility) {
            const fetchTanksAndDucts = async () => {
                try {
                    setLoading(true);

                    // Obtener tanques
                    const tanksResponse = await fetch(
                        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedFacility}/tanks`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const tanksData = await tanksResponse.json();
                    setTanks(tanksData);

                    // Obtener ductos
                    const ductsResponse = await fetch(
                        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedFacility}/ducts`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const ductsData = await ductsResponse.json();
                    setDucts(ductsData);
                } catch (error) {
                    console.error("Error fetching tanks and ducts:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchTanksAndDucts();
        }
    }, [selectedFacility, token]);

    // Función para enviar el formulario
    const onSubmit = async (data) => {
        if (!data.facility || !data.elementKey || !data.type || !data.file) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("type", data.type);
        formData.append("element", data.elementType === "tank" ? "TANK" : "DUCT");
        formData.append("file", data.file);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/ops-no-registradas/upload/instalacion/${data.facility}/elemento/${data.elementKey}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const responseData = await response.json();
            setBackendResponse(responseData);
            setShowResponseModal(true);
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            setBackendResponse([
                { message: "Error al registrar la operación.", code: "ERROR", status: false },
            ]);
            setShowResponseModal(true);
        }
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
            name: "Operaciones no registradas",
            route: "/unregistered-operations",
        },
    ];

    // Estilos personalizados para los menús desplegables
    const menuProps = {
        PaperProps: {
            sx: {
                backgroundColor: darkMode ? "#374151" : "white", // Fondo oscuro en modo oscuro, blanco en modo claro
                color: darkMode ? "white" : "black", // Texto blanco en modo oscuro, negro en modo claro
            },
        },
    };

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Operaciones no registradas
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Genera operaciones no registradas mediante un archivo csv
            </Typography>
            <hr className="my-2 border-gray-800" />
            {/* Contenido principal */}
            <div className="container mx-auto mt-4 p-4">
                <Card className="bg-white dark:bg-gray-800">
                    <CardBody>
                        {/* Selección de instalación */}
                        <div className="mb-4">
                            <Controller
                                name="facility"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        select
                                        label="Seleccione una instalación"
                                        disabled={loading}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value); // Actualizar el valor en react-hook-form
                                            setValue("elementKey", ""); // Reiniciar el valor del elemento seleccionado
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: darkMode ? "white" : "gray",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: darkMode ? "primary.main" : "gray",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: darkMode ? "primary.main" : "gray",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: darkMode ? "white" : "gray",
                                            },
                                            "& .MuiSelect-icon": {
                                                color: darkMode ? "white" : "gray",
                                            },
                                            "& .MuiInputBase-input": {
                                                color: darkMode ? "white" : "black", // Texto en blanco en modo oscuro, negro en modo claro
                                            },
                                        }}
                                        MenuProps={menuProps} // Aplicar estilos personalizados al menú desplegable
                                    >
                                        <MenuItem value="">Seleccione</MenuItem>
                                        {facilities.map((facility) => (
                                            <MenuItem
                                                key={facility.publicKey}
                                                value={facility.publicKey}
                                                sx={{
                                                    color: "#424242",
                                                    backgroundColor: "#FAFAFA",
                                                }}   // Texto en blanco en modo oscuro, negro en modo claro
                                            >
                                                {facility.claveInstalacion}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </div>

                        {/* Mostrar spinner mientras se cargan los datos */}
                        {loading && <Spinner className="h-8 w-8" />}

                        {/* Desplegable de tanques y ductos */}
                        {selectedFacility && !loading && tanks.length > 0 && ducts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Controller
                                        name="elementKey"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextField
                                                select
                                                label="Seleccione un tanque"
                                                value={selectedElementType === "tank" ? value : ""}
                                                onChange={(e) => {
                                                    setValue("elementType", "tank"); // Actualizar el tipo de elemento
                                                    onChange(e.target.value); // Actualizar la clave del elemento
                                                }}
                                                disabled={loading || selectedElementType === "duct"}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: darkMode ? "white" : "gray",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: darkMode ? "primary.main" : "gray",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: darkMode ? "primary.main" : "gray",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: darkMode ? "white" : "gray",
                                                    },
                                                    "& .MuiSelect-icon": {
                                                        color: darkMode ? "white" : "gray",
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        color: darkMode ? "white" : "black", // Texto en blanco en modo oscuro, negro en modo claro
                                                    },
                                                }}
                                                MenuProps={menuProps} // Aplicar estilos personalizados al menú desplegable
                                            >
                                                <MenuItem value="">Seleccione</MenuItem>
                                                {tanks.map((tank) => (
                                                    <MenuItem
                                                        key={tank.publicKey}
                                                        value={tank.publicKey}
                                                        sx={{
                                                            color: "#424242",
                                                            backgroundColor: "#FAFAFA",
                                                        }}   // Texto en blanco en modo oscuro, negro en modo claro
                                                    >
                                                        {tank.claveIdentificacionTanque}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="elementKey"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextField
                                                select
                                                label="Seleccione un ducto"
                                                value={selectedElementType === "duct" ? value : ""}
                                                onChange={(e) => {
                                                    setValue("elementType", "duct"); // Actualizar el tipo de elemento
                                                    onChange(e.target.value); // Actualizar la clave del elemento
                                                }}
                                                disabled={loading || selectedElementType === "tank"}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: darkMode ? "white" : "gray",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: darkMode ? "primary.main" : "gray",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: darkMode ? "primary.main" : "gray",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: darkMode ? "white" : "gray",
                                                    },
                                                    "& .MuiSelect-icon": {
                                                        color: darkMode ? "white" : "gray",
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        color: darkMode ? "white" : "black", // Texto en blanco en modo oscuro, negro en modo claro
                                                    },
                                                }}
                                                MenuProps={menuProps} // Aplicar estilos personalizados al menú desplegable
                                            >
                                                <MenuItem value="">Seleccione</MenuItem>
                                                {ducts.map((duct) => (
                                                    <MenuItem
                                                        key={duct.publicKey}
                                                        value={duct.publicKey}
                                                        sx={{
                                                            color: "#424242",
                                                            backgroundColor: "#FAFAFA",
                                                        }}   // Texto en blanco en modo oscuro, negro en modo claro
                                                    >
                                                        {duct.claveIdentificacionDucto}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Formulario para MissingOpsReq */}
                        {selectedFacility && !loading && tanks.length > 0 && ducts.length > 0 && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Controller
                                            name="type"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    select
                                                    label="Tipo de operación"
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": {
                                                                borderColor: darkMode ? "white" : "gray",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: darkMode ? "primary.main" : "gray",
                                                            },
                                                            "&.Mui-focused fieldset": {
                                                                borderColor: darkMode ? "primary.main" : "gray",
                                                            },
                                                        },
                                                        "& .MuiInputLabel-root": {
                                                            color: darkMode ? "white" : "gray",
                                                        },
                                                        "& .MuiSelect-icon": {
                                                            color: darkMode ? "white" : "gray",
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            color: darkMode ? "white" : "black", // Texto en blanco en modo oscuro, negro en modo claro
                                                        },
                                                    }}
                                                    MenuProps={menuProps} // Aplicar estilos personalizados al menú desplegable
                                                >
                                                    <MenuItem value="">Seleccione</MenuItem>
                                                    <MenuItem
                                                        value="Entrega"
                                                        sx={{
                                                            color: "#424242",
                                                            backgroundColor: "#FAFAFA",
                                                        }} // Texto en blanco en modo oscuro, negro en modo claro
                                                    >
                                                        Entrega
                                                    </MenuItem>
                                                    <MenuItem
                                                        value="Recepcion"
                                                        sx={{
                                                            color: "#424242",
                                                            backgroundColor: "#FAFAFA",
                                                        }}  // Texto en blanco en modo oscuro, negro en modo claro
                                                    >
                                                        Recepcion
                                                    </MenuItem>
                                                    <MenuItem
                                                        value="Existencia"
                                                        sx={{
                                                            color: "#424242",
                                                            backgroundColor: "#FAFAFA",
                                                        }}  // Texto en blanco en modo oscuro, negro en modo claro
                                                    >
                                                        Existencia
                                                    </MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="file"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { onChange } }) => (
                                                <MaterialFileInput
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            onChange(file); // Actualiza el campo con el archivo seleccionado
                                                        }
                                                    }}
                                                    className="w-full"
                                                    darkMode={darkMode}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <MuiButton
                                        type="submit"
                                        disabled={loading}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                    >
                                        {loading ? "Enviando..." : "Enviar"}
                                    </MuiButton>
                                </div>
                            </form>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Modal para mostrar la respuesta del backend */}
            <Dialog open={showResponseModal} handler={() => setShowResponseModal(false)} size="md" className="bg-white dark:bg-gray-900 ">
                <DialogHeader className="text-gray-800 dark:text-gray-50">Respuesta del Backend</DialogHeader>
                <DialogBody className="h-[32rem] overflow-y-auto">
                    {backendResponse.map((response, index) => (
                        <Alert key={index} color={response.status ? "green" : "red"} className="mb-3">
                            <strong>Código: {response.code}</strong>
                            <br />
                            {response.message}
                        </Alert>
                    ))}
                </DialogBody>
                <DialogFooter>
                    <MuiButton color="primary" onClick={() => setShowResponseModal(false)}>
                        <span>Cerrar</span>
                    </MuiButton>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default UnregisteredOperations;