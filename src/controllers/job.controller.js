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

const getJobById = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id).populate('createdBy', 'fullName email');

    if (!job) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la oferta' });
  }
};


const updateJob = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta oferta' });
    }

    const updatedFields = req.body;
    Object.assign(job, updatedFields);

    await job.save();
    res.status(200).json({ message: 'Oferta actualizada', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la oferta' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta oferta' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Oferta eliminada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la oferta' });
  }
};

const applyToJob = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (!req.user.verified) {
      return res.status(403).json({ message: 'Solo usuarios verificados pueden aplicar' });
    }

    const alreadyApplied = job.applicants.some(app => app.user.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Ya has aplicado a esta oferta' });
    }

    const { coverLetter } = req.body;

    job.applicants.push({
      user: req.user._id,
      coverLetter
    });

    await job.save();
    res.status(200).json({ message: 'Aplicación enviada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al aplicar a la oferta' });
  }
};

const getApplicants = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id)
      .populate('applicants.user', 'fullName email university skills');

    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para ver los aplicantes' });
    }

    res.status(200).json(job.applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener aplicantes' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicants,
};
