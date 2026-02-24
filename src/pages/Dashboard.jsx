import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Calendar, ChevronRight, CheckCircle2, Clock, Zap } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { analyzeJD, saveToHistory } from '../utils/analysisEngine';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Card = ({ className, children }) => (
    <div className={cn("bg-white border text-card-foreground shadow-sm rounded-xl", className)}>
        {children}
    </div>
);

const CardHeader = ({ className, children }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
        {children}
    </div>
);

const CardTitle = ({ className, children }) => (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
        {children}
    </h3>
);

const CardContent = ({ className, children }) => (
    <div className={cn("p-6 pt-0", className)}>
        {children}
    </div>
);

const radarData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const Dashboard = () => {
    const [formData, setFormData] = React.useState({ company: '', role: '', jd: '' });
    const navigate = useNavigate();

    const handleAnalyze = (e) => {
        e.preventDefault();
        const results = analyzeJD(formData.company, formData.role, formData.jd);
        saveToHistory(results);
        navigate(`/results/${results.id}`);
    };

    const score = 72;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Placement Preparation</h1>
                <p className="text-slate-500">Analyze Job Descriptions and get a personalized 7-day preparation plan.</p>
            </div>

            {/* Analysis Form Section */}
            <Card className="border-t-4 border-t-primary shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl">New Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                                <input
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder="e.g. Google, Stripe..."
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Target Role</label>
                                <input
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    placeholder="e.g. Software Engineer, Frontend..."
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Job Description</label>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="Paste the JD here to extract skills and generate a plan..."
                                value={formData.jd}
                                onChange={e => setFormData({ ...formData, jd: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30 w-full md:w-auto"
                        >
                            Generate Analysis Logic
                        </button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">

                    {/* Overall Readiness */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Readiness</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-4">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle
                                        className="text-slate-100"
                                        strokeWidth="12"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r={radius}
                                        cx="96"
                                        cy="96"
                                    />
                                    <circle
                                        className="text-primary transition-all duration-1000 ease-out"
                                        strokeWidth="12"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r={radius}
                                        cx="96"
                                        cy="96"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-5xl font-black text-slate-900">{score}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Score / 100</span>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-center text-slate-500 max-w-[240px]">
                                You are outperforming <span className="text-primary font-bold">84%</span> of students this week.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Skill Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                                    <Radar
                                        name="Student"
                                        dataKey="A"
                                        stroke="hsl(245, 58%, 51%)"
                                        fill="hsl(245, 58%, 51%)"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">

                    {/* Continue Practice */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">Continue Practice</CardTitle>
                            <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                                <ChevronRight size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h4 className="text-2xl font-bold mb-4">Dynamic Programming</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span className="text-slate-500">Module Progress</span>
                                    <span className="text-slate-900">3/10 Completed</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[30%]" />
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-lg text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20">
                                Continue Module
                            </button>
                        </CardContent>
                    </Card>

                    {/* Weekly Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-500">Problems Solved</span>
                                    <span className="font-bold text-slate-900">12/20 this week</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[60%]" />
                                </div>
                            </div>

                            <div className="flex justify-between px-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2",
                                            i < 3
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                                                : "bg-white border-slate-100 text-slate-300"
                                        )}>
                                            {i < 3 && <CheckCircle2 size={14} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Assessments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', status: 'Upcoming', color: 'bg-amber-100 text-amber-700' },
                                { title: 'System Design Review', time: 'Wed, 2:00 PM', status: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
                                { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', status: 'Ready', color: 'bg-emerald-100 text-emerald-700' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={12} className="text-slate-400" />
                                            <span className="text-xs text-slate-500">{item.time}</span>
                                        </div>
                                    </div>
                                    <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-md", item.color)}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
