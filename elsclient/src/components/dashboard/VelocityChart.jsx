import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area
} from 'recharts';
import Card from '../common/Card';

const VelocityChart = ({ data }) => {
    // Mock data if none provided
    const chartData = data || [
        { name: 'Week 1', velocity: 45, accuracy: 70, trend: 48 },
        { name: 'Week 2', velocity: 52, accuracy: 72, trend: 55 },
        { name: 'Week 3', velocity: 48, accuracy: 75, trend: 58 },
        { name: 'Week 4', velocity: 61, accuracy: 78, trend: 65 },
        { name: 'Week 5', velocity: 55, accuracy: 82, trend: 68 },
        { name: 'Week 6', velocity: 67, accuracy: 85, trend: 72 },
    ];

    return (
        <Card glass className="dashboard-section full-width">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>🚀 Learning Velocity & Trend Analysis</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select className="filter-select" style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                        <option>Last 6 Weeks</option>
                        <option>Last 3 Months</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <defs>
                            <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            scale="point"
                            padding={{ left: 30, right: 30 }}
                            tick={{ fill: 'var(--color-text-secondary)' }}
                        />
                        <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="velocity"
                            barSize={20}
                            fill="url(#colorVelocity)"
                            name="Learning Velocity"
                            radius={[10, 10, 0, 0]}
                        />
                        <Line
                            type="monotone"
                            dataKey="trend"
                            stroke="var(--color-accent-500)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--color-accent-500)' }}
                            name="Projected Trend"
                        />
                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="var(--color-success-500)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Accuracy %"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default VelocityChart;
