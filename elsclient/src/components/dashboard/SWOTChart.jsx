import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import Card from '../common/Card';

const SWOTChart = ({ data }) => {
    // Mock data for SWOT analysis
    const chartData = data || [
        { subject: 'Math', A: 120, B: 110, fullMark: 150 },
        { subject: 'Physics', A: 98, B: 130, fullMark: 150 },
        { subject: 'Chemistry', A: 86, B: 130, fullMark: 150 },
        { subject: 'Biology', A: 99, B: 100, fullMark: 150 },
        { subject: 'English', A: 85, B: 90, fullMark: 150 },
        { subject: 'History', A: 65, B: 85, fullMark: 150 },
    ];

    const swotData = [
        { category: 'Strengths', value: 85, color: 'var(--color-success-500)' },
        { category: 'Weaknesses', value: 45, color: 'var(--color-error-500)' },
        { category: 'Opportunities', value: 70, color: 'var(--color-info-500)' },
        { category: 'Threats', value: 30, color: 'var(--color-warning-500)' },
    ];

    return (
        <Card glass className="dashboard-section">
            <h3>🎯 SWOT Analysis</h3>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="var(--color-border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="var(--color-border)" />
                        <Radar
                            name="My Performance"
                            dataKey="A"
                            stroke="var(--color-primary-500)"
                            strokeWidth={2}
                            fill="var(--color-primary-500)"
                            fillOpacity={0.4}
                        />
                        <Radar
                            name="Class Average"
                            dataKey="B"
                            stroke="var(--color-accent-500)"
                            strokeWidth={2}
                            fill="var(--color-accent-500)"
                            fillOpacity={0.2}
                        />
                        <Legend />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none'
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="swot-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1rem'
            }}>
                {swotData.map((item) => (
                    <div key={item.category} style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'var(--color-bg-secondary)',
                        borderLeft: `4px solid ${item.color}`
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {item.category}
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                            {item.value}%
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SWOTChart;
