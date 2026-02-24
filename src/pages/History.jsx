import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../utils/analysisEngine';
import {
    ChevronRight,
    Trash2,
    History as HistoryIcon,
    Building2,
    Calendar,
    Zap,
    AlertCircle
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const History = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const data = getHistory();
            setHistory(data);
            // If data is empty but localStorage has something, it might be corrupted
            if (data.length === 0 && localStorage.getItem('placement_history')) {
                setError(true);
            }
        } catch (e) {
            setError(true);
        }
    }, []);

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear all analysis history? This cannot be undone.')) {
            localStorage.removeItem('placement_history');
            setHistory([]);
            setError(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                        <HistoryIcon size={18} /> Analysis Archives
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Preparation History</h1>
                    <p className="text-slate-500 font-medium">Review your previous job analyses and preparation roadmaps.</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold transition-all text-sm group"
                    >
                        <Trash2 size={18} className="group-hover:shake" />
                        Clear All
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-top-2">
                    <AlertCircle className="text-amber-600 shrink-0" size={24} />
                    <div className="space-y-1">
                        <h4 className="font-bold text-amber-900">Data Integrity Notice</h4>
                        <p className="text-sm text-amber-700">One or more saved entries couldn't be loaded due to a schema mismatch. Create a new analysis to continue.</p>
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-200 rounded-3xl space-y-6 bg-slate-50/50">
                    <div className="p-6 bg-white rounded-full shadow-sm text-slate-300">
                        <HistoryIcon size={48} />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">No History Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Your job description analyses will appear here once you generate them from the dashboard.</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        Start First Analysis
                        <ChevronRight size={20} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((item) => (
                        <Link
                            key={item.id}
                            to={`/results/${item.id}`}
                            className="bg-white border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 p-6 rounded-2xl flex items-center gap-6 group transition-all"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                <span className="text-xl font-black text-primary">{Math.round(item.finalScore)}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Score</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-xl text-slate-900 truncate">{item.company || 'Unnamed JD'}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded truncate">
                                        {item.role || 'General Role'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={14} className="text-amber-400" />
                                        {Object.values(item.extractedSkills).flat().length} Skills Detected
                                    </div>
                                </div>
                            </div>

                            <div className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all">
                                <ChevronRight size={24} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
