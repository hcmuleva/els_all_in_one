import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const result = await register(formData.username, formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1 className="gradient-text">Join ELS Learning</h1>
                    <p>Create your account and start learning today</p>
                </div>

                <Card className="register-card">
                    <form onSubmit={handleSubmit} className="register-form">
                        <Input
                            label="Username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            helperText="Minimum 6 characters"
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        {error && (
                            <div className="register-error">
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
                            Create Account
                        </Button>

                        <div className="register-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="register-link">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
