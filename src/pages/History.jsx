import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../utils/analysisEngine';
import {
    Building2,
    Briefcase,
    Calendar,
    ChevronRight,
    History as HistoryIcon,
    Trash2,
    FileText
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear your preparation history?")) {
            localStorage.removeItem('placement_history');
            setHistory([]);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                        <HistoryIcon size={14} /> Analysis Archives
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Preparation History</h1>
                    <p className="text-slate-500 font-medium">Review your previous job analyses and preparation roadmaps.</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} /> Clear All
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="bg-white border text-center py-24 rounded-3xl space-y-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">No History Yet</h3>
                        <p className="text-slate-500 mt-2">Start an analysis on the dashboard to see your history here.</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
                    >
                        Go to Dashboard
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
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                                <div className="text-center">
                                    <div className="text-xl font-black text-primary">{item.readinessScore}</div>
                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Score</div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-slate-900 truncate">{item.company}</h3>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase truncate">
                                        <Briefcase size={10} /> {item.role}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Building2 size={12} /> {Object.values(item.extractedSkills).flat().length} Skills Detected
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
