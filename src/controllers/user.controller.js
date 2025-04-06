const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateVerificationToken = require('../utils/generateVerificationToken');

// Registrar usuario
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'student',
      university,
      skills,
      company
    } = req.body;

    // Verificar si ya existe el usuario
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'El usuario ya existe' });

    // Validaciones por rol
    if (role === 'student') {
      const eduRegex = /^[^\s@]+@[^\s@]+\.edu$/;
      if (!eduRegex.test(email)) {
        return res.status(400).json({ message: 'Los estudiantes deben usar un correo .edu' });
      }
      if (!university || !skills || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Los estudiantes deben proporcionar universidad y habilidades' });
      }
    }

    if (role === 'employer') {
      if (!company?.name) {
        return res.status(400).json({ message: 'Las empresas deben proporcionar el nombre de la compañía' });
      }
    }

    // Crear y guardar usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      university: role === 'student' ? university : undefined,
      skills: role === 'student' ? skills : undefined,
      company: role === 'employer' ? company : undefined,
      verificationToken
    });

    await user.save();

    // Simulación de envío de correo
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
    console.log(`🔗 Verifica tu cuenta: ${verifyUrl}`);

    res.status(201).json({
      message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (err) {
    console.error('Error al hacer login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Ruta protegida: obtener datos del usuario actual
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Error en getMe:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

  user.verified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: 'Correo verificado con éxito. Ya puedes iniciar sesión.' });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { fullName, university, skills, company } = req.body;

    // Campos comunes
    if (fullName) user.fullName = fullName;

    if (user.role === 'student') {
      if (university) user.university = university;
      if (skills) user.skills = skills;
    }

    if (user.role === 'employer') {
      user.company = {
        ...user.company,
        ...company // ← permite actualizar campos específicos
      };
    }

    await user.save();

    res.status(200).json({ message: 'Perfil actualizado con éxito', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  updateProfile
};
