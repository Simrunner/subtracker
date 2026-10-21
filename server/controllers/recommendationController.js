const Subscription = require('../models/Subscription');

const ALTERNATIVES_DB = {
  'Adobe Creative Cloud': [
    { name: 'Affinity Suite', cost: 70, savings: 600, features: ['Design', 'Photo Editing', 'Publishing'] },
    { name: 'Canva Pro', cost: 13, savings: 647, features: ['Design', 'Templates', 'Stock Images'] },
  ],
  'Microsoft Office 365': [
    { name: 'Google Workspace', cost: 6, savings: 648, features: ['Docs', 'Sheets', 'Slides', 'Email'] },
    { name: 'LibreOffice', cost: 0, savings: 72, features: ['Docs', 'Sheets', 'Presentation'] },
  ],
  'Slack': [
    { name: 'Microsoft Teams', cost: 6, savings: 66, features: ['Chat', 'Calls', 'Integration', 'File Sharing'] },
    { name: 'Discord', cost: 0, savings: 72, features: ['Chat', 'Voice', 'Video'] },
  ],
  'Dropbox': [
    { name: 'Google Drive', cost: 0, savings: 120, features: ['Cloud Storage', 'Collaboration'] },
    { name: 'OneDrive', cost: 0, savings: 120, features: ['Cloud Storage', 'Office Integration'] },
  ],
  'LastPass': [
    { name: 'Bitwarden', cost: 10, savings: 26, features: ['Password Manager', 'Secure Notes'] },
    { name: 'KeePass', cost: 0, savings: 36, features: ['Password Manager', 'Open Source'] },
  ],
};

exports.getRecommendations = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });

    const recommendations = [];

    subscriptions.forEach((sub) => {
      const alternatives = ALTERNATIVES_DB[sub.name] || [];

      alternatives.forEach((alt) => {
        const annualCost = sub.cost * (sub.billingCycle === 'monthly' ? 12 : 1);
        const altAnnualCost = alt.cost * 12;
        const savings = annualCost - altAnnualCost;

        if (savings > 0) {
          recommendations.push({
            originalService: sub.name,
            alternativeName: alt.name,
            originalCost: sub.cost,
            alternativeCost: alt.cost,
            monthlySavings: (savings / 12).toFixed(2),
            yearlySavings: savings.toFixed(2),
            features: alt.features,
            category: sub.category,
          });
        }
      });
    });

    // Sort by yearly savings descending
    recommendations.sort((a, b) => parseFloat(b.yearlySavings) - parseFloat(a.yearlySavings));

    res.json({
      recommendations,
      totalPotentialSavings: recommendations.reduce((sum, rec) => sum + parseFloat(rec.yearlySavings), 0).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSavingsSummary = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });

    let totalUnusedSpend = 0;
    let optimizationOpportunities = 0;

    subscriptions.forEach((sub) => {
      const alternatives = ALTERNATIVES_DB[sub.name];
      if (alternatives && alternatives.length > 0) {
        optimizationOpportunities++;
        const annualCost = sub.cost * 12;
        const altAnnualCost = alternatives[0].cost * 12;
        if (annualCost > altAnnualCost) {
          totalUnusedSpend += annualCost - altAnnualCost;
        }
      }
    });

    res.json({
      totalUnusedSpend: totalUnusedSpend.toFixed(2),
      optimizationOpportunities,
      subscriptionCount: subscriptions.length,
      potentialSavingsPercentage: subscriptions.length > 0
        ? ((optimizationOpportunities / subscriptions.length) * 100).toFixed(1)
        : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
