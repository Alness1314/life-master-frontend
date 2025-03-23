import ActionButtons from "../../components/ActionButtons";

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Sitio",
        accessorKey: "siteName",
    },
    {
        header: "Usuario",
        accessorKey: "username",
    },
    {
        header: "Nota",
        accessorKey: "notes",
    },
    {
        header: "Fecha de Creación",
        accessorKey: "createAt",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear la fecha
    },
    {
        header: "Acciones",
        cell: ({ row }) => <ActionButtons
            id={row.original.id}
            handleDetails={() => handleDetails(row.original.id)}
            handleUpdate={() => handleUpdate(row.original.id)}
            handleDelete={() => handleDelete(row.original.id)}
        />,
    },
];