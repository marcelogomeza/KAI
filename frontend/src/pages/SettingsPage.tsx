import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

type Provider = 'local' | 'google_cloud' | 'aws_s3' | 'onedrive';

export const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [provider, setProvider] = useState<Provider>('google_cloud');
    const [settings, setSettings] = useState<Record<string, string>>({
        storage_provider: 'google_cloud'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await api.get('/settings');
                const data = response.data;
                if (data.storage_provider) {
                    setProvider(data.storage_provider as Provider);
                }
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));

        if (name === 'storage_provider') {
            setProvider(value as Provider);
            setMessage(null);
            setTestStatus('idle');
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);
            setTestStatus('idle');

            // Just saving the current provider + its specific keys
            const keysToSave = ['storage_provider'];
            if (provider === 'google_cloud') {
                keysToSave.push('gcp_project_id', 'gcp_client_email', 'gcp_private_key', 'gcp_bucket_name');
            } else if (provider === 'aws_s3') {
                keysToSave.push('aws_access_key', 'aws_secret_key', 'aws_region', 'aws_bucket_name');
            } else if (provider === 'onedrive') {
                keysToSave.push('onedrive_client_id', 'onedrive_client_secret', 'onedrive_tenant_id', 'onedrive_folder');
            }

            const payload: Record<string, string> = {};
            keysToSave.forEach(key => {
                payload[key] = settings[key] || '';
            });

            const res = await api.post('/settings', payload);
            setSettings(res.data);
            setMessage({ type: 'success', text: 'Configuración guardada correctamente.' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Error al guardar la configuración.' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        try {
            setTesting(true);
            setTestStatus('idle');
            setMessage(null);

            const payload = {
                provider,
                // we send current state for testing
                ...settings
            };

            const response = await api.post('/settings/test', payload);
            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message || 'Conexión probada con éxito.' });
                setTestStatus('success');
            } else {
                setMessage({ type: 'error', text: response.data.message || 'La prueba de conexión falló.' });
                setTestStatus('error');
            }
        } catch (error) {
            console.error('Error testing connection:', error);
            setMessage({ type: 'error', text: 'Error al probar la conexión con el proveedor.' });
            setTestStatus('error');
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-12 text-gray-500">Cargando configuración...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-500 mt-1">
                    Administra las configuraciones globales del sistema, como el almacenamiento de documentos.
                </p>
            </div>

            {message && (
                <div className={clsx("p-4 rounded-lg flex items-center shadow-sm", message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200')}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Almacenamiento de Documentos</h2>
                    <p className="text-sm text-gray-500 mt-1">Configura dónde se subirán y de dónde la IA procesará los contenidos (manuales, videos, imágenes, etc.).</p>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Proveedor de Almacenamiento</label>
                        <select
                            name="storage_provider"
                            value={provider}
                            onChange={handleChange}
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
                        >
                            <option value="local">Local (Servidor App)</option>
                            <option value="google_cloud">Google Cloud Storage</option>
                            <option value="aws_s3">AWS S3</option>
                            <option value="onedrive">Microsoft OneDrive</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Credenciales API - {
                            provider === 'google_cloud' ? 'Google Cloud' : provider === 'aws_s3' ? 'AWS S3' : 'OneDrive'
                        }</h3>

                        {provider === 'google_cloud' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Project ID</label>
                                    <input type="text" name="gcp_project_id" value={settings.gcp_project_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="my-gcp-project-id" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Bucket Name</label>
                                    <input type="text" name="gcp_bucket_name" value={settings.gcp_bucket_name || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="my-kai-bucket" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Client Email (Service Account)</label>
                                    <input type="email" name="gcp_client_email" value={settings.gcp_client_email || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="service-account@project.iam.gserviceaccount.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Private Key</label>
                                    <input type="password" name="gcp_private_key" value={settings.gcp_private_key || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="-----BEGIN PRIVATE KEY-----\n..." autoComplete="new-password" />
                                </div>
                            </div>
                        )}

                        {provider === 'aws_s3' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Access Key ID</label>
                                    <input type="text" name="aws_access_key" value={settings.aws_access_key || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="AKIA..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Secret Access Key</label>
                                    <input type="password" name="aws_secret_key" value={settings.aws_secret_key || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu Secret Key" autoComplete="new-password" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Region</label>
                                    <input type="text" name="aws_region" value={settings.aws_region || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="us-east-1" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Bucket Name</label>
                                    <input type="text" name="aws_bucket_name" value={settings.aws_bucket_name || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="my-kai-bucket" />
                                </div>
                            </div>
                        )}

                        {provider === 'onedrive' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Tenant ID</label>
                                    <input type="text" name="onedrive_tenant_id" value={settings.onedrive_tenant_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="1234abcd-1234-abcd-1234-abcd1234abcd" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Client ID (App ID)</label>
                                    <input type="text" name="onedrive_client_id" value={settings.onedrive_client_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="Client ID de Azure AD" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                                    <input type="password" name="onedrive_client_secret" value={settings.onedrive_client_secret || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu Secret" autoComplete="new-password" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Folder Name / Drive ID</label>
                                    <input type="text" name="onedrive_folder" value={settings.onedrive_folder || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre de la carpeta principal" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={handleTest}
                        disabled={testing || saving}
                        className={clsx(
                            "inline-flex items-center justify-center px-6 py-2 border rounded-lg shadow-sm font-semibold transition-colors disabled:opacity-50",
                            testStatus === 'success' ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100" :
                                testStatus === 'error' ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100" :
                                    "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        {testing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :
                            testStatus === 'success' ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> :
                                testStatus === 'error' ? <XCircle className="w-4 h-4 mr-2 text-red-600" /> :
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-gray-400" />}
                        Probar Conexión
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={testing || saving}
                        className="inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
};
