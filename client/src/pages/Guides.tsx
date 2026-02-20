import React, { useState } from 'react';
import { BookOpen, Clock, Tag, ArrowUpRight, Plus } from 'lucide-react';

export const Guides = () => {
    const [activeDepartment, setActiveDepartment] = useState('Todos');

    const departments = ['Todos', 'Frontend', 'Backend', 'DevOps', 'General'];

    const guides = [
        {
            id: 1,
            title: 'Guía de Estilos Tailwind v4',
            description: 'Convenciones y utilidades estándar de la empresa usando el nuevo motor.',
            version: 'v2.1',
            date: 'Actualizado hace 2 días',
            department: 'Frontend',
            author: 'Alex Developer',
            tags: ['CSS', 'Design']
        },
        {
            id: 2,
            title: 'Despliegues en Railway',
            description: 'Cómo usar railway.json y Dockerfiles multi-stage para microservicios.',
            version: 'v1.0',
            date: 'Hace 1 semana',
            department: 'DevOps',
            author: 'David Lee',
            tags: ['Docker', 'CI/CD']
        },
        {
            id: 3,
            title: 'Arquitectura de AI Controllers',
            description: 'Integrando gpt-4o-mini y Claude 3.5 en nuestro backend Node.js.',
            version: 'v1.5',
            date: 'Hace 3 semanas',
            department: 'Backend',
            author: 'Sarah Smith',
            tags: ['AI', 'Node']
        }
    ];

    const filteredGuides = activeDepartment === 'Todos'
        ? guides
        : guides.filter(g => g.department === activeDepartment);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Guías</h1>
                    <p className="text-slate-500 mt-1">Explora, versiona y contribuye a la base de conocimiento documentado.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30 flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Nueva Guía</span>
                </button>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
                {departments.map(dep => (
                    <button
                        key={dep}
                        onClick={() => setActiveDepartment(dep)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeDepartment === dep
                                ? 'bg-slate-800 text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {dep}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredGuides.map(guide => (
                    <div key={guide.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group cursor-pointer flex items-start justify-between">
                        <div className="flex space-x-5">
                            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{guide.title}</h2>
                                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-amber-100 text-amber-700">
                                        {guide.version}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-2xl">{guide.description}</p>

                                <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                                    <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                                        <span className="text-slate-700">{guide.department}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Clock size={14} />
                                        <span>{guide.date} por <span className="text-slate-700">{guide.author}</span></span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {guide.tags.map(tag => (
                                            <span key={tag} className="flex items-center space-x-1 text-blue-600">
                                                <Tag size={12} />
                                                <span>{tag}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
