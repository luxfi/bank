'use client';
import React, { createContext, useContext, useState } from 'react';

type ToggleSidebar = () => void;

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: ToggleSidebar;
};

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggleSidebar: () => {},
});

// CUSTOM HOOK ==================================
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// PROVIDER ================================
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar: ToggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
