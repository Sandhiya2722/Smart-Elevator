const express = require('express');
const cors = require('cors');

const elevatorRoutes = require('./routes/elevator');
const sensorRoutes = require('./routes/sensors');
const tripRoutes = require('./routes/trips');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Elevator Backend is running' });
});

app.use('/api/elevator', elevatorRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/trips', tripRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Smart Elevator Backend running on http://localhost:${PORT}`);
});
