import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
}

const CarpentryLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="14.29" y1="14.29" x2="16.66" y2="16.66"/>
    <line x1="9.71" y1="14.29" x2="7.34" y2="16.66"/>
    <line x1="9.71" y1="9.71" x2="7.34" y2="7.34"/>
    <line x1="14.29" y1="9.71" x2="16.66" y2="7.34"/>
    <line x1="12" y1="4" x2="12" y2="2"/>
    <line x1="4" y1="12" x2="2" y2="12"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
  </svg>
);


const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
);
const ListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8a6 6 0 0 0-8.1-4.2l-4.1 2.3a1 1 0 0 0 .5 1.8l3.6.8a1 1 0 0 1 .8 1.4l-2 3.1a1 1 0 0 0 1.6 1.2l2.7-3.2a1 1 0 0 1 1.4.3l2.8 3.9a1 1 0 0 0 1.7-.5l.8-2.3a6 6 0 0 0-4.2-8.1z"></path></svg>
);


const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <li className="mb-2">
        <button
            onClick={onClick}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive
                ? 'bg-primary text-white shadow-lg'
                : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
            }`}
        >
            {icon}
            <span className="ml-4 font-medium">{label}</span>
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setMobileOpen }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { view: 'services', label: 'Serviços', icon: <WrenchIcon className="w-6 h-6" /> },
    { view: 'work-orders', label: 'Ordens de Serviço', icon: <ListIcon className="w-6 h-6" /> },
    { view: 'analytics', label: 'Análises', icon: <ChartIcon className="w-6 h-6" /> },
  ];
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface">
        <div className="flex items-center mb-10 p-4 border-b border-secondary">
            <CarpentryLogoIcon className="w-10 h-10 text-primary" />
            <h1 className="text-xl font-bold ml-3 text-text-primary">PC Home Improvement</h1>
        </div>
        <nav className="flex-1 px-4">
            <ul>
                {navItems.map(item => (
                    <NavItem 
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        onClick={() => setView(item.view)}
                    />
                ))}
            </ul>
        </nav>
    </div>
  );


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-secondary hidden md:block">
        <SidebarContent />
      </aside>
      
      {/* Mobile Sidebar (off-canvas) */}
      <div 
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed inset-y-0 left-0 w-64 z-40 transform transition-transform md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;