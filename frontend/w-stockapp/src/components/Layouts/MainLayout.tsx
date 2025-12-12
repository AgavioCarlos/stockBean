import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SessionTimeout from '../SessionTimeout';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState === 'true';
    });

    // Persist collapsed state whenever it changes
    React.useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]); 

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SessionTimeout />
            <Header isSidebarOpen={isSidebarOpen} sidebarCollapsed={sidebarCollapsed} />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />

            {/* Main Content Wrapper */}
            <main
                className="flex-grow p-4 md:px-4 md:pb-8 pt-2 transition-all duration-300 ease-in-out mt-1"
                style={{
                    marginLeft: isSidebarOpen ? (sidebarCollapsed ? 80 : 288) : 0
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
