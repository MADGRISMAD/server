const User = require('../models/User');
const Job = require('../models/Job');

// Obtener recomendaciones de estudiantes para un trabajo
exports.getStudentRecommendations = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Obtener el trabajo
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    // Verificar que el usuario es el creador del trabajo
    if (job.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para ver estas recomendaciones' });
    }

    // Construir la consulta de recomendaciones
    const query = {
      role: 'student',
      'skills': { $in: job.requiredSkills },
      'location.isRemote': job.isRemote
    };

    // Si el trabajo requiere experiencia, filtrar por eso
    if (job.requiredExperience) {
      query['experience'] = { $exists: true, $ne: [] };
    }

    // Buscar estudiantes que coincidan con los criterios
    const students = await User.find(query)
      .select('-password -verificationToken')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calcular el puntaje de coincidencia para cada estudiante
    const recommendations = students.map(student => {
      const skillMatch = student.skills.filter(skill => 
        job.requiredSkills.includes(skill)
      ).length / job.requiredSkills.length;

      const experienceMatch = student.experience ? 
        student.experience.length / 5 : 0; // Normalizar a un máximo de 5 experiencias

      const ratingMatch = student.rating / 5;

      const matchScore = (skillMatch * 0.5) + (experienceMatch * 0.3) + (ratingMatch * 0.2);

      return {
        student,
        matchScore,
        skillMatch,
        experienceMatch,
        ratingMatch
      };
    });

    // Ordenar por puntaje de coincidencia
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    const total = await User.countDocuments(query);

    res.json({
      recommendations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener recomendaciones' });
  }
};

// Obtener recomendaciones de trabajos para un estudiante
exports.getJobRecommendations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Construir la consulta de trabajos
    const query = {
      'requiredSkills': { $in: student.skills },
      'isRemote': student.location.isRemote
    };

    // Buscar trabajos que coincidan con los criterios
    const jobs = await Job.find(query)
      .populate('creator', 'fullName company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calcular el puntaje de coincidencia para cada trabajo
    const recommendations = jobs.map(job => {
      const skillMatch = student.skills.filter(skill => 
        job.requiredSkills.includes(skill)
      ).length / job.requiredSkills.length;

      const salaryMatch = job.salaryRange && student.preferredSalary ?
        (job.salaryRange.min >= student.preferredSalary.min &&
         job.salaryRange.max <= student.preferredSalary.max) ? 1 : 0.5
        : 0;

      const matchScore = (skillMatch * 0.7) + (salaryMatch * 0.3);

      return {
        job,
        matchScore,
        skillMatch,
        salaryMatch
      };
    });

    // Ordenar por puntaje de coincidencia
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    const total = await Job.countDocuments(query);

    res.json({
      recommendations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener recomendaciones' });
  }
}; 