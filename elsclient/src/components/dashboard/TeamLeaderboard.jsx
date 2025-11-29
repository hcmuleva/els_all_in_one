import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import Card from '../common/Card';

// Mock data for fallback or empty states
const MOCK_TEAMS = [
    { id: 1, category: 'academic', players: new Array(5), org: { orgname: 'School A' } },
    { id: 2, category: 'sport', players: new Array(12), org: { orgname: 'Club B' } },
    { id: 3, category: 'sanskar', players: new Array(8), org: { orgname: 'Community C' } },
    { id: 4, category: 'gyan', players: new Array(6), org: { orgname: 'Library Group' } },
    { id: 5, category: 'dharm', players: new Array(10), org: { orgname: 'Volunteer Team' } },
];

const TeamLeaderboard = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await teamAPI.getAll();
                // Use real data if available, otherwise fallback to mock
                if (response.data && response.data.length > 0) {
                    setTeams(response.data);
                } else {
                    setTeams(MOCK_TEAMS);
                }
            } catch (error) {
                console.error('Failed to fetch teams:', error);
                setTeams(MOCK_TEAMS);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    // Helper to get random score for demo purposes
    const getScore = (id) => 1000 + (id * 150) + Math.floor(Math.random() * 100);

    // Helper to get member count safely
    const getMemberCount = (team) => {
        if (team.players && Array.isArray(team.players)) {
            return team.players.length;
        }
        // Fallback for demo/visual purposes if players aren't populated
        return Math.floor(Math.random() * 15) + 3;
    };

    const sortedTeams = [...teams].sort((a, b) => getScore(b.id) - getScore(a.id));

    if (loading) {
        return (
            <Card glass className="dashboard-section">
                <h3>👥 Team Leaderboard</h3>
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading teams...</div>
            </Card>
        );
    }

    return (
        <Card glass className="dashboard-section">
            <h3>👥 Team Leaderboard</h3>
            <div className="team-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sortedTeams.slice(0, 5).map((team, index) => (
                    <div key={team.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: index === 0 ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)' : 'var(--color-bg-primary)',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                    }}>
                        <div style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--color-gray-200)',
                            color: index < 3 ? 'white' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            marginRight: '1rem'
                        }}>
                            {index + 1}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                {team.org?.orgname || `Team ${team.id}`}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                {team.category ? team.category.charAt(0).toUpperCase() + team.category.slice(1) : 'General'} • {getMemberCount(team)} Members
                            </div>
                        </div>

                        <div style={{ fontWeight: 'bold', color: 'var(--color-primary-600)' }}>
                            {getScore(team.id)} pts
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TeamLeaderboard;
