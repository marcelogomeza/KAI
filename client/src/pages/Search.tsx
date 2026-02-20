import React, { useState } from 'react';
import { Search as SearchIcon, MessageSquare, Send, Tag, Filter } from 'lucide-react';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: string, text: string }[]>([
        { role: 'assistant', text: '¡Hola! Soy KAI, tu asistente de conocimiento. ¿Qué estás buscando hoy?' }
    ]);
    const [activeTab, setActiveTab] = useState<'search' | 'ask'>('search');
    const [tags] = useState(['React', 'Node.js', 'AI', 'Cloud', 'Frontend', 'Backend']);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchResults] = useState([
        { id: 1, title: 'AI Controllers Architecture Doc', type: 'Guía', tags: ['AI', 'Node.js'] },
        { id: 2, title: 'Frontend Best Practices', type: 'Documento', tags: ['React', 'Frontend'] },
    ]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        setChatHistory(prev => [...prev, { role: 'user', text: chatMessage }]);
        setChatMessage('');

        // Simulate AI response
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                text: 'He encontrado información relevante sobre tu consulta. Basado en nuestras guías internas, la mejor práctica en este caso es...'
            }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Búsqueda & KAI AI</h1>
                <p className="text-slate-500 mt-1">Encuentra conocimiento rápidamente o pregunta a nuestro asistente.</p>
            </div>

            <div className="flex space-x-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center space-x-2">
                        <SearchIcon size={18} />
                        <span>Búsqueda Tradicional</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('ask')}
                    className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'ask' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center space-x-2">
                        <MessageSquare size={18} />
                        <span>Preguntar a KAI</span>
                    </div>
                </button>
            </div>

            {activeTab === 'search' ? (
                <div className="flex-1 flex flex-col space-y-6">
                    <div className="flex space-x-4">
                        <div className="flex-1 relative">
                            <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Buscar en todos los documentos..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center space-x-2">
                            <Filter size={20} />
                            <span>Filtros</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <Tag size={14} />
                                <span>{tag}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-y-auto">
                        <h3 className="text-slate-800 font-medium mb-4">Resultados ({searchResults.length})</h3>
                        <div className="space-y-4">
                            {searchResults.map(result => (
                                <div key={result.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-slate-800 text-lg">{result.title}</h4>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">{result.type}</span>
                                                <div className="flex space-x-2">
                                                    {result.tags.map(t => (
                                                        <span key={t} className="text-xs text-blue-600 font-medium">#{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-5 py-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                    }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={e => setChatMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Escribe tu pregunta a KAI..."
                            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            disabled={!chatMessage.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
