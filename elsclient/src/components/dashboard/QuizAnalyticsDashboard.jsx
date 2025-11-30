import React, { useState, useEffect } from 'react';
import quizAnalyticsAPI from '../../services/quizAnalytics';
import StatCard from './analytics/StatCard';
import MetricSelector from './analytics/MetricSelector';
import TrendChart from './analytics/TrendChart';
import ProgressionChart from './analytics/ProgressionChart';
import './analytics/QuizAnalytics.css';

const QuizAnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [progressionData, setProgressionData] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState(['totalAttempts', 'avgScore']);
    const [progressionMetrics, setProgressionMetrics] = useState(['score', 'correct']);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [summaryData, trends, progression] = await Promise.all([
                quizAnalyticsAPI.getSummary(),
                quizAnalyticsAPI.getTrendData(),
                quizAnalyticsAPI.getSubjectGroupedProgression()
            ]);
            setSummary(summaryData);
            setTrendData(trends);
            setProgressionData(progression);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMetricToggle = (metricId) => {
        setSelectedMetrics(prev => {
            if (prev.includes(metricId)) {
                // Don't allow deselecting if it's the last one
                if (prev.length === 1) return prev;
                return prev.filter(m => m !== metricId);
            } else {
                return [...prev, metricId];
            }
        });
    };

    const handleProgressionMetricToggle = (metricId) => {
        setProgressionMetrics(prev => {
            if (prev.includes(metricId)) {
                // Don't allow deselecting if it's the last one
                if (prev.length === 1) return prev;
                return prev.filter(m => m !== metricId);
            } else {
                return [...prev, metricId];
            }
        });
    };

    const handleSubjectToggle = (subject) => {
        if (subject === 'ALL') {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects(prev => {
                if (prev.includes(subject)) {
                    return prev.filter(s => s !== subject);
                } else {
                    return [...prev, subject];
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="spinner"></div>
                <p>Loading your analytics...</p>
            </div>
        );
    }

    if (!summary || summary.totalAttempts === 0) {
        return (
            <div className="analytics-empty">
                <div className="empty-state-analytics">
                    <div className="empty-icon-large">📊</div>
                    <h2>No Quiz Data Yet</h2>
                    <p>Take some quizzes to see your performance analytics!</p>
                    <a href="/subjects" className="btn-primary-analytics">
                        Start Learning →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-analytics-dashboard">
            <div className="analytics-header">
                <h2>📊 Quiz Performance Analytics</h2>
                <p>Track your progress and identify areas for improvement</p>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid-analytics">
                <StatCard
                    icon="🎯"
                    label="Total Quizzes"
                    value={summary.totalAttempts}
                    className="stat-primary"
                />
                <StatCard
                    icon="⭐"
                    label="Average Score"
                    value={`${summary.averageScore}%`}
                    className="stat-success"
                />
                <StatCard
                    icon="⏱️"
                    label="Avg Time"
                    value={`${Math.floor(summary.averageTime / 60)}m ${summary.averageTime % 60}s`}
                    className="stat-info"
                />
                <StatCard
                    icon="🏆"
                    label="Best Subject"
                    value={summary.bestSubject || 'N/A'}
                    subtext={summary.bestTopic ? `Topic: ${summary.bestTopic}` : null}
                    className="stat-accent"
                />
            </div>

            {/* Metric Selector & Trend Chart */}
            <div className="analytics-main-content">
                <div className="analytics-controls">
                    <MetricSelector
                        selectedMetrics={selectedMetrics}
                        onMetricToggle={handleMetricToggle}
                    />
                </div>

                <div className="analytics-chart-section">
                    <TrendChart
                        data={trendData}
                        selectedMetrics={selectedMetrics}
                    />
                </div>
            </div>

            {/* Progression Chart */}
            <div className="analytics-progression-section">
                <ProgressionChart
                    data={progressionData}
                    selectedMetrics={progressionMetrics}
                    onMetricToggle={handleProgressionMetricToggle}
                    selectedSubjects={selectedSubjects}
                    onSubjectToggle={handleSubjectToggle}
                />
            </div>
        </div>
    );
};

export default QuizAnalyticsDashboard;
