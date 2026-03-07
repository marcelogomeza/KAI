import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';
import { Document } from '../types';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    document: Document | null;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onSuccess, document }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Mapa de procesos');
    const [referenceDescription, setReferenceDescription] = useState('');
    const [area, setArea] = useState('');
    const [linkedProcess, setLinkedProcess] = useState('');
    const [confidentiality, setConfidentiality] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [approver, setApprover] = useState('');
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (document) {
            setCode(document.code || '');
            setName(document.name || '');
            setType(document.type || 'Mapa de procesos');
            setReferenceDescription(document.referenceDescription || '');
            setArea(document.area || '');
            setLinkedProcess(document.linkedProcess || '');
            setConfidentiality(document.confidentiality || '');

            if (document.expirationDate) {
                const dateObj = new Date(document.expirationDate);
                if (!isNaN(dateObj.getTime())) {
                    setExpirationDate(dateObj.toISOString().split('T')[0]);
                }
            } else {
                setExpirationDate('');
            }

            setApprover(document.approver || '');
        }
    }, [document]);

    if (!isOpen || !document) return null;

    const handleUpdate = async () => {
        setUpdating(true);
        setError('');

        try {
            await api.put(`/documents/${document.id}`, {
                code,
                name,
                type,
                referenceDescription,
                area,
                linkedProcess,
                confidentiality,
                expirationDate,
                approver,
                ownerId: document.ownerId || document.uploadedBy
            });

            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update document');
            setUpdating(false);
        }
    };

    const handleClose = () => {
        setCode('');
        setName('');
        setType('Mapa de procesos');
        setReferenceDescription('');
        setArea('');
        setLinkedProcess('');
        setConfidentiality('');
        setExpirationDate('');
        setApprover('');
        setUpdating(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity py-10">
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto max-h-[90vh] shadow-xl transform transition-all sm:max-w-xl sm:w-full sm:p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Update Document details</h3>
                    <button onClick={handleClose} disabled={updating} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Document name"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Reference Description</label>
                            <textarea
                                value={referenceDescription}
                                onChange={(e) => setReferenceDescription(e.target.value)}
                                disabled={updating}
                                rows={2}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Brief description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="e.g. PROC-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                            >
                                <option value="Mapa de procesos">Mapa de procesos</option>
                                <option value="Políticas">Políticas</option>
                                <option value="Manuales">Manuales</option>
                                <option value="Procedimientos">Procedimientos</option>
                                <option value="Guías e Instructivos">Guías e Instructivos</option>
                                <option value="Formatos y Registros">Formatos y Registros</option>
                                <option value="Indicadores y Tableros (KPI's)">Indicadores y Tableros (KPI's)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area</label>
                            <input
                                type="text"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Linked Process</label>
                            <input
                                type="text"
                                value={linkedProcess}
                                onChange={(e) => setLinkedProcess(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confidentiality</label>
                            <select
                                value={confidentiality}
                                onChange={(e) => setConfidentiality(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                            >
                                <option value="">Select...</option>
                                <option value="Interno">Interno</option>
                                <option value="Confidencial">Confidencial</option>
                                <option value="Restringido">Restringido</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                            <input
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Approver</label>
                            <input
                                type="text"
                                value={approver}
                                onChange={(e) => setApprover(e.target.value)}
                                disabled={updating}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={updating || !name}
                            className="w-full inline-flex justify-center flex-row items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {updating ? 'Updating...' : 'Save Updates'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={updating}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
