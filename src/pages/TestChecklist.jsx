import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw, Info, Lock, Unlock } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const TEST_ITEMS = [
    { id: 'jd-req', label: 'JD required validation works', hint: 'Go to dashboard, try to submit empty JD. It should stop you.' },
    { id: 'short-jd', label: 'Short JD warning shows for <200 chars', hint: 'Enter "Hello world" in JD. An amber warning must appear.' },
    { id: 'skill-group', label: 'Skills extraction groups correctly', hint: 'Paste a JD with "React, SQL, Java". Verify they show in categories.' },
    { id: 'round-map', label: 'Round mapping changes based on company + skills', hint: 'Compare "Amazon" (4 rounds) vs "Unknown" (3 rounds).' },
    { id: 'deterministic', label: 'Score calculation is deterministic', hint: 'Analyze the same JD twice. The starting score must be identical.' },
    { id: 'live-update', label: 'Skill toggles update score live', hint: 'Mark a skill as "Known". The Readiness Score must increase by 2.' },
    { id: 'persist-ref', label: 'Changes persist after refresh', hint: 'Refresh the results page after toggling skills. State must stay.' },
    { id: 'hist-robust', label: 'History saves and loads correctly', hint: 'Go to History page. Re-open a previous analysis.' },
    { id: 'export-btn', label: 'Export buttons copy the correct content', hint: 'Click "Copy Prep Plan" and paste it into a notepad.' },
    { id: 'no-console', label: 'No console errors on core pages', hint: 'Open dev tools. Check Dashboard, Results, and History for errors.' }
];

const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('prp_test_checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const toggleItem = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const resetChecklist = () => {
        if (window.confirm('Reset all test progress?')) {
            setCheckedItems({});
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isAllPassed = passedCount === 10;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 mt-10">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">QA Testing Checklist</h1>
                    <p className="text-slate-500 font-medium">Verify all core features before moving to shipping.</p>
                </div>
                <button
                    onClick={resetChecklist}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold transition-all text-sm"
                >
                    <RotateCcw size={16} /> Reset
                </button>
            </div>

            <div className={cn(
                "p-8 rounded-3xl border-2 transition-all flex items-center justify-between",
                isAllPassed ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
            )}>
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <h2 className={cn("text-4xl font-black", isAllPassed ? "text-emerald-700" : "text-slate-900")}>
                        Tests Passed: {passedCount} / 10
                    </h2>
                </div>
                <div className={cn(
                    "px-6 py-3 rounded-2xl font-black flex items-center gap-3",
                    isAllPassed ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700 border border-amber-200"
                )}>
                    {isAllPassed ? (
                        <>
                            <CheckCircle2 size={24} /> READY FOR SHIP
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={24} /> BLOCKING SHIP
                        </>
                    )}
                </div>
            </div>

            {!isAllPassed && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-sm font-bold flex items-center gap-3 animate-pulse">
                    <AlertTriangle size={18} /> Fix issues and complete all tests before shipping.
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {TEST_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                            "p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:shadow-lg hover:shadow-slate-100",
                            checkedItems[item.id] ? "bg-white border-emerald-200 shadow-sm" : "bg-white border-slate-100"
                        )}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                            checkedItems[item.id] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 bg-slate-50"
                        )}>
                            {checkedItems[item.id] && <CheckCircle2 size={16} />}
                        </div>

                        <div className="flex-1 space-y-2">
                            <h4 className={cn("font-bold text-lg", checkedItems[item.id] ? "text-slate-900" : "text-slate-600")}>
                                {item.label}
                            </h4>
                            <div className="flex items-start gap-2 text-slate-400">
                                <Info size={14} className="mt-0.5" />
                                <p className="text-xs font-semibold leading-relaxed italic">{item.hint}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestChecklist;
