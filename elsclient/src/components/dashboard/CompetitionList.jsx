import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const CompetitionList = () => {
    const [filter, setFilter] = useState('All');

    // Mock competition data
    const competitions = [
        {
            id: 1,
            name: 'National Science Olympiad 2024',
            date: '2024-11-15',
            type: 'National',
            status: 'Upcoming',
            participants: 1250,
            tags: ['Science', 'Olympiad'],
        },
        {
            id: 2,
            name: 'State Math Championship',
            date: '2024-10-20',
            type: 'State',
            status: 'Live',
            participants: 450,
            tags: ['Math', 'Championship'],
        },
        {
            id: 3,
            name: 'District Coding Hackathon',
            date: '2024-12-05',
            type: 'District',
            status: 'Upcoming',
            participants: 200,
            tags: ['Coding', 'Hackathon'],
        },
        {
            id: 4,
            name: 'School General Knowledge Quiz',
            date: '2024-09-30',
            type: 'Local',
            status: 'Completed',
            participants: 120,
            tags: ['GK', 'Quiz'],
        },
        {
            id: 5,
            name: 'International Physics Brawl',
            date: '2025-01-10',
            type: 'International',
            status: 'Upcoming',
            participants: 5000,
            tags: ['Physics', 'International'],
        },
    ];

    const filters = ['All', 'Upcoming', 'Live', 'Completed'];

    const filteredCompetitions = filter === 'All'
        ? competitions
        : competitions.filter(c => c.status === filter);

    return (
        <Card glass className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>🏆 Competitions</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                border: 'none',
                                background: filter === f ? 'var(--color-primary-500)' : 'var(--color-bg-secondary)',
                                color: filter === f ? 'white' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="competition-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredCompetitions.map(comp => (
                    <div key={comp.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'var(--color-bg-primary)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        borderLeft: `4px solid ${comp.status === 'Live' ? 'var(--color-error-500)' :
                                comp.status === 'Upcoming' ? 'var(--color-info-500)' :
                                    'var(--color-success-500)'
                            }`
                    }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>{comp.name}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <span>📅 {comp.date}</span>
                                <span>•</span>
                                <span>👥 {comp.participants} Participants</span>
                                <span>•</span>
                                <span style={{ fontWeight: 500 }}>{comp.type}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className={`badge ${comp.status === 'Live' ? 'badge-active' : ''
                                }`} style={{
                                    background: comp.status === 'Live' ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-gray-100)',
                                    color: comp.status === 'Live' ? 'var(--color-error-500)' : 'var(--color-text-secondary)',
                                    borderColor: comp.status === 'Live' ? 'var(--color-error-500)' : 'var(--color-border)'
                                }}>
                                {comp.status}
                            </span>
                            <div style={{ marginTop: '0.5rem' }}>
                                <Button size="sm" variant={comp.status === 'Completed' ? 'secondary' : 'primary'}>
                                    {comp.status === 'Completed' ? 'View Results' : 'Register'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CompetitionList;
