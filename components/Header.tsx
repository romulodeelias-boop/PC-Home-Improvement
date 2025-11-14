import React from 'react';

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

interface HeaderProps {
    onMenuClick: () => void;
}


const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-surface p-4 flex justify-between items-center flex-shrink-0 border-b border-secondary">
        <button 
            onClick={onMenuClick} 
            className="md:hidden text-text-secondary hover:text-text-primary"
            aria-label="Open navigation menu"
        >
            <MenuIcon />
        </button>
        
        <div className="hidden md:block"></div> 

        <div className="flex items-center gap-6">
            <button className="text-text-secondary hover:text-text-primary"><UserIcon /></button>
            <button className="text-text-secondary hover:text-text-primary"><LogoutIcon /></button>
        </div>
    </header>
  );
};

export default Header;