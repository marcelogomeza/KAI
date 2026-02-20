import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

export const Topbar = () => {
    return (
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex bg-slate-100 rounded-full px-4 py-2 items-center w-96 max-w-full">
                <Search size={18} className="text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Buscar guías, expertos o temas..."
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
                />
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-slate-500 hover:text-blue-600 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2 border-white border"></span>
                </button>
                <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Marcelo</p>
                        <p className="text-xs text-slate-500">Junior Dev / IT</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        M
                    </div>
                </div>
            </div>
        </div>
    );
};
