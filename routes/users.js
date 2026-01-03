import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
dotenv.config();
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de roles permitidos
const ROLES_PERMITIDOS = ['agrimensor', 'tasador', 'revisor tecnico', 'administrador', 'consultor'];

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, cedula, telefono, correo, contrasena, confirmarContrasena, rol, codia } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !cedula || !telefono || !correo || !contrasena || !confirmarContrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (contrasena !== confirmarContrasena) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  // Validar el rol
  if (!ROLES_PERMITIDOS.includes(rol)) {
    return res.status(400).json({ error: 'Rol no válido. Los roles permitidos son: ' + ROLES_PERMITIDOS.join(', ') });
  }

  // Verificar si el correo ya está registrado
  let existingUser;
  let fetchError;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('correo', correo)
      .single();
    existingUser = data;
    fetchError = error;
  } catch (err) {
    console.error('Error inesperado en la consulta de Supabase para verificar usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor al verificar usuario' });
  }

  // Si hay un error de fetch que no sea porque no se encontró el usuario (PGRST116)
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error completo de Supabase al verificar usuario:', fetchError);
    return res.status(500).json({ error: 'Error al verificar el usuario' });
  }

  if (existingUser) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  // Crear nuevo usuario en Supabase
  const userData = { nombre, apellido, cedula, telefono, correo, contrasena: hashedPassword, rol };
  if (codia) {
    userData.codia = codia;
  }
  const { error: insertError } = await supabase
    .from('users')
    .insert(userData);

  if (insertError) {
    console.error('Error completo de Supabase al insertar usuario:', insertError);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  // Validaciones básicas
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  // Verificar si el usuario existe
  let user;
  let userError;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('nombre, rol, contrasena')
      .eq('correo', correo)
      .single();
    user = data;
    userError = error;
  } catch (err) {
    console.error('Error inesperado en la consulta de Supabase para login:', err);
    return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }

  // Si hay un error de fetch que no sea porque no se encontró el usuario
  if (userError && userError.code !== 'PGRST116') {
    console.error('Error completo de Supabase al buscar usuario para login:', userError);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }

  if (!user) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  res.status(200).json({ message: 'Inicio de sesión exitoso', user: { nombre: user.nombre, rol: user.rol } });
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  const { data: users, error } = await supabase.from('users').select('*');

  if (error) {
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }

  res.status(200).json(users);
});

export default router;