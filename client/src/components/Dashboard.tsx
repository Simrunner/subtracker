import React, { useState, useEffect } from 'react';
import { SubscriptionManager } from './SubscriptionManager';

interface Analytics {
  totalSubscriptions: number;
  totalMonthlyCost: number;
  byCategory: Record<string, number>;
  upcomingRenewals: any[];
}

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [showManager, setShowManager] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/subscriptions/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!analytics) return <div style={{ padding: '20px' }}>No data available</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>SubTracker Dashboard</h1>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => setShowManager(false)}
          style={{
            padding: '10px 20px',
            backgroundColor: showManager ? 'transparent' : '#2563eb',
            color: showManager ? '#666' : 'white',
            border: 'none',
            borderBottom: showManager ? 'none' : '2px solid #2563eb',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Analytics
        </button>
        <button
          onClick={() => setShowManager(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: showManager ? '#2563eb' : 'transparent',
            color: showManager ? 'white' : '#666',
            border: 'none',
            borderBottom: showManager ? '2px solid #2563eb' : 'none',
            cursor: 'pointer',
          }}
        >
          Manage Subscriptions
        </button>
      </div>

      {showManager ? (
        <SubscriptionManager token={token} />
      ) : (

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Subscriptions</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
            {analytics.totalSubscriptions}
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Monthly Cost</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
            ${analytics.totalMonthlyCost.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Spending by Category</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {Object.entries(analytics.byCategory).map(([category, cost]) => (
            <div
              key={category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '4px',
              }}
            >
              <span>{category}</span>
              <span style={{ fontWeight: 'bold' }}>${cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {analytics.upcomingRenewals.length > 0 && (
        <div>
          <h2>Upcoming Renewals</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {analytics.upcomingRenewals.map((renewal) => (
              <div
                key={renewal._id}
                style={{
                  padding: '15px',
                  border: '1px solid #fbbf24',
                  backgroundColor: '#fef3c7',
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{renewal.name}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Renews: {new Date(renewal.renewalDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Cost: ${renewal.cost.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      )}
    </div>
  );
};
