import React, { useState, useEffect } from 'react';
import Header from './Header';
import SessionTimeout from '../SessionTimeout';
import DynamicSidebar from './DynamicSidebar';
import { useResponsive } from '../../hooks/useResponsive';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { isMobile } = useResponsive();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState === 'true';
    });

    // Handle screen resize: Adjust sidebar visibility
    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [isMobile]);

    // Persist collapsed state
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    // Sidebar and Header share the same margin calculation for desktop
    const desktopMargin = !isMobile && isSidebarOpen ? (sidebarCollapsed ? 80 : 288) : 0;

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-blue-100/40 rounded-full blur-[100px]"></div>
            </div>

            <SessionTimeout />
            <Header
                isSidebarOpen={isSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                onOpenSidebar={() => setIsSidebarOpen(true)}
            />

            <DynamicSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />

            {/* Main Content Wrapper */}
            <main
                className="flex-grow p-4 md:p-8 transition-all duration-300 ease-in-out relative z-10"
                style={{
                    marginLeft: desktopMargin
                }}
            >
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
