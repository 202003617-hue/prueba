import React, { useEffect, useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext'; // Importar AuthContext
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { logout } = useContext(AuthContext) as AuthContextType; // Obtener la función logout del contexto
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (role) {
      setUserRole(role);
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    logout(); // Llamar a la función logout del contexto
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="container mt-5">
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">¡Bienvenido, {userName}!</h4>
        <p>Has iniciado sesión exitosamente como {userRole}.</p>
        <hr />
        <p className="mb-0">Aquí irá el contenido principal de la aplicación.</p>
        {userRole === 'administrador' && (
          <div className="mt-3">
            <h5>Contenido Exclusivo para Administradores</h5>
            <p>Aquí puedes gestionar usuarios, roles y configuraciones generales.</p>
          </div>
        )}
        <button onClick={handleLogout} className="btn btn-danger mt-3">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;
