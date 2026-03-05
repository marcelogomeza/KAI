import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Document } from '../types';
import { UploadModal } from '../components/UploadModal';
import { FileText, Search, Filter, Plus } from 'lucide-react';

export const RepositoryPage: React.FC = () => {
    const { hasRole } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const canUpload = hasRole(['admin', 'revisor']);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/documents', {
                params: { status: statusFilter || undefined }
            });
            setDocuments(data);
        } catch (err) {
            console.error('Failed to fetch documents', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [statusFilter]);

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/documents/${id}/approve`);
            fetchDocuments();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to approve document');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete document');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            approved: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            obsolete: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Knowledge Repository</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and access your enterprise documents</p>
                </div>

                {canUpload && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Upload Document
                    </button>
                )}
            </div>

            <div className="bg-white shadow rounded-lg border border-gray-200 flex-1 flex flex-col mb-4 overflow-hidden">
                {/* Filters bar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 bg-gray-50 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center w-full sm:w-auto">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <select
                            title="status filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                        >
                            <option value="">All Statuses</option>
                            <option value="draft">Drafts</option>
                            <option value="approved">Approved</option>
                            <option value="obsolete">Obsolete</option>
                        </select>
                    </div>
                </div>

                {/* Table / List */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">Loading documents...</div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-gray-50/50">
                            <FileText className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-1">No documents found</p>
                            <p className="text-sm">Either upload a new document or change your search filters.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doc.code || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {doc.type || 'Process'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doc.ownerId || doc.uploadedBy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={doc.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(doc.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button className="text-primary-600 hover:text-primary-900">Consult</button>
                                            {canUpload && (
                                                <>
                                                    <button className="text-gray-600 hover:text-gray-900">Update</button>
                                                    {doc.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleApprove(doc.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={() => fetchDocuments()}
            />
        </div>
    );
};
