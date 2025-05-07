const bcrypt = require('bcrypt');
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
      major,
      graduationYear,
      currentSemester,
      gpa,
      skills,
      languages,
      experience,
      projects,
      certifications,
      socialLinks,
      bio,
      location,
      availability,
      preferredSalary,
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
      // Campos específicos para estudiantes
      university: role === 'student' ? university : undefined,
      major: role === 'student' ? major : undefined,
      graduationYear: role === 'student' ? graduationYear : undefined,
      currentSemester: role === 'student' ? currentSemester : undefined,
      gpa: role === 'student' ? gpa : undefined,
      skills: role === 'student' ? skills : undefined,
      languages: role === 'student' ? languages : undefined,
      experience: role === 'student' ? experience : undefined,
      projects: role === 'student' ? projects : undefined,
      certifications: role === 'student' ? certifications : undefined,
      socialLinks: role === 'student' ? socialLinks : undefined,
      bio: role === 'student' ? bio : undefined,
      location: role === 'student' ? location : undefined,
      availability: role === 'student' ? availability : undefined,
      preferredSalary: role === 'student' ? preferredSalary : undefined,
      // Campos específicos para empresas
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

    const {
      fullName,
      university,
      major,
      graduationYear,
      currentSemester,
      gpa,
      skills,
      languages,
      experience,
      projects,
      certifications,
      socialLinks,
      bio,
      location,
      availability,
      preferredSalary,
      company
    } = req.body;

    // Campos comunes
    if (fullName) user.fullName = fullName;

    if (user.role === 'student') {
      // Actualizar campos específicos de estudiante
      if (university) user.university = university;
      if (major) user.major = major;
      if (graduationYear) user.graduationYear = graduationYear;
      if (currentSemester) user.currentSemester = currentSemester;
      if (gpa) user.gpa = gpa;
      if (skills) user.skills = skills;
      if (languages) user.languages = languages;
      if (experience) user.experience = experience;
      if (projects) user.projects = projects;
      if (certifications) user.certifications = certifications;
      if (socialLinks) user.socialLinks = socialLinks;
      if (bio) user.bio = bio;
      if (location) user.location = location;
      if (availability) user.availability = availability;
      if (preferredSalary) user.preferredSalary = preferredSalary;
    }

    if (user.role === 'employer') {
      user.company = {
        ...user.company,
        ...company
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
