import React, { useState, useEffect } from 'react';

interface Subscription {
  _id: string;
  name: string;
  cost: number;
  billingCycle: string;
  category: string;
  renewalDate: string;
  status: string;
  notes?: string;
}

interface SubscriptionManagerProps {
  token: string;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ token }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    category: '',
    renewalDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch subscriptions');

      const data = await response.json();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          cost: parseFloat(formData.cost),
        }),
      });

      if (!response.ok) throw new Error('Failed to create subscription');

      const newSubscription = await response.json();
      setSubscriptions([...subscriptions, newSubscription]);
      setFormData({
        name: '',
        cost: '',
        billingCycle: 'monthly',
        category: '',
        renewalDate: '',
        notes: '',
      });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete subscription');

      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    } catch (err) {
      setError('Failed to delete subscription');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Subscriptions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : 'Add Subscription'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <input
              type="text"
              placeholder="Subscription Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <input
              type="number"
              placeholder="Monthly Cost"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
              step="0.01"
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <select
              value={formData.billingCycle}
              onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="text"
              placeholder="Category (e.g., Software, Entertainment)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <input
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              required
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Adding...' : 'Add Subscription'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {subscriptions.map((sub) => (
          <div
            key={sub._id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{sub.name}</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div>${sub.cost.toFixed(2)}/{sub.billingCycle}</div>
                <div>Category: {sub.category}</div>
                <div>Renews: {new Date(sub.renewalDate).toLocaleDateString()}</div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(sub._id)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {subscriptions.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          No subscriptions yet. Add one to get started!
        </div>
      )}
    </div>
  );
};
