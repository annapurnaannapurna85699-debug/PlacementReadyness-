import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisById } from '../utils/analysisEngine';
import {
    CheckCircle2,
    Calendar,
    ClipboardList,
    HelpCircle,
    Tags,
    ChevronLeft,
    ArrowRight
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
    const analysis = getAnalysisById(id);

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

    const { company, role, readinessScore, extractedSkills, checklist, plan, questions } = analysis;

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

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

                {/* Score Indicator */}
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
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Overall Score</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Section (2 columns on lg) */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Extracted Skills */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <Tags size={18} /> Extracted Skills
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(extractedSkills).map(([category, skills]) => (
                                <Card key={category} className="p-4 bg-slate-50/50">
                                    <h4 className="text-xs font-black text-slate-400 uppercase mb-3 tracking-tighter">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <span key={skill} className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                                {skill}
                                            </span>
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
                                    <Card className="flex-1 p-5 mb-4 hover:border-primary/30 transition-all">
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

                    {/* Likely Questions */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                            <HelpCircle size={18} /> Predicted Interview Questions
                        </div>
                        <div className="space-y-3">
                            {questions.map((q, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl group hover:border-primary/40 transition-all cursor-default">
                                    <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                        {idx + 1}
                                    </span>
                                    <p className="text-slate-800 font-medium leading-relaxed">{q}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Section (Checklist) */}
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
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary shrink-0" />
                                            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <Card className="bg-slate-900 text-white p-6">
                            <h4 className="font-bold text-primary mb-2">Pro Tip</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Consistency beats intensity. Spend at least 4 hours daily following this roadmap to maximize your {readinessScore}% readiness.
                            </p>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Results;
