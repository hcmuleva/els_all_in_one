import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.identifier, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="gradient-text">ELS Learning Platform</h1>
                    <p>Sign in to continue your learning journey</p>
                </div>

                <Card className="login-card">
                    <form onSubmit={handleSubmit} className="login-form">
                        <Input
                            label="Email or Username"
                            name="identifier"
                            type="text"
                            placeholder="Enter your email or username"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        {error && (
                            <div className="login-error">
                                <span>⚠️ {error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Sign In
                        </Button>

                        <div className="login-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="login-link">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
