import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Download, Upload, ChevronRight, ChevronDown, Briefcase, Building2 } from 'lucide-react';
import { clsx } from 'clsx';

interface OrgUnit {
    id: string;
    name: string;
    type: string;
    parentId: string | null;
}

interface Job {
    id: string;
    name: string;
    unitId: string;
}

interface OrgNode extends OrgUnit {
    children: OrgNode[];
    positions: Job[];
}

export const OrgStructurePage: React.FC = () => {
    const [units, setUnits] = useState<OrgUnit[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'unit' | 'job'>('unit');
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/org-structure');
            setUnits(response.data.units);
            setJobs(response.data.jobs);
        } catch (error) {
            console.error('Error fetching structure:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const buildTree = (parentId: string | null = null): OrgNode[] => {
        return units
            .filter(unit => unit.parentId === parentId)
            .map(unit => ({
                ...unit,
                children: buildTree(unit.id),
                positions: jobs.filter(job => job.unitId === unit.id)
            }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'unit') {
                await api.post('/org-structure/unit', {
                    name: formData.name,
                    type: 'unit',
                    parentId: selectedParent
                });
            } else {
                await api.post('/org-structure/job', {
                    name: formData.name,
                    unitId: selectedParent
                });
            }
            setIsAddModalOpen(false);
            setFormData({ name: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding:', error);
        }
    };

    const handleDeleteUnit = async (id: string) => {
        if (window.confirm('Are you sure? This will delete the unit (and potentially detach children).')) {
            await api.delete(`/org-structure/unit/${id}`);
            fetchData();
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (window.confirm('Delete this position?')) {
            await api.delete(`/org-structure/job/${id}`);
            fetchData();
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('/org-structure/bulk', formData);
            fetchData();
            alert('Uploaded successfully');
        } catch (error) {
            alert('Upload failed');
        }
    };

    const handleDownload = async () => {
        const response = await api.get('/org-structure/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'org_structure.csv');
        document.body.appendChild(link);
        link.click();
    };

    const OrgTreeNode: React.FC<{ node: OrgNode, level: number }> = ({ node, level }) => {
        const isExpanded = expanded[node.id];
        const hasChildren = node.children.length > 0 || node.positions.length > 0;

        return (
            <div className="ml-6 py-1">
                <div className="flex items-center group">
                    <button
                        onClick={() => toggleExpand(node.id)}
                        className={clsx(
                            "p-1 hover:bg-gray-100 rounded transition-colors",
                            !hasChildren && "invisible"
                        )}
                    >
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </button>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[200px] hover:border-primary-300 transition-all">
                        <Building2 className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="font-medium text-gray-700">{node.name}</span>

                        <div className="ml-auto flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => { setModalType('unit'); setSelectedParent(node.id); setIsAddModalOpen(true); }}
                                title="Add Unit"
                                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => { setModalType('job'); setSelectedParent(node.id); setIsAddModalOpen(true); }}
                                title="Add Position"
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                            >
                                <Briefcase className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDeleteUnit(node.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="border-l border-gray-200 ml-2 mt-1">
                        {node.positions.map(pos => (
                            <div key={pos.id} className="ml-8 py-1 flex items-center group">
                                <div className="flex items-center bg-green-50 border border-green-100 rounded-lg px-3 py-1.5 min-w-[180px]">
                                    <Briefcase className="w-3 h-3 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-green-800">{pos.name}</span>
                                    <button
                                        onClick={() => handleDeleteJob(pos.id)}
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-green-400 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {node.children.map(child => (
                            <OrgTreeNode key={child.id} node={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const tree = buildTree();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organizational Structure</h1>
                    <p className="text-gray-500 mt-1">Define units, hierarchical relationships, and job positions</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={handleDownload} className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm font-semibold">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </button>
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm font-semibold cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" /> Import CSV
                        <input type="file" onChange={handleBulkUpload} className="hidden" />
                    </label>
                    <button
                        onClick={() => { setModalType('unit'); setSelectedParent(null); setIsAddModalOpen(true); }}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-semibold"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Root Unit
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-x-auto min-h-[500px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">Loading structure...</div>
                ) : tree.length > 0 ? (
                    <div className="min-w-max">
                        {tree.map(root => (
                            <OrgTreeNode key={root.id} node={root} level={0} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No organizational units defined yet.</p>
                        <button
                            onClick={() => { setModalType('unit'); setSelectedParent(null); setIsAddModalOpen(true); }}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            Create the first unit
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Add {modalType === 'unit' ? 'Unit' : 'Position'}
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ name: e.target.value })}
                                    placeholder={modalType === 'unit' ? "e.g. IT Department" : "e.g. Senior Developer"}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold shadow-sm">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
