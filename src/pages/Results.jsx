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
    History as HistoryIcon,
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
                <AlertCircle size={48} className="text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-900">Analysis Not Found</h2>
                <p className="text-slate-400">The requested intelligence entry might be missing or corrupted.</p>
                <Link to="/dashboard" className="text-primary font-bold flex items-center gap-2 mt-4">
                    <ChevronLeft size={20} /> Return to Dashboard
                </Link>
            </div>
        );
    }

    const {
        company,
        role,
        finalScore,
        baseScore,
        extractedSkills,
        checklist,
        plan7Days,
        questions,
        skillConfidenceMap = {},
        roundMapping = []
    } = analysis;

    const handleToggleSkill = (skill) => {
        const currentStatus = skillConfidenceMap[skill] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';
        const newMap = { ...skillConfidenceMap, [skill]: newStatus };

        const updated = { ...analysis, skillConfidenceMap: newMap };
        updateAnalysis(updated);
        setAnalysis(getAnalysisById(id)); // Re-fetch to get updated scores/timestamps
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copied to clipboard!`);
    };

    // Safe industry inference for display
    const industry = analysis.companyIntel?.industry || "Technology Services";
    const size = analysis.companyIntel?.size || "Scaling Startup";
    const focus = analysis.companyIntel?.focus || "Practical Skills";

    const downloadTxt = () => {
        let text = `Placement Prep Analysis: ${company} - ${role}\n`;
        text += `Score: ${finalScore}%\n\n`;
        text += `SKILLS:\n${JSON.stringify(extractedSkills, null, 2)}\n\n`;
        text += `PLAN:\n${plan7Days.map(p => `${p.day}: ${p.tasks.join(', ')}`).join('\n')}`;

        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Prep_Report_${company || 'Local'}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const allSkills = Object.values(extractedSkills).flat();
    const weakSkills = allSkills.filter(s => skillConfidenceMap[s] !== 'know').slice(0, 3);

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        <ChevronLeft size={16} /> Back
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{company || "JD Analysis"}</h1>
                        <p className="text-xl font-medium text-slate-500">{role || "Target Role"}</p>
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
                                strokeDashoffset={2 * Math.PI * 34 * (1 - finalScore / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="34" cx="40" cy="40"
                            />
                        </svg>
                        <span className="absolute text-xl font-black text-primary">{Math.round(finalScore)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 leading-none">Readiness</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">v2.0 Logic</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={() => copyToClipboard(JSON.stringify(plan7Days), '7-Day Plan')} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:border-primary/30 transition-all shadow-sm">
                    <Copy size={16} /> Copy Prep Plan
                </button>
                <button onClick={downloadTxt} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg ml-auto">
                    <Download size={16} /> Export Intel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-10">

                    {/* Company Intel Block */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Building2 size={18} /> Market Intel
                        </div>
                        <Card className="p-8 border-t-4 border-t-primary bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Segment</span>
                                        <p className="text-lg font-bold text-slate-900">{industry}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Scale</span>
                                        <p className="text-lg font-bold text-slate-900">{size}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        <Zap size={14} className="fill-primary" /> Core Focus Area
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                        {focus}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Round Mapping */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Map size={18} /> Recruitment Mapping
                        </div>
                        <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {roundMapping.map((round, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white border-4 border-primary z-10 shrink-0" />
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900">{round.roundTitle}</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(round.focusAreas || []).map(f => (
                                                    <span key={f} className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-xl italic">
                                            " {round.whyItMatters} "
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skill Assessment */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Tags size={18} /> Skill Validation
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(extractedSkills).map(([category, skills]) => skills.length > 0 && (
                                <Card key={category} className="p-4 bg-slate-50/30">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => handleToggleSkill(skill)}
                                                className={cn(
                                                    "group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                                    skillConfidenceMap[skill] === 'know'
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                        : "bg-white border-slate-200 text-slate-500 hover:border-primary/50"
                                                )}
                                            >
                                                {skillConfidenceMap[skill] === 'know' ? <Check size={12} /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
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
                            <Calendar size={18} /> Strategic 7-Day Roadmap
                        </div>
                        <div className="space-y-4">
                            {plan7Days.map((item, idx) => (
                                <div key={idx} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 shadow-lg">
                                            {idx + 1}
                                        </div>
                                        {idx !== plan7Days.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2" />}
                                    </div>
                                    <Card className="flex-1 p-5 mb-4 border-slate-200/60 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-slate-900">{item.day}</h4>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.focus}</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {(item.tasks || []).map((task, tidx) => (
                                                <li key={tidx} className="flex items-start gap-3 text-sm text-slate-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
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
                            <ClipboardList size={18} /> Prep Checklist
                        </div>

                        {(checklist || []).map((round, idx) => (
                            <div key={idx} className="space-y-3">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-3 py-2 rounded-lg inline-block">
                                    {round.roundTitle}
                                </h4>
                                <div className="space-y-2">
                                    {(round.items || []).map((item, iidx) => (
                                        <label key={iidx} className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 cursor-pointer group transition-all">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary accent-primary" />
                                            <span className="text-sm text-slate-600 font-medium">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <Card className="bg-slate-900 text-white p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Zap size={64} />
                            </div>
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2 text-base">
                                <Zap size={18} className="fill-primary" /> Action Plan
                            </h4>

                            {weakSkills.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">Master these priority skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {weakSkills.map(s => (
                                            <span key={s} className="bg-white/10 text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-white/5">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-emerald-400 font-bold">Readiness optimized!</p>
                            )}

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">Start Day 1 now.</span>
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
