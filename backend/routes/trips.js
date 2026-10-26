const express = require('express');
const elevatorService = require('../services/elevatorService');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: elevatorService.getTrips() });
});

module.exports = router;
