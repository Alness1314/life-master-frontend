import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DynamicForm = ({ fields, onSubmit, initialValues, darkMode = false }) => {
    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const getColumnClass = (span) => {
        return span;
    };

    const handleFormSubmit = (data) => {
        // Formatear los valores antes de enviarlos
        const formattedData = {};
        Object.keys(data).forEach((key) => {
            const field = fields.find((f) => f.name === key);
            if (field) {
                if (field.type === 'date') {
                    formattedData[key] = dayjs(data[key]).format('YYYY-MM-DD'); // Solo fecha
                } else if (field.type === 'time') {
                    formattedData[key] = dayjs(data[key]).format('HH:mm:ss'); // Solo hora
                } else if (field.type === 'datetime') {
                    formattedData[key] = dayjs(data[key]).toISOString(); // Fecha y hora
                } else {
                    formattedData[key] = data[key]; // Otros campos
                }
            }
        });
        onSubmit(formattedData); // Enviar datos formateados
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={3} style={{ padding: '24px' }}>
                    {fields.map((field, index) => (
                        <Grid item xs={getColumnClass(field.span)} key={index}>
                            {field.type === 'dropdown' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={field.multiple ? [] : ''}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label={field.label}
                                            required={field.required}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            SelectProps={{
                                                multiple: field.multiple,
                                            }}
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
                                                    color: darkMode ? "white" : "black",
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
                            ) : field.type === 'datetime' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <DateTimePicker
                                            label={field.label}
                                            value={value ? dayjs(value) : null}
                                             size="small"
                                            onChange={(newValue) => onChange(newValue)}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            ) : field.type === 'date' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker
                                            label={field.label}
                                            value={value ? dayjs(value) : null}
                                             size="small"
                                            onChange={(newValue) => onChange(newValue)}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            ) : field.type === 'time' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <TimePicker
                                            label={field.label}
                                             size="small"
                                            value={value ? dayjs(value) : null}
                                            onChange={(newValue) => onChange(newValue)}
                                            views={field.views || ['hours', 'minutes']}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
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
                                            size="medium"
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
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                            onChange={(e) => onChange(e.target.value)}
                                        />
                                    )}
                                />
                            )}
                        </Grid>
                    ))}
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary" size='medium'>
                            Enviar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );
};

export default DynamicForm;