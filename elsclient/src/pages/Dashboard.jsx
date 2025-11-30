import { useAuth } from '../context/AuthContext';
import QuizAnalyticsDashboard from '../components/dashboard/QuizAnalyticsDashboard';
import './Dashboard.css';

// Assets
import bannerImage from '../assets/banner-kids.png';
import avatarImage from '../assets/avatar-student.png';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <div className="container dashboard-container">
                {/* Header with Banner */}
                <div className="dashboard-banner-section animate-slide-down">
                    <div className="banner-wrapper">
                        <img src={bannerImage} alt="Welcome Banner" className="dashboard-banner-img" />
                        <div className="banner-content">
                            <div className="user-profile-header">
                                <img src={avatarImage} alt="User Avatar" className="user-avatar-large" />
                                <div className="user-greeting">
                                    <h1>Hi, {user?.username || 'Explorer'}! 👋</h1>
                                    <p>Track your learning progress</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Analytics Dashboard */}
                <QuizAnalyticsDashboard />
            </div>
        </div>
    );
};

export default Dashboard;
