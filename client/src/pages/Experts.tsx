import React from 'react';
import { Mail, Phone, Briefcase, Award, Star } from 'lucide-react';

export const Experts = () => {
    const experts = [
        {
            id: 1,
            name: 'Alex Developer',
            role: 'Frontend Engineering',
            level: 'Senior',
            skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
            projects: ['KAI Frontend Component System', 'E-commerce Checkout UI'],
            email: 'alex.dev@kai.com',
            initial: 'A',
            color: 'blue'
        },
        {
            id: 2,
            name: 'Sarah Smith',
            role: 'Backend Engineering',
            level: 'Staff',
            skills: ['Node.js', 'PostgreSQL', 'AWS', 'System Design'],
            projects: ['Auth Service Migration', 'Data Pipeline Optimization'],
            email: 'sarah.smith@kai.com',
            initial: 'S',
            color: 'purple'
        },
        {
            id: 3,
            name: 'David Lee',
            role: 'DevOps / Infra',
            level: 'Senior',
            skills: ['Docker', 'Kubernetes', 'Railway', 'CI/CD'],
            projects: ['KAI Infrastructure Setup', 'Multi-region Deployments'],
            email: 'david.lee@kai.com',
            initial: 'D',
            color: 'emerald'
        }
    ];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'purple': return 'bg-purple-100 text-purple-600';
            case 'emerald': return 'bg-emerald-100 text-emerald-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio de Expertos</h1>
                    <p className="text-slate-500 mt-1">Conecta con los líderes técnicos de la organización.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map(expert => (
                    <div key={expert.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold ${getColorClasses(expert.color)}`}>
                                    {expert.initial}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{expert.name}</h2>
                                    <p className="text-sm text-slate-500">{expert.role} • {expert.level}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-amber-400 transition-colors">
                                <Star size={20} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 flex-1">
                            <div>
                                <div className="flex items-center space-x-2 text-slate-700 mb-2 font-medium">
                                    <Award size={16} className="text-blue-500" />
                                    <span className="text-sm">Habilidades Principales</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {expert.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 text-slate-700 mb-2 font-medium">
                                    <Briefcase size={16} className="text-emerald-500" />
                                    <span className="text-sm">Proyectos Activos</span>
                                </div>
                                <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-slate-300">
                                    {expert.projects.map(p => <li key={p}>{p}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center space-x-3">
                            <button
                                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                            >
                                <Mail size={16} />
                                <span>Mensaje</span>
                            </button>
                            <button
                                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                            >
                                <Phone size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
