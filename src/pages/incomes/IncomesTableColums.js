import ActionButtons from "../../components/ActionButtons";

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Fuente del ingreso",
        accessorKey: "source",
    },
    {
        header: "Descripcion",
        accessorKey: "description",
    },
    {
        header: "Cantidad",
        accessorKey: "amount",
    },
    {
        header: "Fecha de pago",
        accessorKey: "paymentDate",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear la fecha
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