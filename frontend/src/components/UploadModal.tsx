import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText } from 'lucide-react';
import api from '../api/axios';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'draft' | 'approved'>('draft');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selected = e.target.files[0];
            if (selected.size > 20 * 1024 * 1024) {
                setError('File exceeds 20MB limit');
                return;
            }
            setFile(selected);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('status', status);

        try {
            await api.post('/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                },
            });

            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload document');
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Knowledge Document</h3>
                    <button onClick={handleClose} disabled={uploading} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-400 transition-colors ${file ? 'bg-primary-50' : ''}`}
                    >
                        <div className="space-y-1 text-center">
                            {file ? (
                                <FileText className="mx-auto h-12 w-12 text-primary-500" />
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            )}

                            <div className="flex text-sm text-gray-600 justify-center">
                                <span className="relative rounded-md font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    {file ? file.name : 'Upload a file'}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept=".pdf,.txt,.doc,.docx"
                                    disabled={uploading}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOC, TXT up to 20MB'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Initial Status</label>
                        <select
                            title="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            disabled={uploading}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                        >
                            <option value="draft">Draft (Needs Review)</option>
                            <option value="approved">Approved (Published)</option>
                        </select>
                    </div>

                    {uploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
                        </div>
                    )}

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={uploading}
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
