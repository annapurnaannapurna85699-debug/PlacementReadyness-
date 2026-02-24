import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';
import {
    LayoutDashboard,
    Search,
    Map,
    Target,
    CheckCircle,
    ArrowRight,
    PlusCircle,
    AlertCircle
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Card = ({ className, children }) => (
    <div className={cn("bg-white border shadow-sm rounded-2xl overflow-hidden", className)}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        {children}
    </div>
);

const CardTitle = ({ className, children }) => (
    <h3 className={cn("font-bold text-slate-800", className)}>{children}</h3>
);

const CardContent = ({ className, children }) => (
    <div className={cn("p-6", className)}>{children}</div>
);

const Dashboard = () => {
    const [formData, setFormData] = useState({ company: '', role: '', jd: '' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const jdLength = formData.jd.trim().length;
    const isTooShort = jdLength > 0 && jdLength < 200;

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!formData.jd.trim()) return;

        setIsAnalyzing(true);
        setTimeout(() => {
            try {
                const results = analyzeJD(formData.company, formData.role, formData.jd);
                saveToHistory(results);
                navigate(`/results/${results.id}`);
            } catch (err) {
                alert(err.message);
                setIsAnalyzing(false);
            }
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
                    <p className="text-slate-500 font-medium">Analyze job descriptions and map your preparation strategy.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Ready
                    </div>
                </div>
            </div>

            {/* Analysis Form Section */}
            <Card className="border-t-4 border-t-primary shadow-xl overflow-visible">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <PlusCircle size={20} />
                        </div>
                        <CardTitle className="text-xl">New Analysis</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Company (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Google, Stripe, Zomato"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 font-medium"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Role Type (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Frontend Engineer, Product Manager"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 font-medium"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2 relative">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                <span>Paste Job Description (Required)</span>
                                <span className={cn(formData.jd.length > 0 && formData.jd.length < 200 ? "text-amber-500" : "text-slate-300")}>
                                    {formData.jd.length} chars
                                </span>
                            </label>
                            <textarea
                                required
                                placeholder="Paste the full job description here for the best heuristic analysis..."
                                className={cn(
                                    "w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-4 min-h-[220px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 font-medium resize-none leading-relaxed",
                                    isTooShort && "border-amber-200 bg-amber-50/10"
                                )}
                                value={formData.jd}
                                onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                            />

                            {isTooShort && (
                                <div className="absolute -bottom-10 left-0 flex items-center gap-2 text-amber-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={14} />
                                    This JD is too short to analyze deeply. Paste full JD for better output.
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={!formData.jd.trim() || isAnalyzing}
                                    className={cn(
                                        "bg-primary text-white font-bold py-4 px-10 rounded-xl text-lg transition-all shadow-lg shadow-primary/30 w-full md:w-auto flex items-center justify-center gap-3",
                                        isAnalyzing ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing Intel...
                                        </>
                                    ) : (
                                        <>
                                            Generate Analysis Logic
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center md:text-left">
                                    Proprietary Heuristic Engine v2.0 <br /> No external API usage • Secure Local Storage
                                </p>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Secondary Intel Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                <Card className="bg-white p-6 border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Map size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Adaptive Roadmap</h4>
                        <p className="text-sm text-slate-500 mt-1">Timeline shifts based on company scale and role requirements.</p>
                    </div>
                </Card>
                <Card className="bg-white p-6 border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Target size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Skill Confidence</h4>
                        <p className="text-sm text-slate-500 mt-1">Heuristically extracted technical tags for quick self-assessment.</p>
                    </div>
                </Card>
                <Card className="bg-white p-6 border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Export Ready</h4>
                        <p className="text-sm text-slate-500 mt-1">Export your preparation strategy as structured text for study.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
