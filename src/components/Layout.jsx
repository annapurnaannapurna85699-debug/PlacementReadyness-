import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileCheck,
    Library,
    UserCircle,
    Menu,
    Bell,
    History as HistoryIcon
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Placement Prep</span>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/history" icon={HistoryIcon} label="History" />
                    <SidebarItem to="/practice" icon={BookOpen} label="Practice" />
                    <SidebarItem to="/assessments" icon={FileCheck} label="Assessments" />
                    <SidebarItem to="/resources" icon={Library} label="Resources" />
                    <SidebarItem to="/profile" icon={UserCircle} label="Profile" />
                </nav>

                <div className="mt-auto p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">Trial Period</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2">
                        <div className="bg-primary w-2/3 h-1.5 rounded-full"></div>
                    </div>
                    <p className="text-xs text-slate-600">8 days remaining</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-slate-600">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:block">
                            Overview
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">John Doe</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none mt-1">Free Tier</p>
                            </div>
                            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
