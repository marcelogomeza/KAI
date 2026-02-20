import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Target, Book, Brain } from 'lucide-react';

export const CareerMap = () => {
    const [activeLevel, setActiveLevel] = useState('Junior');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'competencies': true,
        'training': true,
        'knowledge': false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const levels = ['Intern', 'Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal'];

    const sectionsData = {
        'competencies': [
            { id: 1, title: 'Dominio de React Hooks', status: 'completed' },
            { id: 2, title: 'Integración CI/CD Básica', status: 'in-progress' },
            { id: 3, title: 'Optimización de Performance', status: 'pending' },
        ],
        'training': [
            { id: 1, title: 'Taller Arquitectura Frontend', status: 'in-progress' },
            { id: 2, title: 'Curso de Seguridad Web', status: 'pending' },
        ],
        'knowledge': [
            { id: 1, title: 'Lectura: "Design Systems en Escala"', status: 'completed' },
            { id: 2, title: 'Guía Interna de Despliegue', status: 'pending' },
        ]
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={18} className="text-emerald-500" />;
            case 'in-progress': return <Circle size={18} className="text-blue-500 fill-blue-500/20" />;
            case 'pending': return <Circle size={18} className="text-slate-300" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mapa de Carrera</h1>
                <p className="text-slate-500 mt-1">Visualiza y planifica tu desarrollo profesional.</p>
            </div>

            {/* Levels Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">
                <div className="flex items-center min-w-max">
                    {levels.map((level, idx) => (
                        <React.Fragment key={level}>
                            <div
                                className={`flex flex-col items-center cursor-pointer group`}
                                onClick={() => setActiveLevel(level)}
                            >
                                <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center font-bold mb-3 transition-colors ${activeLevel === level
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : idx < levels.indexOf(activeLevel)
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-300'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <span className={`text-sm font-semibold ${activeLevel === level ? 'text-blue-600' : 'text-slate-500'
                                    }`}>{level}</span>
                            </div>

                            {idx < levels.length - 1 && (
                                <div className={`h-1 w-24 mx-2 rounded-full ${idx < levels.indexOf(activeLevel) ? 'bg-blue-600' : 'bg-slate-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Level Content */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Requisitos: Nivel {activeLevel}</h2>
                        <p className="text-slate-500 text-sm mt-1">Completa los siguientes hitos para avanzar al siguiente nivel.</p>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {/* Competencies Section */}
                        <div className="p-0">
                            <button
                                onClick={() => toggleSection('competencies')}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg"><Target size={20} /></div>
                                    <h3 className="text-lg font-semibold text-slate-800">Competencias</h3>
                                </div>
                                {expandedSections['competencies'] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                            </button>

                            {expandedSections['competencies'] && (
                                <div className="px-6 pb-6 pt-2 space-y-3">
                                    {sectionsData.competencies.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm cursor-pointer transition-all">
                                            <StatusIcon status={item.status} />
                                            <span className={`font-medium ${item.status === 'completed' ? 'text-slate-800' : 'text-slate-700'}`}>{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Training Section */}
                        <div className="p-0">
                            <button
                                onClick={() => toggleSection('training')}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-50 text-orange-600 p-2 rounded-lg"><Book size={20} /></div>
                                    <h3 className="text-lg font-semibold text-slate-800">Formación</h3>
                                </div>
                                {expandedSections['training'] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                            </button>

                            {expandedSections['training'] && (
                                <div className="px-6 pb-6 pt-2 space-y-3">
                                    {sectionsData.training.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-3 rounded-xl border border-slate-100 bg-white hover:border-orange-100 hover:shadow-sm cursor-pointer transition-all">
                                            <StatusIcon status={item.status} />
                                            <span className={`font-medium ${item.status === 'completed' ? 'text-slate-800' : 'text-slate-700'}`}>{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Knowledge Section */}
                        <div className="p-0">
                            <button
                                onClick={() => toggleSection('knowledge')}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-teal-50 text-teal-600 p-2 rounded-lg"><Brain size={20} /></div>
                                    <h3 className="text-lg font-semibold text-slate-800">Mapa de Conocimiento</h3>
                                </div>
                                {expandedSections['knowledge'] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                            </button>

                            {expandedSections['knowledge'] && (
                                <div className="px-6 pb-6 pt-2 space-y-3">
                                    {sectionsData.knowledge.map(item => (
                                        <div key={item.id} className="flex items-center space-x-4 p-3 rounded-xl border border-slate-100 bg-white hover:border-teal-100 hover:shadow-sm cursor-pointer transition-all">
                                            <StatusIcon status={item.status} />
                                            <span className={`font-medium ${item.status === 'completed' ? 'text-slate-800' : 'text-slate-700'}`}>{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
