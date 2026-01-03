import React, { useState } from 'react';
// import './Register.css'; 
import InputField from '../components/InputField';
import SuccessModal from '../components/SuccessModal';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  codiaNumber: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

interface RegisterPayload {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  rol: string;
  codia?: string;
}

const Register = ({ isOpen, onClose }: RegisterProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('revisor');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    codiaNumber: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [registerError, setRegisterError] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false); // Nuevo estado para el modal de éxito
  const navigate = useNavigate(); // Hook para la navegación

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value);
    if (e.target.value !== 'agrimensor' && e.target.value !== 'tasador') {
      setFormData((prevData) => ({
        ...prevData,
        codiaNumber: '',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError('');
    // setIsSuccessModalOpen(false); // Eliminar
    // console.log('Intentando registrar usuario con:', { selectedRole, formData });

    if (formData.contrasena !== formData.confirmarContrasena) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const payload: RegisterPayload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        telefono: formData.telefono,
        correo: formData.correo,
        contrasena: formData.contrasena,
        confirmarContrasena: formData.confirmarContrasena,
        rol: selectedRole,
      };

      if (selectedRole === 'agrimensor' || selectedRole === 'tasador') {
        payload.codia = formData.codiaNumber;
      }

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log('Registro exitoso!', data);
        setIsSuccessModalOpen(true); // Abrir el modal de éxito
        // onClose(); // Ya no se cierra directamente, se hace desde el modal de éxito
      } else {
        setRegisterError(data.error || 'Error desconocido al registrar usuario.');
        // console.log('Error al registrar usuario:', data.error);
      }
    } catch (error) {
      setRegisterError('Ocurrió un error de red. Inténtalo de nuevo más tarde.');
      console.error('Error durante el registro:', error);
    }
  };

  // Eliminar handleClose o ajustarla si es necesario
  // const handleClose = () => {
  //   alert('Cerrar modal - aquí se manejaría la navegación o el estado del modal');
  // };

  // Eliminar closeSuccessModal o ajustarla si es necesario
  // const closeSuccessModal = () => {
  //   setIsSuccessModalOpen(false);
  //   navigate('/');
  // };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false); // Cerrar el modal de éxito
    onClose(); // Cerrar el modal de registro y redirigir al login (manejado en Login.js)
  };

  return isOpen ? (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered mt-5 mb-5" role="document" style={{ maxWidth: '600px' }}>
        <div className="modal-content">
          <div className="modal-header bg-primary text-white" style={{ backgroundColor: '#172B4D' }}>
            <h5 className="modal-title fs-4 fw-bold">Crear Nueva Cuenta</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <p className="text-muted mb-4">Complete el formulario para solicitar acceso.</p>
            <form onSubmit={handleSubmit}>
              {/* 1. TIPO DE USUARIO */}
              <div className="mb-5">
                {/* Reemplazar SectionHeader con su JSX */}
                <div className="mb-3">
                  <h3 className="border-bottom pb-2 d-inline-block" style={{ color: '#172B4D', borderColor: '#172B4D' }}>1. TIPO DE USUARIO</h3>
                  <p className="text-dark mt-2">Seleccione su Rol <span className="text-danger">*</span></p>
                </div>
                {/* Reemplazar UserRoleSelection con su JSX */}
                <div className="row g-4 mb-3">
                  {[ /* roles array de UserRoleSelection */
                    {
                      value: 'agrimensor',
                      title: 'Agrimensor / Tasador',
                      description: 'Realiza tasaciones y mensuras',
                    },
                    {
                      value: 'revisor tecnico',
                      title: 'Revisor Técnico',
                      description: 'Valida expedientes (DGCN)',
                    },
                    {
                      value: 'administrador',
                      title: 'Administrador',
                      description: 'Gestión del sistema',
                    },
                    {
                      value: 'consultor',
                      title: 'Consultor',
                      description: 'Solo visualización',
                    },
                  ].map((role) => (
                    <div className="col-md-6" key={role.value}>
                      <label
                        className={`card p-4 h-100 d-flex flex-row align-items-center 
                          ${selectedRole === role.value 
                            ? 'border border-primary border-2' 
                            : 'border border-secondary border-opacity-25'}
                        `}
                        style={{ cursor: 'pointer', backgroundColor: '#fff' }} // Fondo blanco para todas las tarjetas
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selectedRole === role.value}
                          onChange={handleRoleChange}
                          className="form-check-input me-3 fs-5"
                        />
                        <div className="d-inline-block">
                          <h5 className="card-title mb-1 text-dark">{role.title}</h5>
                          <p className="card-text text-muted small">{role.description}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. INFORMACIÓN PERSONAL */}
              <div className="mb-5">
                <div className="mb-3">
                  <h3 className="border-bottom pb-2 d-inline-block" style={{ color: '#172B4D', borderColor: '#172B4D' }}>2. INFORMACIÓN PERSONAL</h3>
                </div>
                <div className="row g-4">
                  <div className="col-md-6">
                    <InputField
                      label="Nombre(s)"
                      type="text"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required={true}
                      bootstrapClasses="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <InputField
                      label="Apellido(s)"
                      type="text"
                      id="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required={true}
                      bootstrapClasses="form-control"
                    />
                  </div>
                </div>
                <div className="row g-4 mt-3">
                  <div className="col-md-6">
                    <InputField
                      label="Cédula de Identidad"
                      type="text"
                      id="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      required={true}
                      bootstrapClasses="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <InputField
                      label="Teléfono Móvil"
                      type="text"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required={true}
                      bootstrapClasses="form-control"
                    />
                  </div>
                </div>
              </div>

              {(selectedRole === 'agrimensor' || selectedRole === 'tasador') && (
                <div className="row g-4 mt-3">
                  <div className="col-12">
                    <InputField
                      label="CODIA Número de colegiatura"
                      type="text"
                      id="codiaNumber"
                      value={formData.codiaNumber}
                      onChange={handleInputChange}
                      required={false}
                      bootstrapClasses="form-control"
                    />
                  </div>
                </div>
              )}

              {/* 3. SEGURIDAD DE LA CUENTA */}
              <div className="mb-5">
                <div className="mb-3">
                  <h3 className="border-bottom pb-2 d-inline-block" style={{ color: '#172B4D', borderColor: '#172B4D' }}>3. SEGURIDAD DE LA CUENTA</h3>
                </div>
                <div className="row g-4">
                  <div className="col-12">
                    <InputField
                      label="Correo Electrónico"
                      type="email"
                      id="correo"
                      placeholder="ejemplo@correo.com"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required={true}
                      icon="✉️"
                      bootstrapClasses="form-control"
                    />
                  </div>
                </div>
                <div className="row g-4 mt-3">
                  <div className="col-md-6">
                    <InputField
                      label="Contraseña"
                      type="password"
                      id="contrasena"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.contrasena}
                      onChange={handleInputChange}
                      required={true}
                      icon="🔒"
                      bootstrapClasses="form-control"
                      hintText="Mínimo 8 caracteres"
                    />
                  </div>
                  <div className="col-md-6">
                    <InputField
                      label="Confirmar Contraseña"
                      type="password"
                      id="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleInputChange}
                      required={true}
                      icon="✔️"
                      bootstrapClasses="form-control"
                    />
                  </div>
                </div>
              </div>

              {registerError && <p className="text-danger text-center mb-3">{registerError}</p>}

              <button type="submit" className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center">
                Crear Cuenta <span className="ms-2 fs-5">👨‍💻</span>
              </button>
            </form>
            <p className="mt-4 text-muted small text-center">
              © 2025 Grupo#2 Pasantia UAPA
            </p>
          </div>
        </div>
        {isSuccessModalOpen && <SuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessModalClose} message="¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión." />} {/* Renderizar el modal de éxito */}
      </div>
    </div>
  ) : null;
};

export default Register;
