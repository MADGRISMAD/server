const Review = require('../models/Review');
const Job = require('../models/Job');
const User = require('../models/User');

// Crear una nueva reseña
exports.createReview = async (req, res) => {
  try {
    const { jobId, reviewedId, rating, comment, categories } = req.body;

    // Verificar que el trabajo existe y está completado
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    // Verificar que el usuario ha participado en el trabajo
    const isParticipant = job.applicants.some(
      applicant => applicant.user.toString() === req.user._id.toString() ||
                 applicant.user.toString() === reviewedId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'No tienes permiso para calificar este trabajo' });
    }

    // Verificar que no existe una reseña previa
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewed: reviewedId,
      job: jobId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Ya has calificado este trabajo' });
    }

    // Crear la reseña
    const review = await Review.create({
      reviewer: req.user._id,
      reviewed: reviewedId,
      job: jobId,
      rating,
      comment,
      categories
    });

    // Actualizar el promedio de calificaciones del usuario
    await updateUserRating(reviewedId);

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reseña' });
  }
};

// Obtener reseñas de un usuario
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ reviewed: userId })
      .populate('reviewer', 'fullName')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ reviewed: userId });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
};

// Obtener reseñas de un trabajo
exports.getJobReviews = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ job: jobId })
      .populate('reviewer', 'fullName')
      .populate('reviewed', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ job: jobId });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
};

// Actualizar una reseña
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, categories } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta reseña' });
    }

    review.rating = rating;
    review.comment = comment;
    review.categories = categories;

    await review.save();

    // Actualizar el promedio de calificaciones del usuario
    await updateUserRating(review.reviewed);

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la reseña' });
  }
};

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reseña' });
    }

    await review.remove();

    // Actualizar el promedio de calificaciones del usuario
    await updateUserRating(review.reviewed);

    res.json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la reseña' });
  }
};

// Función auxiliar para actualizar el promedio de calificaciones de un usuario
async function updateUserRating(userId) {
  const reviews = await Review.find({ reviewed: userId });
  
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Calcular promedios por categoría
  const categoryAverages = {
    professionalism: 0,
    communication: 0,
    punctuality: 0,
    skills: 0
  };

  let categoryCount = 0;
  reviews.forEach(review => {
    if (review.categories) {
      Object.keys(categoryAverages).forEach(category => {
        if (review.categories[category]) {
          categoryAverages[category] += review.categories[category];
          categoryCount++;
        }
      });
    }
  });

  if (categoryCount > 0) {
    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = categoryAverages[category] / categoryCount;
    });
  }

  await User.findByIdAndUpdate(userId, {
    rating: averageRating,
    categoryRatings: categoryAverages,
    totalReviews: reviews.length
  });
} 