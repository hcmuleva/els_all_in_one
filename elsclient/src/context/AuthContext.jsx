import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentOrg, setCurrentOrg] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('user');
        const savedOrg = localStorage.getItem('currentOrg');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            if (savedOrg) {
                setCurrentOrg(JSON.parse(savedOrg));
            }
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        try {
            const data = await authAPI.login(identifier, password);
            setUser(data.user);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error?.message || 'Login failed',
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await authAPI.register(username, email, password);
            setUser(data.user);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                error: error.response?.data?.error?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        setUser(null);
        setCurrentOrg(null);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('currentOrg');
    };

    const selectOrg = (org) => {
        setCurrentOrg(org);
        localStorage.setItem('currentOrg', JSON.stringify(org));
    };

    const value = {
        user,
        loading,
        currentOrg,
        login,
        register,
        logout,
        selectOrg,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
