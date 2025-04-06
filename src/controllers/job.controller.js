const JobOffer = require('../models/JobOffer');

// Crear nueva oferta (solo usuarios verificados)
const createJob = async (req, res) => {
  const { title, company, description, tags, isRemote, salaryRange, duration, highlighted } = req.body;

  if (!req.user.verified) {
    return res.status(403).json({ message: 'Debes verificar tu correo .edu para publicar trabajos.' });
  }

  try {
    const job = new JobOffer({
      title,
      company,
      description,
      tags,
      isRemote,
      salaryRange,
      duration,
      highlighted,
      createdBy: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: 'Oferta publicada exitosamente', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la oferta' });
  }
};

// Obtener lista de ofertas públicas
const getJobs = async (req, res) => {
  try {
    const query = {};

    if (req.query.remote === 'true') query.isRemote = true;
    if (req.query.tag) query.tags = { $in: [req.query.tag] };
    if (req.query.highlighted === 'true') query.highlighted = true;

    const jobs = await JobOffer.find(query).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ofertas' });
  }
};

module.exports = {
  createJob,
  getJobs,
};
