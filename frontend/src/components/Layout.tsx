import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Settings, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Repository', path: '/', icon: BookOpen },
        {
            name: 'Users', path: '/users', icon: UserIcon, roles: ['admin'], children: [
                { name: 'All Users', path: '/users' },
                { name: 'System Roles', path: '/users/system-roles' },
                { name: 'Organization Roles', path: '/users/organization-roles' },
                { name: 'Organizational Structure', path: '/users/org-structure' },
            ]
        },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
    ];

    const [openMenus, setOpenMenus] = React.useState<string[]>(['Users']);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden sm:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h1 className="text-2xl font-black text-primary-600 tracking-tight">KAI <span className="text-gray-400 text-sm font-medium">MVP</span></h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        // Check role permissions for nav items
                        if (item.roles && user && !item.roles.includes(user.role)) return null;

                        const isActive = location.pathname === item.path;
                        const hasChildren = item.children && item.children.length > 0;
                        const isOpen = openMenus.includes(item.name);
                        const Icon = item.icon;

                        return (
                            <div key={item.name} className="space-y-1">
                                <button
                                    onClick={() => hasChildren ? toggleMenu(item.name) : navigate(item.path)}
                                    className={clsx(
                                        isActive && !hasChildren ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors'
                                    )}
                                >
                                    <Icon className={clsx(isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                    <span className="flex-1 text-left">{item.name}</span>
                                    {hasChildren && (
                                        <svg
                                            className={clsx(
                                                'ml-3 h-4 w-4 transform transition-transform duration-150',
                                                isOpen ? 'rotate-180' : 'rotate-0'
                                            )}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </button>

                                {hasChildren && isOpen && (
                                    <div className="pl-10 space-y-1">
                                        {item.children?.map((child) => (
                                            <button
                                                key={child.name}
                                                onClick={() => navigate(child.path)}
                                                className={clsx(
                                                    location.pathname === child.path ? 'text-primary-600 font-semibold' : 'text-gray-500 hover:text-gray-900',
                                                    'block px-2 py-1.5 text-sm w-full text-left rounded-md transition-colors'
                                                )}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                            {user?.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header (placeholder) */}
                <header className="sm:hiddenbg-white h-16 border-b border-gray-200 flex items-center justify-between px-4">
                    <h1 className="text-xl font-bold text-primary-600">KAI</h1>
                    <button onClick={handleLogout} className="text-gray-500"><LogOut className="h-5 w-5" /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
