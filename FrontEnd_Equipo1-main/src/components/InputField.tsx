import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  required?: boolean;
  bootstrapClasses?: string;
  hintText?: string;
  id: string;
}

const InputField = ({ label, type, placeholder, value, onChange, icon, required, bootstrapClasses, hintText, id }: InputFieldProps) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label text-dark"> {/* Label en texto oscuro, usando 'id' */}
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        {icon && <span className="input-group-text text-dark">{icon}</span>} {/* Icono en texto oscuro */}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={bootstrapClasses || "form-control"}
          required={required}
          style={{ borderColor: '#ced4da' }} /* Borde azul claro */
        />
      </div>
      {hintText && <div className="form-text text-muted">{hintText}</div>} {/* HintText en text-muted */}
    </div>
  );
};

export default InputField;
