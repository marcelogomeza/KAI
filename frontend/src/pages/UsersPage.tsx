import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Role } from '../types';
import { Plus, Search, Edit2, Trash2, X, Shield, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as Role,
        orgRole: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users${search ? `?search=${search}` : ''}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.patch(`/users/${editingUser.id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'user', orgRole: '' });
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email,
            password: '', // Don't show password
            role: user.role,
            orgRole: user.orgRole || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const roles: { value: Role; label: string }[] = [
        { value: 'admin', label: 'Administrator' },
        { value: 'hr', label: 'Recursos Humanos' },
        { value: 'auditor', label: 'Auditor' },
        { value: 'user', label: 'Usuario' },
        { value: 'revisor', label: 'Revisor' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage platform users and their organizational roles</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ name: '', email: '', password: '', role: 'user', orgRole: '' });
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Platform Role</th>
                                <th className="px-6 py-4">Organizational Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.name || 'No Name'}</p>
                                                <p className="text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            user.role === 'admin' ? "bg-purple-100 text-purple-800" :
                                                user.role === 'hr' ? "bg-blue-100 text-blue-800" :
                                                    user.role === 'auditor' ? "bg-orange-100 text-orange-800" :
                                                        "bg-gray-100 text-gray-800"
                                        )}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {roles.find(r => r.value === user.role)?.label || user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.orgRole || <span className="text-gray-400 italic">Not set</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {/* @ts-ignore */}
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && !loading && (
                    <div className="p-12 text-center">
                        <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="text-gray-500">Try adjusting your search or create a new user.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit User' : 'Create New User'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {editingUser && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}
                                    </label>
                                    <input
                                        required={!editingUser}
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                    >
                                        {roles.map(role => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organizational Role</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.orgRole}
                                        onChange={(e) => setFormData({ ...formData, orgRole: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g. IT Manager"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-sm"
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
