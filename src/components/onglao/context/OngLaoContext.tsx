"use client";

import React, { createContext, useContext } from 'react';

const OngLaoContext = createContext<any>(null);

export const OngLaoProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {
  return (
    <OngLaoContext.Provider value={value}>
      {children}
    </OngLaoContext.Provider>
  );
};

export const useOngLaoContext = () => {
  const context = useContext(OngLaoContext);
  if (!context) {
    throw new Error('useOngLaoContext must be used within an OngLaoProvider');
  }
  return context;
};
