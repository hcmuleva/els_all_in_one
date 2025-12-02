import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../services/subjects';
import './GK3Page.css';

const GK3Page = () => {
    console.log("GK3Page");
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const SUBJECT_ID = "gvzucbgegjcfiz5ojzugwj9l";

    const [debugData, setDebugData] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // Fetch specific GK3 subject by ID
                const response = await subjectAPI.getById(SUBJECT_ID);
                console.log("GK3 API Response:", response);
                setDebugData(response);

                const gk3Subject = response.data;

                if (gk3Subject && gk3Subject.topics) {
                    console.log("Topics:", gk3Subject.topics);
                    setTopics(gk3Subject.topics);
                } else {
                    console.warn("GK3 Subject found but no topics or invalid structure:", gk3Subject);
                }
            } catch (error) {
                console.error("Failed to fetch GK3 topics:", error);
                setDebugData({ error: error.message });
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    if (loading) {
        return (
            <div className="gk3-page container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (topics.length === 0) {
        return (
            <div className="gk3-page container">
                <h1 className="gk3-title">General Knowledge (GK3)</h1>
                <div className="error-message">
                    <p>No topics found.</p>
                    <details style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                        <summary>Debug Info</summary>
                        <pre style={{ textAlign: 'left', overflow: 'auto' }}>
                            {JSON.stringify(debugData, null, 2)}
                        </pre>
                    </details>
                </div>
            </div>
        );
    }

    return (
        <div className="gk3-page container">
            <h1 className="gk3-title">General Knowledge (GK3)</h1>
            <div className="gk3-grid">
                {topics.map((topic) => (
                    <div key={topic.id} className="gk3-card">
                        <div className="gk3-icon">{topic.icon || '📚'}</div>
                        <h3 className="gk3-topic-name">{topic.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GK3Page;
