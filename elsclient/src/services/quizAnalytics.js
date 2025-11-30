import { quizResultAPI } from './quizResult';

/**
 * Analytics service for quiz results
 * Aggregates and processes quiz data for dashboard visualizations
 */

export const quizAnalyticsAPI = {
    /**
     * Get summary statistics for current user
     */
    getSummary: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];

        if (data.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                averageTime: 0,
                bestSubject: null,
                bestTopic: null
            };
        }

        const totalAttempts = data.length;
        const totalScore = data.reduce((sum, r) => sum + (r.percentage || 0), 0);
        const totalTime = data.reduce((sum, r) => sum + (r.timeTaken || 0), 0);
        const averageScore = Math.round(totalScore / totalAttempts);
        const averageTime = Math.round(totalTime / totalAttempts);

        // Find best subject
        const subjectScores = {};
        data.forEach(result => {
            const subjectName = result.subject?.name || 'Unknown';
            if (!subjectScores[subjectName]) {
                subjectScores[subjectName] = { total: 0, count: 0 };
            }
            subjectScores[subjectName].total += result.percentage || 0;
            subjectScores[subjectName].count += 1;
        });

        let bestSubject = null;
        let bestSubjectAvg = 0;
        Object.entries(subjectScores).forEach(([name, stats]) => {
            const avg = stats.total / stats.count;
            if (avg > bestSubjectAvg) {
                bestSubjectAvg = avg;
                bestSubject = name;
            }
        });

        // Find best topic
        const topicScores = {};
        data.forEach(result => {
            const topicName = result.topic?.name || 'Unknown';
            if (!topicScores[topicName]) {
                topicScores[topicName] = { total: 0, count: 0 };
            }
            topicScores[topicName].total += result.percentage || 0;
            topicScores[topicName].count += 1;
        });

        let bestTopic = null;
        let bestTopicAvg = 0;
        Object.entries(topicScores).forEach(([name, stats]) => {
            const avg = stats.total / stats.count;
            if (avg > bestTopicAvg) {
                bestTopicAvg = avg;
                bestTopic = name;
            }
        });

        return {
            totalAttempts,
            averageScore,
            averageTime,
            bestSubject,
            bestTopic
        };
    },

    /**
     * Get trend data grouped by date
     */
    getTrendData: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];

        // Group by date
        const trendByDate = {};

        data.forEach(result => {
            const date = result.createdAt ? new Date(result.createdAt).toISOString().split('T')[0] : 'Unknown';

            if (!trendByDate[date]) {
                trendByDate[date] = {
                    date,
                    totalAttempts: 0,
                    totalScore: 0,
                    totalTime: 0,
                    bySubject: {},
                    byTopic: {}
                };
            }

            trendByDate[date].totalAttempts += 1;
            trendByDate[date].totalScore += result.percentage || 0;
            trendByDate[date].totalTime += result.timeTaken || 0;

            // By subject
            const subjectName = result.subject?.name || 'Unknown';
            if (!trendByDate[date].bySubject[subjectName]) {
                trendByDate[date].bySubject[subjectName] = { attempts: 0, totalScore: 0 };
            }
            trendByDate[date].bySubject[subjectName].attempts += 1;
            trendByDate[date].bySubject[subjectName].totalScore += result.percentage || 0;

            // By topic
            const topicName = result.topic?.name || 'Unknown';
            if (!trendByDate[date].byTopic[topicName]) {
                trendByDate[date].byTopic[topicName] = { attempts: 0, totalScore: 0 };
            }
            trendByDate[date].byTopic[topicName].attempts += 1;
            trendByDate[date].byTopic[topicName].totalScore += result.percentage || 0;
        });

        // Convert to array and calculate averages
        const trendArray = Object.values(trendByDate).map(day => ({
            date: day.date,
            totalAttempts: day.totalAttempts,
            avgScore: Math.round(day.totalScore / day.totalAttempts),
            avgTime: Math.round(day.totalTime / day.totalAttempts),
            bySubject: Object.entries(day.bySubject).reduce((acc, [name, stats]) => {
                acc[name] = {
                    attempts: stats.attempts,
                    avgScore: Math.round(stats.totalScore / stats.attempts)
                };
                return acc;
            }, {}),
            byTopic: Object.entries(day.byTopic).reduce((acc, [name, stats]) => {
                acc[name] = {
                    attempts: stats.attempts,
                    avgScore: Math.round(stats.totalScore / stats.attempts)
                };
                return acc;
            }, {})
        }));

        // Sort by date
        trendArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        return trendArray;
    },

    /**
     * Get unique subjects from results
     */
    getSubjects: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];
        const subjects = new Set();
        data.forEach(result => {
            if (result.subject?.name) {
                subjects.add(result.subject.name);
            }
        });
        return Array.from(subjects);
    },

    /**
     * Get unique topics from results
     */
    getTopics: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];
        const topics = new Set();
        data.forEach(result => {
            if (result.topic?.name) {
                topics.add(result.topic.name);
            }
        });
        return Array.from(topics);
    },

    /**
     * Get progression data by attempt number
     */
    getProgressionData: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];

        if (data.length === 0) {
            return [];
        }

        // Sort by creation date (oldest first for progression)
        const sortedResults = data.sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        // Track cumulative stats by subject and topic
        const subjectStats = {};
        const topicStats = {};

        const progressionArray = sortedResults.map((result, index) => {
            const attemptNum = index + 1;
            const subjectName = result.subject?.name || 'Unknown';
            const topicName = result.topic?.name || 'Unknown';

            // Calculate correct and wrong from score
            const totalQuestions = result.totalQuestions || 10;
            const correct = result.score || 0;
            const wrong = totalQuestions - correct;

            // Update cumulative counts
            if (!subjectStats[subjectName]) {
                subjectStats[subjectName] = { count: 0, totalScore: 0 };
            }
            subjectStats[subjectName].count += 1;
            subjectStats[subjectName].totalScore += result.percentage || 0;

            if (!topicStats[topicName]) {
                topicStats[topicName] = { count: 0, totalScore: 0 };
            }
            topicStats[topicName].count += 1;
            topicStats[topicName].totalScore += result.percentage || 0;

            // Build progression data point
            const dataPoint = {
                attempt: attemptNum,
                score: result.percentage || 0,
                time: Math.round((result.timeTaken || 0) / 60), // minutes
                correct,
                wrong,
                subject: subjectName,
                topic: topicName,
                bySubject: {},
                byTopic: {}
            };

            // Add cumulative averages for each subject/topic
            Object.entries(subjectStats).forEach(([name, stats]) => {
                dataPoint.bySubject[name] = Math.round(stats.totalScore / stats.count);
            });

            Object.entries(topicStats).forEach(([name, stats]) => {
                dataPoint.byTopic[name] = Math.round(stats.totalScore / stats.count);
            });

            return dataPoint;
        });

        return progressionArray;
    },

    /**
     * Get progression data grouped by subject
     */
    getSubjectGroupedProgression: async () => {
        const results = await quizResultAPI.getMyResults();
        const data = results.data || [];

        if (data.length === 0) {
            return [];
        }

        // Group by subject
        const subjectGroups = {};

        data.forEach((result, index) => {
            const subjectName = result.subject?.name || 'Unknown';

            if (!subjectGroups[subjectName]) {
                subjectGroups[subjectName] = [];
            }

            const totalQuestions = result.totalQuestions || 10;
            const correct = result.score || 0;
            const wrong = totalQuestions - correct;

            subjectGroups[subjectName].push({
                attemptInSubject: subjectGroups[subjectName].length + 1,
                score: result.percentage || 0,
                time: Math.round((result.timeTaken || 0) / 60),
                correct,
                wrong,
                topic: result.topic?.name || 'Unknown',
                date: result.createdAt
            });
        });

        // Convert to array format for charting
        const chartData = [];
        Object.entries(subjectGroups).forEach(([subject, attempts]) => {
            attempts.forEach((attempt, idx) => {
                chartData.push({
                    subject,
                    subjectAttempt: `${subject} #${idx + 1}`,
                    attemptNum: idx + 1,
                    ...attempt
                });
            });
        });

        return chartData;
    }
};

export default quizAnalyticsAPI;

