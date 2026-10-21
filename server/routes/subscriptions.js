const express = require('express');
const {
  getAllSubscriptions,
  createSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAnalytics
} = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.get('/analytics/summary', getAnalytics);
router.get('/:id', getSubscriptionById);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
