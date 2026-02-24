import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisById, updateAnalysis } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    ClipboardList,
    HelpCircle,
    Tags,
    ChevronLeft,
    ArrowRight,
    Copy,
    Download,
    Zap,
    Check,
    Building2,
    Map,
    History as HistoryIcon
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

const Results = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        const data = getAnalysisById(id);
        if (data) {
            setAnalysis(data);
        }
    }, [id]);

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Analysis Not Found</h2>
                <Link to="/dashboard" className="text-primary font-bold flex items-center gap-2">
                    <ChevronLeft size={20} /> Return to Dashboard
                </Link>
            </div>
        );
    }

    const {
        company,
        role,
        readinessScore,
        baseReadinessScore,
        extractedSkills,
        checklist,
        plan,
        questions,
        skillConfidenceMap = {},
        companyIntel = { category: 'Startup', industry: 'Technology', focus: 'General', size: 'Small' },
        roundMapping = []
    } = analysis;

    const handleToggleSkill = (skill) => {
        const currentStatus = skillConfidenceMap[skill] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';
        const newMap = { ...skillConfidenceMap, [skill]: newStatus };

        let bonus = 0;
        Object.keys(newMap).forEach(s => {
            if (newMap[s] === 'know') bonus += 2;
            else bonus -= 2;
        });

        const newScore = Math.min(100, Math.max(0, (baseReadinessScore || readinessScore) + bonus));
        const updated = {
            ...analysis,
            skillConfidenceMap: newMap,
            readinessScore: newScore
        };

        setAnalysis(updated);
        updateAnalysis(updated);
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copied to clipboard!`);
    };

    const generateFullText = () => {
        let text = `Placement Prep Analysis: ${company} - ${role}\n`;
        text += `Readiness Score: ${readinessScore}%\n\n`;
        text += `--- COMPANY INTEL ---\nIndustry: ${companyIntel.industry}\nScale: ${companyIntel.size}\nFocus: ${companyIntel.focus}\n\n`;
        return text + "Check app for full roadmap.";
    };

    const downloadTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([generateFullText()], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Placement_Prep_${company.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const weakSkills = Object.values(extractedSkills).flat().filter(s => skillConfidenceMap[s] !== 'know').slice(0, 3);

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        <ChevronLeft size={16} /> Back
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{company}</h1>
                        <p className="text-xl font-medium text-slate-500">{role}</p>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-3xl px-8 py-6 flex items-center gap-6">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle className="text-primary/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="34" cx="40" cy="40" />
                            <circle
                                className="text-primary transition-all duration-1000 ease-out"
                                strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 34}
                                strokeDashoffset={2 * Math.PI * 34 * (1 - readinessScore / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="34" cx="40" cy="40"
                            />
                        </svg>
                        <span className="absolute text-xl font-black text-primary">{readinessScore}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 leading-none">Readiness</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Update</span>
                    </div>
                </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap gap-3">
                <button onClick={() => copyToClipboard(plan.map(p => `${p.day}: ${p.tasks.join(', ')}`).join('\n'), 'Plan')} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:border-primary/30 hover:text-primary shadow-sm">
                    <Copy size={16} /> 7-Day Plan
                </button>
                <button onClick={downloadTxt} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg ml-auto">
                    <Download size={16} /> Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-10">

                    {/* Company Intel Block */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Building2 size={18} /> Company Intel
                        </div>
                        <Card className="p-8 border-t-4 border-t-primary bg-gradient-to-br from-white to-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Category</span>
                                        <p className="text-lg font-bold text-slate-900">{companyIntel.industry}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scale</span>
                                        <p className="text-lg font-bold text-slate-900">{companyIntel.size}</p>
                                    </div>
                                </div>
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        <Zap size={14} className="fill-primary" /> Typical Hiring Focus
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                        {companyIntel.focus}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <HistoryIcon size={12} /> Demo Mode: Company intel generated heuristically.
                            </div>
                        </Card>
                    </section>

                    {/* Round Mapping Engine */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Map size={18} /> Round Mapping
                        </div>
                        <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {roundMapping.map((round, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white border-4 border-primary z-10" />
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900">{round.title}</h4>
                                            <p className="text-sm font-bold text-primary uppercase tracking-wider">{round.subtitle}</p>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{round.desc}</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-lg">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Why this round matters</span>
                                            <p className="text-xs font-semibold text-slate-600 italic">"{round.why}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Extracted Skills */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                                <Tags size={18} /> Skill Assessment
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(extractedSkills).map(([category, skills]) => (
                                <Card key={category} className="p-4 bg-slate-50/50">
                                    <h4 className="text-xs font-black text-slate-400 uppercase mb-3 tracking-tighter">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => handleToggleSkill(skill)}
                                                className={cn(
                                                    "group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm",
                                                    skillConfidenceMap[skill] === 'know'
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-primary/30"
                                                )}
                                            >
                                                {skillConfidenceMap[skill] === 'know' ? <Check size={12} /> : <div className="w-3 h-3 border-2 border-slate-300 rounded-full" />}
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* 7-Day Plan */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Calendar size={18} /> 7-Day Preparation Roadmap
                        </div>
                        <div className="space-y-4">
                            {plan.map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black relative z-10 shrink-0">
                                            {idx + 1}
                                        </div>
                                        {idx !== plan.length - 1 && <div className="w-0.5 h-full bg-slate-100 group-hover:bg-primary/20 transition-colors" />}
                                    </div>
                                    <Card className="flex-1 p-5 mb-4 hover:border-primary/30">
                                        <h4 className="font-bold text-slate-900 mb-3">{item.day}</h4>
                                        <ul className="space-y-2">
                                            {item.tasks.map((task, tidx) => (
                                                <li key={tidx} className="flex items-start gap-3 text-sm text-slate-600">
                                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="space-y-6 sticky top-8">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm px-1">
                            <ClipboardList size={18} /> Round-wise Checklist
                        </div>

                        {Object.entries(checklist).map(([round, items]) => (
                            <div key={round} className="space-y-3">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 px-3 py-2 rounded-md inline-block">
                                    {round}
                                </h4>
                                <div className="space-y-2">
                                    {items.map((item, idx) => (
                                        <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-white cursor-pointer group transition-all">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary accent-primary" />
                                            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <Card className="bg-slate-900 text-white p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Zap size={64} />
                            </div>
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2 text-lg">
                                <Zap size={20} className="fill-primary" /> Action Plan
                            </h4>

                            {weakSkills.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">Focus on these weak areas first:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {weakSkills.map(s => (
                                            <span key={s} className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/10">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-emerald-400 font-bold">You've mastered all extracted skills!</p>
                            )}

                            <div className="mt-8 space-y-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Next Step</p>
                                <div className="flex items-center justify-between group/btn cursor-pointer">
                                    <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">Start Day 1 plan now.</span>
                                    <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Results;
