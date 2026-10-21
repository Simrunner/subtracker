import React, { useState, useEffect } from 'react';

interface Recommendation {
  originalService: string;
  alternativeName: string;
  originalCost: number;
  alternativeCost: number;
  monthlySavings: string;
  yearlySavings: string;
  features: string[];
  category: string;
}

interface RecommendationsProps {
  token: string;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ token }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState({ totalUnusedSpend: '0', optimizationOpportunities: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
    fetchSummary();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/recommendations/savings/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch summary');

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading recommendations...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Cost Optimization Recommendations</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>Potential Annual Savings</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
            ${summary.totalUnusedSpend}
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fef3c7' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#d97706' }}>Optimization Opportunities</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>
            {summary.optimizationOpportunities}
          </div>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Great job! Your subscriptions are already optimized. No cheaper alternatives found.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                border: '2px solid #fbbf24',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    {rec.originalService} → {rec.alternativeName}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666' }}>Current Cost</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        ${rec.originalCost.toFixed(2)}/month
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666' }}>Alternative Cost</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                        ${rec.alternativeCost.toFixed(2)}/month
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Features:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {rec.features.map((feature, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            fontSize: '13px',
                            border: '1px solid #d97706',
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    paddingLeft: '20px',
                    borderLeft: '2px solid #d97706',
                    minWidth: '150px',
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Monthly Savings</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '15px' }}>
                    ${rec.monthlySavings}
                  </div>

                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Annual Savings</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                    ${rec.yearlySavings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
