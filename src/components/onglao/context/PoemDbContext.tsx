"use client";

import React, { createContext, useContext } from 'react';
import { usePoemDb } from '../hooks/usePoemDb';

const PoemDbContext = createContext<any>(null);

export const PoemDbProvider = ({ children, hookProps }: { children: React.ReactNode, hookProps: any }) => {
  const value = usePoemDb(hookProps);
  return (
    <PoemDbContext.Provider value={value}>
      {children}
    </PoemDbContext.Provider>
  );
};

export const usePoemDbContext = () => {
  const context = useContext(PoemDbContext);
  if (!context) {
    throw new Error('usePoemDbContext must be used within a PoemDbProvider');
  }
  return context;
};
