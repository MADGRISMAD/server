const winston = require('winston');
const Sentry = require('@sentry/node');

// Configuración de Winston para logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Inicializar Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

// Clase base para errores personalizados
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Manejador de errores para desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Manejador de errores para producción
const sendErrorProd = (err, res) => {
  // Errores operacionales: enviar al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Errores de programación: no enviar detalles al cliente
  else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Enviar a Sentry
    Sentry.captureException(err);

    // 3) Enviar respuesta genérica
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal'
    });
  }
};

// Manejador global de errores
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

// Middleware para capturar errores asíncronos
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Manejador de errores de MongoDB
const handleMongoError = err => {
  let error = err;

  if (err.name === 'CastError') {
    error = new AppError('ID inválido', 400);
  }
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error = new AppError(`Valor duplicado: ${value}. Por favor use otro valor`, 400);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    error = new AppError(`Datos inválidos. ${errors.join('. ')}`, 400);
  }

  return error;
};

// Manejador de errores de JWT
const handleJWTError = () => new AppError('Token inválido. Por favor inicie sesión nuevamente', 401);

const handleJWTExpiredError = () => new AppError('Su sesión ha expirado. Por favor inicie sesión nuevamente', 401);

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleMongoError,
  handleJWTError,
  handleJWTExpiredError,
  logger
}; 