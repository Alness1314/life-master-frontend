import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Button, Card, Typography, Spinner, Alert } from "@material-tailwind/react";

const DynamicTable = ({ columns, data, loading, error, onDetails, onUpdate, onDelete }) => {
  // Configuración de la tabla con useReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Tamaño de página por defecto
      },
    },
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      {/* Mostrar mensaje de error si existe */}
      {error && (
        <Alert color="red" className="mb-4 dark:bg-red-900 dark:text-white">
          {error}
        </Alert>
      )}

      {/* Mostrar spinner mientras se cargan los datos */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner color="blue" className="h-8 w-8 dark:text-blue-300" />
        </div>
      ) : (
        /* Tabla de datos con ordenamiento y paginación */
        <Card className="overflow-x-auto bg-white dark:bg-gray-800">
          <table className="w-full min-w-max table-auto">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-blue-gray-50/50 dark:bg-gray-700">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer p-4 border-b border-blue-gray-100 dark:border-gray-600 text-left"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none dark:text-white"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
                      </Typography>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-gray-50 dark:hover:bg-gray-700">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 border-b border-blue-gray-100 dark:border-gray-600"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal dark:text-white"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Typography>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-2 p-4 bg-white dark:bg-gray-800">
            <Button
              variant="text"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="dark:text-white"
            >
              Primera
            </Button>
            <Button
              variant="text"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="dark:text-white"
            >
              Anterior
            </Button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Button
                key={i}
                variant={i === table.getState().pagination.pageIndex ? "filled" : "text"}
                onClick={() => table.setPageIndex(i)}
                className="dark:text-white"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="text"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="dark:text-white"
            >
              Siguiente
            </Button>
            <Button
              variant="text"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="dark:text-white"
            >
              Última
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DynamicTable;