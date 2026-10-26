const express = require('express');
const elevatorService = require('../services/elevatorService');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ success: true, data: elevatorService.getState() });
});

router.post('/move', (req, res) => {
  const { floor } = req.body;
  const result = elevatorService.moveToFloor(floor);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

router.post('/reset', (req, res) => {
  const result = elevatorService.resetSystem();
  res.json(result);
});

router.post('/emergency', (req, res) => {
  const result = elevatorService.emergencyStop();
  res.json(result);
});

module.exports = router;
