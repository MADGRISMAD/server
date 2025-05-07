const User = require('../models/User');
const Job = require('../models/Job');

// Agregar trabajo a favoritos
exports.addToFavorites = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verificar que el trabajo existe
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    // Verificar que el trabajo no está ya en favoritos
    const user = await User.findById(req.user._id);
    if (user.favoriteJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Este trabajo ya está en tus favoritos' });
    }

    // Agregar a favoritos
    user.favoriteJobs.push(jobId);
    await user.save();

    res.json({ message: 'Trabajo agregado a favoritos exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar a favoritos' });
  }
};

// Remover trabajo de favoritos
exports.removeFromFavorites = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user.favoriteJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Este trabajo no está en tus favoritos' });
    }

    // Remover de favoritos
    user.favoriteJobs = user.favoriteJobs.filter(
      job => job.toString() !== jobId
    );
    await user.save();

    res.json({ message: 'Trabajo removido de favoritos exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al remover de favoritos' });
  }
};

// Obtener trabajos favoritos
exports.getFavoriteJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'favoriteJobs',
        options: {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { createdAt: -1 }
        }
      });

    const total = user.favoriteJobs.length;

    res.json({
      jobs: user.favoriteJobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener trabajos favoritos' });
  }
};

// Verificar si un trabajo está en favoritos
exports.checkFavoriteStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user._id);
    const isFavorite = user.favoriteJobs.includes(jobId);

    res.json({ isFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar estado de favorito' });
  }
}; 