import React, { useEffect, useState } from 'react';
import { FileText, User, ArrowRight, BookOpen } from 'lucide-react';

export const Dashboard = () => {
    const [knowledge, setKnowledge] = useState<any[]>([]);
    const [experts, setExperts] = useState<any[]>([]);

    useEffect(() => {
        // In a real app we would call: /api/knowledge/recent and /api/experts
        // For demo build, mock the data
        setKnowledge([
            { id: '1', title: 'AI Controllers Architecture Doc', summary: 'Design doc for AI connectors.', source: 'DRIVE' },
            { id: '2', title: 'Q3 Architectural Review', summary: 'Recording of the Q3 review.', source: 'S3' }
        ]);
        setExperts([
            { id: '1', name: 'Alex Developer', role: 'Frontend Engineering', level: 'Senior' },
            { id: '2', name: 'Sarah Smith', role: 'Backend Engineering', level: 'Staff' }
        ]);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido, Marcelo</h1>
                    <p className="text-slate-500 mt-1">Aquí está tu resumen de conocimiento y red KAI.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30 flex items-center space-x-2">
                    <span>Crear Guía</span>
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Conocimiento Reciente */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <FileText size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Conocimiento Reciente</h2>
                    </div>
                    <div className="flex-1 space-y-4">
                        {knowledge.map(k => (
                            <div key={k.id} className="group cursor-pointer">
                                <h3 className="text-[15px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{k.title}</h3>
                                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{k.summary}</p>
                            </div>
                        ))}
                    </div>
                    <button className="text-blue-600 text-sm font-medium mt-6 self-start hover:underline">Ver todo</button>
                </div>

                {/* Expertos Principales */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                            <User size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Expertos Principales</h2>
                    </div>
                    <div className="flex-1 space-y-5">
                        {experts.map(e => (
                            <div key={e.id} className="flex items-center space-x-3 group cursor-pointer">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                    {e.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-medium text-slate-800 group-hover:text-purple-600 transition-colors">{e.name}</h3>
                                    <p className="text-xs text-slate-500">{e.role} • {e.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="text-purple-600 text-sm font-medium mt-6 self-start hover:underline">Directorio completo</button>
                </div>

                {/* Mis Guías */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                            <BookOpen size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Mis Guías</h2>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-70">
                        <div className="bg-slate-50 p-4 rounded-full">
                            <BookOpen size={24} className="text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Aún no has creado ni guardado ninguna guía de conocimiento.</p>
                    </div>
                    <button className="w-full mt-6 py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        Explorar Guías
                    </button>
                </div>
            </div>
        </div>
    );
};
