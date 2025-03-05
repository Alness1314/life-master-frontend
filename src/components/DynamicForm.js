import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid2  } from '@mui/material';

const DynamicForm = ({ fields, onSubmit, initialValues, darkMode=false }) => {
    const { control, handleSubmit, reset } = useForm();

    // Precargar los valores iniciales cuando el componente se monta
    useEffect(() => {
        if (initialValues) {
            reset(initialValues); // Establecer valores iniciales con react-hook-form
        }
    }, [initialValues, reset]);

    // Mapeo de valores de span a columnas de Grid2
    const getColumnClass = (span) => {
        return span;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={3} style={{ padding: '24px' }}>
                {fields.map((field, index) => (
                    <Grid2 item 
                    size = { getColumnClass(field.span) } 
                    key={index}>
                        {field.type === 'dropdown' ? (
                            <Controller
                                name={field.name}
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        select
                                        label={field.label}
                                        required={field.required}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
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
                                    >
                                        {field.options.map((option, i) => (
                                            <MenuItem key={i} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        ) : (
                            <Controller
                                name={field.name}
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        type={field.type}
                                        label={field.label}
                                        required={field.required}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={value}
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
                                        onChange={(e) => onChange(e.target.value)}
                                    />
                                )}
                            />
                        )}
                    </Grid2>
                ))}
                <Grid2 item size = {12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Enviar
                    </Button>
                </Grid2>
            </Grid2>
        </form>
    );
};

export default DynamicForm;