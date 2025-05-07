const Points = require('../models/Points');
const Job = require('../models/Job');
const { AppError } = require('../utils/errorHandler');

// Obtener puntos del usuario
exports.getUserPoints = async (req, res, next) => {
  try {
    let points = await Points.findOne({ user: req.user._id });
    
    if (!points) {
      points = await Points.create({ user: req.user._id });
    }

    res.status(200).json({
      status: 'success',
      data: points
    });
  } catch (error) {
    next(error);
  }
};

// Obtener historial de puntos
exports.getPointsHistory = async (req, res, next) => {
  try {
    const points = await Points.findOne({ user: req.user._id });
    
    if (!points) {
      return next(new AppError('No se encontró el registro de puntos', 404));
    }

    res.status(200).json({
      status: 'success',
      data: points.pointsHistory
    });
  } catch (error) {
    next(error);
  }
};

// Realizar una puja en una oferta de trabajo
exports.placeBid = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { points } = req.body;

    // Verificar que el trabajo existe y está activo
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      return next(new AppError('Trabajo no encontrado o no está activo', 404));
    }

    // Obtener puntos del usuario
    let userPoints = await Points.findOne({ user: req.user._id });
    if (!userPoints) {
      userPoints = await Points.create({ user: req.user._id });
    }

    // Verificar que el usuario tiene suficientes puntos
    if (userPoints.totalPoints < points) {
      return next(new AppError('No tienes suficientes puntos', 400));
    }

    // Obtener todas las pujas activas para este trabajo
    const activeBids = await Points.find({
      'activeBids.job': jobId,
      'activeBids.status': 'active'
    }).sort({ 'activeBids.points': -1 });

    // Calcular la posición
    let position = 1;
    for (const bid of activeBids) {
      const jobBid = bid.activeBids.find(b => b.job.toString() === jobId);
      if (jobBid && jobBid.points > points) {
        position++;
      }
    }

    // Agregar la puja
    userPoints.activeBids.push({
      job: jobId,
      points,
      position
    });

    // Descontar los puntos
    userPoints.totalPoints -= points;
    userPoints.pointsHistory.push({
      amount: -points,
      type: 'spent',
      source: 'auction',
      description: `Puja en trabajo: ${job.title}`,
      job: jobId
    });

    await userPoints.save();

    res.status(200).json({
      status: 'success',
      data: {
        points: userPoints.totalPoints,
        bid: userPoints.activeBids[userPoints.activeBids.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancelar una puja
exports.cancelBid = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    const points = await Points.findOne({ user: req.user._id });
    if (!points) {
      return next(new AppError('No se encontró el registro de puntos', 404));
    }

    const bid = points.activeBids.find(b => 
      b.job.toString() === jobId && b.status === 'active'
    );

    if (!bid) {
      return next(new AppError('Puja no encontrada', 404));
    }

    // Devolver los puntos
    points.totalPoints += bid.points;
    points.pointsHistory.push({
      amount: bid.points,
      type: 'refunded',
      source: 'auction',
      description: 'Cancelación de puja',
      job: jobId
    });

    // Marcar la puja como cancelada
    bid.status = 'cancelled';

    await points.save();

    res.status(200).json({
      status: 'success',
      data: {
        points: points.totalPoints,
        message: 'Puja cancelada exitosamente'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener ranking de pujas para un trabajo
exports.getJobBids = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const bids = await Points.find({
      'activeBids.job': jobId,
      'activeBids.status': 'active'
    })
    .populate('user', 'fullName university')
    .sort({ 'activeBids.points': -1 });

    const formattedBids = bids.map(bid => {
      const jobBid = bid.activeBids.find(b => b.job.toString() === jobId);
      return {
        user: bid.user,
        points: jobBid.points,
        position: jobBid.position,
        createdAt: jobBid.createdAt
      };
    });

    res.status(200).json({
      status: 'success',
      data: formattedBids
    });
  } catch (error) {
    next(error);
  }
}; 