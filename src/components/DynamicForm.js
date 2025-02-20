import React from 'react';
import { Input, Select, Option, Button } from '@material-tailwind/react';

const DynamicForm = ({ fields, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    fields.forEach((field) => {
      data[field.name] = formData.get(field.name);
    });
    onSubmit(data); // Pasamos los datos al componente padre
  };

  // Mapeo de valores de span a clases de Tailwind CSS
  const getColumnClass = (span) => {
    switch (span) {
      case 1:
        return 'col-span-1';
      case 2:
        return 'col-span-2';
      case 3:
        return 'col-span-3';
      case 4:
        return 'col-span-4';
      case 5:
        return 'col-span-5';
      case 6:
        return 'col-span-6';
      case 7:
        return 'col-span-7';
      case 8:
        return 'col-span-8';
      case 9:
        return 'col-span-9';
      case 10:
        return 'col-span-10';
      case 11:
        return 'col-span-11';
      case 12:
        return 'col-span-12';
      default:
        return 'col-span-12';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 p-6 bg-white rounded-lg shadow-md">
      {fields.map((field, index) => (
        <div key={index} className={getColumnClass(field.span || 12)}>
          {field.type === 'dropdown' ? (
            <Select
              name={field.name}
              label={field.label}
              required={field.required}
              color="blue"
            >
              {field.options.map((option, i) => (
                <Option key={i} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              type={field.type}
              name={field.name}
              label={field.label}
              required={field.required}
              color="blue"
            />
          )}
        </div>
      ))}
      <div className="col-span-12 flex justify-end">
        <Button type="submit" color="blue">
          Registrar
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;