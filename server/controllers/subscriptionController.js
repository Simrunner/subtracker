const Subscription = require('../models/Subscription');

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { name, cost, billingCycle, category, renewalDate, notes } = req.body;

    const subscription = new Subscription({
      userId: req.userId,
      name,
      cost,
      billingCycle,
      category,
      renewalDate,
      notes,
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription || subscription.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription || subscription.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    Object.assign(subscription, req.body);
    subscription.updatedAt = new Date();
    await subscription.save();

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription || subscription.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId, status: 'active' });

    const totalMonthlyCost = subscriptions.reduce((sum, sub) => {
      const cycles = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, yearly: 1 };
      const annualCost = sub.cost * cycles[sub.billingCycle];
      return sum + (annualCost / 12);
    }, 0);

    const byCategory = {};
    subscriptions.forEach(sub => {
      byCategory[sub.category] = (byCategory[sub.category] || 0) + sub.cost;
    });

    const upcomingRenewals = subscriptions
      .filter(sub => new Date(sub.renewalDate) > new Date())
      .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
      .slice(0, 5);

    res.json({
      totalSubscriptions: subscriptions.length,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      byCategory,
      upcomingRenewals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
