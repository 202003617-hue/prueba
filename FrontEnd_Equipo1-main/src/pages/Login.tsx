import React, { useState, useContext } from 'react';

import InputField from '../components/InputField';
import Register from './Register'; 
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext) as AuthContextType;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: username, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
    
        login(data.user.rol, data.user.nombre);
        navigate('/dashboard');
      } else {
        setLoginError(data.error || 'Error desconocido al iniciar sesión');
       
      }
    } catch (error) {
      setLoginError('Ocurrió un error de red. Inténtalo de nuevo más tarde.');
      console.error('Error durante el inicio de sesión:', error);
    }
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark min-vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Reemplazar LogoSection con su JSX */}
        <div className="text-center mb-3">
          <div className="fs-1 mb-2 text-primary">
            <span role="img" aria-label="flag">⛳</span>
          </div>
          <h2 className="fw-bold mb-0">EvaluoTrack RD</h2>
        </div>
        <h3 className="text-center fs-6 text-dark mb-4">Inicio de sesión</h3>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo"
            type="text"
            placeholder="Ingrese su correo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon="👤"
            bootstrapClasses="form-control"
            id="username"
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="🔒"
            bootstrapClasses="form-control"
            id="password"
          />
          {loginError && <p className="text-danger text-center">{loginError}</p>}
          {/* Reemplazar LoginButton con su JSX */}
          <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center align-items-center">
            Ingresar al Sistema <span className="ms-2">→</span>
          </button>
        </form>
        {/* Reemplazar SignUpLink con su JSX */}
        <p className="mt-3 mb-0 text-dark text-center">
          ¿No tienes una cuenta? <Link to="#" onClick={openRegisterModal} className="text-primary fw-bold">Regístrate aquí</Link>
        </p>
        <p className="mt-4 text-muted small">
          © 2025 Grupo#2 Pasantia UAPA
        </p>
      </div>

      {isRegisterModalOpen && <Register isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />}
    </div>
  );
};

export default Login;
