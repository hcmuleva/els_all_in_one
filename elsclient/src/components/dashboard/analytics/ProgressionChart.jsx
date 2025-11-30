import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ProgressionMetricSelector from './ProgressionMetricSelector';
import SubjectFilter from './SubjectFilter';
import './QuizAnalytics.css';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;

        return (
            <div className="custom-tooltip">
                <div className="tooltip-header">
                    <strong>{data.subject} - Attempt #{data.attemptNum}</strong>
                </div>
                <div className="tooltip-context">
                    <div className="tooltip-info">📝 Topic: <strong>{data.topic}</strong></div>
                </div>
                <div className="tooltip-divider"></div>
                <div className="tooltip-metrics">
                    {payload.map((entry, index) => (
                        <div key={index} className="tooltip-metric">
                            <span className="tooltip-dot" style={{ backgroundColor: entry.fill }}></span>
                            <span className="tooltip-label">{entry.name}:</span>
                            <strong className="tooltip-value">
                                {entry.name.includes('Score') || entry.name.includes('Avg')
                                    ? `${entry.value}%`
                                    : entry.name === 'Time'
                                        ? `${entry.value}min`
                                        : entry.value}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const ProgressionChart = ({ data, selectedMetrics, onMetricToggle, selectedSubjects, onSubjectToggle }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-empty">
                <div className="empty-icon">📈</div>
                <p>No progression data yet. Complete more quizzes to see your improvement!</p>
            </div>
        );
    }

    // Get unique subjects from data
    const allSubjects = [...new Set(data.map(d => d.subject))].filter(s => s !== 'Unknown');

    // Filter data by selected subjects
    const filteredData = selectedSubjects.length > 0
        ? data.filter(d => selectedSubjects.includes(d.subject))
        : data;

    const colors = {
        score: '#667eea',
        time: '#4299e1',
        correct: '#48bb78',
        wrong: '#ed8936'
    };

    return (
        <div className="trend-chart-container">
            <h3 className="chart-title">Performance by Subject & Attempt</h3>
            <p className="chart-subtitle">Compare your attempts across different subjects</p>

            {/* Subject Filter */}
            <SubjectFilter
                subjects={allSubjects}
                selectedSubjects={selectedSubjects}
                onSubjectToggle={onSubjectToggle}
            />

            {/* Metric Selector */}
            <ProgressionMetricSelector
                selectedMetrics={selectedMetrics}
                onMetricToggle={onMetricToggle}
            />

            {filteredData.length === 0 ? (
                <div className="chart-empty">
                    <div className="empty-icon">🔍</div>
                    <p>No data for selected subjects. Try selecting different subjects.</p>
                </div>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="subjectAttempt"
                                stroke="#666"
                                style={{ fontSize: '11px' }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis
                                stroke="#666"
                                style={{ fontSize: '12px' }}
                                label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />

                            {/* Score */}
                            {selectedMetrics.includes('score') && (
                                <Bar
                                    dataKey="score"
                                    fill={colors.score}
                                    name="Score (%)"
                                />
                            )}

                            {/* Time */}
                            {selectedMetrics.includes('time') && (
                                <Bar
                                    dataKey="time"
                                    fill={colors.time}
                                    name="Time (min)"
                                />
                            )}

                            {/* Correct Answers */}
                            {selectedMetrics.includes('correct') && (
                                <Bar
                                    dataKey="correct"
                                    fill={colors.correct}
                                    name="Correct"
                                />
                            )}

                            {/* Wrong Answers */}
                            {selectedMetrics.includes('wrong') && (
                                <Bar
                                    dataKey="wrong"
                                    fill={colors.wrong}
                                    name="Wrong"
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="chart-info-note">
                        <p>💡 {selectedSubjects.length > 0
                            ? `Showing ${filteredData.length} attempts for ${selectedSubjects.length} subject(s)`
                            : `Showing all ${filteredData.length} attempts`}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProgressionChart;
