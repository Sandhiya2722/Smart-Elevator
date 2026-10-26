const express = require('express');
const sensorService = require('../services/sensorService');
const elevatorService = require('../services/elevatorService');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ success: true, data: sensorService.getAllSensors() });
});

router.get('/load', (req, res) => {
  res.json({ success: true, data: sensorService.getLoadSensor() });
});

router.post('/load', (req, res) => {
  const { load, action } = req.body;

  if (action === 'random') {
    const result = elevatorService.randomLoad();
    return res.json({ ...result, data: sensorService.getLoadSensor(), elevator: elevatorService.getState() });
  }

  if (action === 'increment') {
    const current = elevatorService.getLoad();
    const result = elevatorService.setLoad(current + 5);
    return res.json({ ...result, data: sensorService.getLoadSensor(), elevator: elevatorService.getState() });
  }

  if (action === 'decrement') {
    const current = elevatorService.getLoad();
    const result = elevatorService.setLoad(Math.max(0, current - 5));
    return res.json({ ...result, data: sensorService.getLoadSensor(), elevator: elevatorService.getState() });
  }

  if (load !== undefined) {
    const result = elevatorService.setLoad(Number(load));
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json({ ...result, data: sensorService.getLoadSensor(), elevator: elevatorService.getState() });
  }

  res.status(400).json({ success: false, error: 'Invalid load request' });
});

module.exports = router;
