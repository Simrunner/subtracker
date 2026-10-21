const express = require('express');
const { getRecommendations, getSavingsSummary } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/', getRecommendations);
router.get('/savings/summary', getSavingsSummary);

module.exports = router;
