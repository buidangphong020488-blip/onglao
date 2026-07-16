"use client";

import React, { createContext, useContext } from 'react';
import { useVideoExport } from '../hooks/useVideoExport';

const VideoExportContext = createContext<any>(null);

export const VideoExportProvider = ({ children, hookProps }: { children: React.ReactNode, hookProps: any }) => {
  const value = useVideoExport(hookProps);
  return (
    <VideoExportContext.Provider value={value}>
      {children}
    </VideoExportContext.Provider>
  );
};

export const useVideoExportContext = () => {
  const context = useContext(VideoExportContext);
  if (!context) {
    throw new Error('useVideoExportContext must be used within a VideoExportProvider');
  }
  return context;
};
