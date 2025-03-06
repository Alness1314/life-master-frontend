import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid } from '@mui/material';

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                                        size="small"
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
                    <Button type="submit" variant="contained" color="primary">
                        Enviar
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default DynamicForm;