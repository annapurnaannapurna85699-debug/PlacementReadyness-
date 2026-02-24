import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import History from './pages/History';
import TestChecklist from './pages/TestChecklist';
import ShipLock from './pages/ShipLock';

// Placeholder Pages
const Practice = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Practice Problems</h1>
        <p className="text-slate-500">Pick a topic to start practicing.</p>
    </div>
);

const Assessments = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Mock Assessments</h1>
        <p className="text-slate-500">Scheduled and previous assessments appear here.</p>
    </div>
);

const Resources = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Study Resources</h1>
        <p className="text-slate-500">Curated materials for your preparation.</p>
    </div>
);

const Profile = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <p className="text-slate-500">Manage your settings and preferences.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />

                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/practice" element={<Practice />} />
                    <Route path="/assessments" element={<Assessments />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/prp/07-test" element={<TestChecklist />} />
                    <Route path="/prp/08-ship" element={<ShipLock />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/results/:id" element={<Results />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
