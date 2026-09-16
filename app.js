require('dotenv').config();
require('./migrate');
const express = require('express');
const cors = require('cors');
const path = require('path'); // ⬅️ Tambahkan ini

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const riwayatRoutes = require('./routes/riwayatRoutes');
app.use('/api', riwayatRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const anakRoutes = require('./routes/anakRoutes');
app.use('/api', anakRoutes);
const docRoutes = require('./routes/docRoutes');
app.use('/api', docRoutes);
const statistikRoutes = require('./routes/statistikRoutes');
app.use('/api', statistikRoutes);
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

const mlRoutes = require('./routes/mlRoutes');
app.use('/ml', mlRoutes); 

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMART Stunting API' });
});

const frontendDist = path.join(__dirname, 'dist');
app.use(express.static(frontendDist));
app.get(/^(?!\/(api|auth|ml|public)(\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
