import React from 'react';
import { View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
}

// Icons for navigation buttons
const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
);
const ListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8a6 6 0 0 0-8.1-4.2l-4.1 2.3a1 1 0 0 0 .5 1.8l3.6.8a1 1 0 0 1 .8 1.4l-2 3.1a1 1 0 0 0 1.6 1.2l2.7-3.2a1 1 0 0 1 1.4.3l2.8 3.9a1 1 0 0 0 1.7-.5l.8-2.3a6 6 0 0 0-4.2-8.1z"></path></svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-surface p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-start"
  >
    <div className="text-primary mb-2">
      {icon}
    </div>
    <span className="font-semibold text-text-primary">{label}</span>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const navItems = [
    { view: 'services', label: 'Serviços', icon: <WrenchIcon className="w-7 h-7" /> },
    { view: 'work-orders', label: 'Ordens de Serviço', icon: <ListIcon className="w-7 h-7" /> },
    { view: 'analytics', label: 'Análises', icon: <ChartIcon className="w-7 h-7" /> },
    { view: 'settings', label: 'Configurações', icon: <SettingsIcon className="w-7 h-7" /> },
  ];

  const handleNavigation = (view: View | 'settings') => {
      if (view !== 'settings') {
          setView(view);
      } else {
          // Placeholder for settings functionality
          alert("A tela de configurações será implementada em breve!");
      }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {navItems.map((item) => (
          <NavButton
            key={item.view}
            icon={item.icon}
            label={item.label}
            onClick={() => handleNavigation(item.view as any)}
          />
        ))}
      </div>

       {/* Future content for the dashboard can be added here, like stats or recent activity */}
    </div>
  );
};

export default Dashboard;