"use client"
import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  initialSearchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function AppLayout({ 
  children, 
  initialSearchQuery = '', 
  onSearchChange = () => {} 
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="md:ml-60">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onMenuClick={toggleSidebar}
        />
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div 
        className={`fixed top-0 left-0 bottom-0 z-50 w-60 bg-card transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <Sidebar />
      </div>
    </div>
  );
}
