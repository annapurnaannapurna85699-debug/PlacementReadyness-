import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Rocket, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ShipLock = () => {
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            const checklist = JSON.parse(saved);
            const passedCount = Object.values(checklist).filter(Boolean).length;
            if (passedCount === 10) {
                setIsLocked(false);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 border-4 border-red-100 animate-bounce">
                    <Lock size={48} />
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shipping Locked</h1>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                        Security requirement: You must complete all 10 QA tests on the checklist before unlocking the ship module.
                    </p>
                </div>
                <Link
                    to="/prp/07-test"
                    className="bg-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-lg"
                >
                    Go to QA Checklist
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-white border-[12px] border-emerald-100 shadow-2xl shadow-emerald-200">
                <Rocket size={56} className="animate-pulse" />
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm">
                    <CheckCircle2 size={18} /> QA Standards Met
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Ready for Deployment</h1>
                <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                    All 10 tests passed successfully. The Placement Readiness Platform is hardened, validated, and optimized for placement cycles.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 text-lg">
                    Build Production V1.0
                </button>
                <Link
                    to="/dashboard"
                    className="bg-white border text-slate-600 font-bold py-4 px-10 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 text-lg"
                >
                    <ChevronLeft size={20} /> Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ShipLock;
