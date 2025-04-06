const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes); 
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => res.send('🌟 UniTalent API Ready'));

module.exports = app;
