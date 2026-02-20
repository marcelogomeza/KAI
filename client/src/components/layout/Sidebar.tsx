import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Compass, Search, Home, Map } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: (string | undefined | null | false)[]) => {
    return twMerge(clsx(inputs));
};

export const Sidebar = () => {
    const items = [
        { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Search size={20} />, label: 'Búsqueda / AI', path: '/search' },
        { icon: <Map size={20} />, label: 'Mapa de Carrera', path: '/career' },
        { icon: <Users size={20} />, label: 'Expertos', path: '/experts' },
        { icon: <BookOpen size={20} />, label: 'Guías', path: '/guides' },
        { icon: <Compass size={20} />, label: 'Conocimiento', path: '/knowledge' },
    ];

    return (
        <div className="w-64 bg-[#0A192F] text-slate-300 flex flex-col h-screen fixed top-0 left-0">
            <div className="px-6 py-8 flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <BookOpen size={24} />
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">KAI</span>
            </div>

            <nav className="flex-1 mt-6 flex flex-col space-y-2 px-4">
                {items.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "hover:bg-[#112240] hover:text-white"
                            )
                        }
                    >
                        {item.icon}
                        <span className="font-medium text-[15px]">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 mb-4">
                <div className="bg-[#112240] rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Asistente KAI</p>
                    <p className="text-sm text-slate-300 leading-snug">Estoy listo para ayudarte con tus consultas técnicas.</p>
                </div>
            </div>
        </div>
    );
};
