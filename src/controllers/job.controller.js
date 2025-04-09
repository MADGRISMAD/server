const JobOffer = require('../models/JobOffer');
const sendNotification = require('../services/notify');

// Crear oferta
const createJob = async (req, res) => {
  const { title, description, tags, isRemote, salaryRange, duration, highlighted } = req.body;

  if (!req.user.verified) {
    return res.status(403).json({ message: 'Debes verificar tu correo .edu para publicar trabajos.' });
  }

  try {
    const job = new JobOffer({
      title,
      company: req.user.company?.name || 'Empresa desconocida',
      description,
      tags,
      isRemote,
      salaryRange,
      duration,
      highlighted,
      createdBy: req.user._id
    });

    await job.save();
    res.status(201).json({ message: 'Oferta publicada exitosamente', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la oferta' });
  }
};

// Obtener trabajos visibles con filtros
const getJobs = async (req, res) => {
  try {
    const query = { isVisible: true };

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

// Ver trabajos creados por una empresa
const getJobsByCreator = async (req, res) => {
  try {
    const jobs = await JobOffer.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener tus ofertas' });
  }
};

// Ver trabajos a los que aplicó el estudiante
const getJobsByApplicant = async (req, res) => {
  try {
    const jobs = await JobOffer.find({ 'applicants.user': req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener tus aplicaciones' });
  }
};

// Obtener una oferta
const getJobById = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id).populate('createdBy', 'fullName email');
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la oferta' });
  }
};

// Actualizar oferta
const updateJob = async (req, res) => {
  try {
    const job = await JobOffer.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta oferta' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.status(200).json({ message: 'Oferta actualizada', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la oferta' });
  }
};

// Eliminar oferta
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

// Aplicar a oferta
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
      coverLetter,
      status: 'applied'
    });

    await job.save();

    await sendNotification({
      recipient: job.createdBy,
      type: 'application',
      message: `${req.user.fullName} ha aplicado a tu oferta "${job.title}"`,
      link: `/jobs/${job._id}`
    });

    res.status(200).json({ message: 'Aplicación enviada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al aplicar a la oferta' });
  }
};

// Ver aplicantes
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

// Cambiar estado de postulación
const updateApplicantStatus = async (req, res) => {
  const { jobId, applicantId } = req.params;
  const { status } = req.body;

  try {
    const job = await JobOffer.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const applicant = job.applicants.id(applicantId);
    if (!applicant) return res.status(404).json({ message: 'Aplicante no encontrado' });

    applicant.status = status;
    await job.save();

    await sendNotification({
      recipient: applicant.user,
      type: 'status',
      message: `Tu postulación a "${job.title}" ha cambiado a estado: ${status}`,
      link: `/jobs/${job._id}`
    });

    res.json({ message: 'Estado actualizado', applicant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

// Reportar oferta
const reportJob = async (req, res) => {
  const { reason } = req.body;

  const job = await JobOffer.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });

  const alreadyReported = job.reports.some(r => r.reportedBy.toString() === req.user._id.toString());
  if (alreadyReported) {
    return res.status(400).json({ message: 'Ya has reportado esta oferta' });
  }

  job.reports.push({ reportedBy: req.user._id, reason });

  if (job.reports.length >= 3) {
    job.isVisible = false;
  }

  await job.save();

  res.status(200).json({ message: 'Oferta reportada con éxito' });
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicants,
  updateApplicantStatus,
  reportJob,
  getJobsByCreator,
  getJobsByApplicant
};
