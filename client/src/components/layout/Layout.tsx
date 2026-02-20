import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = () => {
    return (
        <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
