import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import './QuizAnalytics.css';

const TrendChart = ({ data, selectedMetrics }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-empty">
                <div className="empty-icon">📊</div>
                <p>No quiz data yet. Take some quizzes to see your progress!</p>
            </div>
        );
    }

    // Transform data for chart
    const chartData = data.map(day => {
        const item = {
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        if (selectedMetrics.includes('totalAttempts')) {
            item.attempts = day.totalAttempts;
        }

        if (selectedMetrics.includes('avgScore')) {
            item.score = day.avgScore;
        }

        if (selectedMetrics.includes('avgTime')) {
            item.time = Math.round(day.avgTime / 60); // Convert to minutes
        }

        // Add subject data if selected
        if (selectedMetrics.includes('bySubject')) {
            Object.entries(day.bySubject).forEach(([subject, stats]) => {
                item[`${subject}_attempts`] = stats.attempts;
            });
        }

        // Add topic data if selected
        if (selectedMetrics.includes('byTopic')) {
            Object.entries(day.byTopic).forEach(([topic, stats]) => {
                item[`${topic}_attempts`] = stats.attempts;
            });
        }

        return item;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a28fd0', '#ffb6c1'];
    let colorIndex = 0;

    return (
        <div className="trend-chart-container">
            <h3 className="chart-title">Quiz Performance Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#666"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '10px'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    {selectedMetrics.includes('totalAttempts') && (
                        <Line
                            type="monotone"
                            dataKey="attempts"
                            stroke={colors[colorIndex++]}
                            strokeWidth={2}
                            name="Total Attempts"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}

                    {selectedMetrics.includes('avgScore') && (
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke={colors[colorIndex++]}
                            strokeWidth={2}
                            name="Avg Score (%)"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}

                    {selectedMetrics.includes('avgTime') && (
                        <Line
                            type="monotone"
                            dataKey="time"
                            stroke={colors[colorIndex++]}
                            strokeWidth={2}
                            name="Avg Time (min)"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}

                    {selectedMetrics.includes('bySubject') && chartData.length > 0 && (
                        Object.keys(chartData[0])
                            .filter(key => key.endsWith('_attempts') && !key.includes('Unknown'))
                            .map(key => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[colorIndex++ % colors.length]}
                                    strokeWidth={2}
                                    name={key.replace('_attempts', '')}
                                    dot={{ r: 3 }}
                                />
                            ))
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
