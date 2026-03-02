import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
    hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
    });

    // Rehydrate state on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('kai_token');
        const storedUser = localStorage.getItem('kai_user');

        if (storedToken && storedUser) {
            setAuthState({
                user: JSON.parse(storedUser),
                token: storedToken,
                isAuthenticated: true,
            });
        }
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('kai_token', token);
        localStorage.setItem('kai_user', JSON.stringify(user));
        setAuthState({ user, token, isAuthenticated: true });
    };

    const logout = () => {
        localStorage.removeItem('kai_token');
        localStorage.removeItem('kai_user');
        setAuthState({ user: null, token: null, isAuthenticated: false });
    };

    const hasRole = (roles: Role[]) => {
        if (!authState.user) return false;
        return roles.includes(authState.user.role);
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
