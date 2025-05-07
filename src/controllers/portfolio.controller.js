const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { AppError } = require('../utils/errorHandler');

// Configuración de Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'portfolios',
      resource_type: 'auto'
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new AppError('Error al subir el archivo a Cloudinary', 500);
  }
};

// Crear o actualizar portafolio
exports.createOrUpdatePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: 'success',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// Obtener portafolio
exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId })
      .populate('user', 'fullName email university');

    if (!portfolio) {
      return next(new AppError('Portafolio no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// Agregar proyecto al portafolio
exports.addProject = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    
    if (!portfolio) {
      return next(new AppError('Portafolio no encontrado', 404));
    }

    // Procesar imágenes si existen
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(file => uploadToCloudinary(file))
      );
    }

    portfolio.projects.push({
      ...req.body,
      images
    });

    await portfolio.save();

    res.status(201).json({
      status: 'success',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// Generar CV en PDF
exports.generateCV = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id })
      .populate('user', 'fullName email university');

    if (!portfolio) {
      return next(new AppError('Portafolio no encontrado', 404));
    }

    const doc = new PDFDocument();
    const fileName = `CV_${req.user._id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../temp', fileName);

    // Crear directorio temp si no existe
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'));
    }

    // Pipe PDF a archivo
    doc.pipe(fs.createWriteStream(filePath));

    // Contenido del CV
    doc.fontSize(25).text(portfolio.user.fullName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Email: ${portfolio.user.email}`);
    doc.text(`Universidad: ${portfolio.user.university}`);
    doc.moveDown();

    // Bio
    if (portfolio.bio) {
      doc.fontSize(14).text('Biografía');
      doc.fontSize(12).text(portfolio.bio);
      doc.moveDown();
    }

    // Educación
    if (portfolio.education.length > 0) {
      doc.fontSize(14).text('Educación');
      portfolio.education.forEach(edu => {
        doc.fontSize(12)
          .text(`${edu.degree} en ${edu.field || ''} - ${edu.institution}`)
          .text(`${edu.startDate} - ${edu.endDate || 'Presente'}`);
        if (edu.description) {
          doc.text(edu.description);
        }
        doc.moveDown();
      });
    }

    // Habilidades
    if (portfolio.skills.length > 0) {
      doc.fontSize(14).text('Habilidades');
      portfolio.skills.forEach(skill => {
        doc.fontSize(12).text(`${skill.name} - ${skill.level} (${skill.category})`);
      });
      doc.moveDown();
    }

    // Proyectos
    if (portfolio.projects.length > 0) {
      doc.fontSize(14).text('Proyectos');
      portfolio.projects.forEach(project => {
        doc.fontSize(12)
          .text(project.title)
          .text(project.description);
        if (project.technologies.length > 0) {
          doc.text(`Tecnologías: ${project.technologies.join(', ')}`);
        }
        doc.moveDown();
      });
    }

    // Finalizar PDF
    doc.end();

    // Esperar a que el PDF se genere
    await new Promise(resolve => doc.on('end', resolve));

    // Subir PDF a Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'cvs',
      resource_type: 'raw'
    });

    // Actualizar URL del CV en el portafolio
    portfolio.cvUrl = result.secure_url;
    await portfolio.save();

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    res.status(200).json({
      status: 'success',
      data: {
        cvUrl: result.secure_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar proyecto del portafolio
exports.deleteProject = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    
    if (!portfolio) {
      return next(new AppError('Portafolio no encontrado', 404));
    }

    const project = portfolio.projects.id(req.params.projectId);
    
    if (!project) {
      return next(new AppError('Proyecto no encontrado', 404));
    }

    // Eliminar imágenes de Cloudinary
    if (project.images && project.images.length > 0) {
      await Promise.all(
        project.images.map(image => 
          cloudinary.uploader.destroy(image.publicId)
        )
      );
    }

    project.remove();
    await portfolio.save();

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 