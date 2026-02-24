import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, BarChart3 } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white pt-24 pb-32 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                        Ace Your <span className="text-primary">Placement</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Practice, assess, and prepare for your dream job with our comprehensive technical interview preparation platform.
                    </p>
                    <Link
                        to="/dashboard"
                        className="bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16 underline decoration-primary decoration-4 underline-offset-8">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Code className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Practice Problems</h3>
                            <p className="text-slate-600">Solve hundreds of curated DSA and system design problems.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Video className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mock Interviews</h3>
                            <p className="text-slate-600">Experience real-world interview scenarios with peer-to-peer mocking.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <BarChart3 className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                            <p className="text-slate-600">Monitor your growth and identify areas for improvement with detailed metrics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-12 px-4 border-t border-slate-200">
                <div className="max-w-6xl mx-auto text-center text-slate-500">
                    <p>© {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
